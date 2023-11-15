import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { TransactionConfig } from "web3-core";
import Web3 from "web3";
import { NEVMNetwork } from "../Transfer/constants";
import { useQuery } from "react-query";
import { useMetamask } from "@contexts/Metamask/Provider";
import { usePaliWallet } from "@contexts/PaliWallet/usePaliWallet";
import { IPaliWalletV2Context } from "@contexts/PaliWallet/V2Provider";
import { captureException } from "@sentry/nextjs";

interface INEVMContext {
  account?: string;
  balance?: string;
  isTestnet: boolean;
  chainId?: string;
  switchToMainnet: () => void;
  sendTransaction: (transactionConfig: TransactionConfig) => Promise<string>;
  signMessage: (message: string) => Promise<string>;
  connect: () => void;
}

export const MAINNET_CHAIN_ID = "0x39";

const NEVMContext = createContext({} as INEVMContext);

export const useNEVM = () => useContext(NEVMContext);

type NEVMProviderProps = {
  children: React.ReactNode;
};

const NEVMProvider: React.FC<NEVMProviderProps> = ({ children }) => {
  const [isChainChangedCallbackSet, setIsChainChangedCallbackSet] =
    useState(false);
  const { data: isEthereumAvailable } = useQuery(["nevm", "isEthAvailable"], {
    queryFn: () => {
      return typeof window.ethereum !== "undefined";
    },
  });

  const metamask = useMetamask();
  const paliWallet = usePaliWallet() as IPaliWalletV2Context;
  const isEnabled = useMemo(() => {
    if (!isEthereumAvailable) {
      return false;
    }
    if (paliWallet.version === "v2" && paliWallet.isEVMInjected) {
      return !paliWallet.isBitcoinBased;
    }
    return metamask.isEnabled;
  }, [
    metamask.isEnabled,
    paliWallet.version,
    paliWallet.isEVMInjected,
    paliWallet.isBitcoinBased,
    isEthereumAvailable,
  ]);
  const web3 = useMemo(() => {
    if (!isEnabled) {
      return null;
    }
    return new Web3(window.ethereum);
  }, [isEnabled]);

  const { data: isTestnet } = useQuery(
    ["nevm", "isTestnet"],
    () => window?.ethereum?.networkVersion !== parseInt("0x39", 16).toString(),
    {
      enabled: isEnabled,
      refetchInterval: 1000,
    }
  );

  const account = useQuery(["nevm", "account"], {
    queryFn: async () => {
      const result: (string | { success: false })[] =
        await window.ethereum.request({
          method: "eth_requestAccounts",
        });
      if (
        result.length > 0 &&
        typeof result[0] === "string" &&
        web3?.utils.isAddress(result[0])
      ) {
        return result[0];
      }
      return Promise.reject("No account found");
    },
    enabled: Boolean(web3) && isEnabled,
  });

  const balance = useQuery(["nevm", "balance"], {
    queryFn: () => {
      if (!isEnabled || !web3 || !account.data) {
        return;
      }
      return web3.eth
        .getBalance(account.data)
        .then((balance) => web3.utils.fromWei(balance || "0"));
    },
    enabled: Boolean(isEnabled && account.isFetched && account.data),
  });

  const chainId = useQuery(
    ["nevm", "chainId"],
    async () => window.ethereum.request({ method: "eth_chainId" }),
    { enabled: isEnabled, refetchOnMount: true, refetchOnWindowFocus: true }
  );

  const sendTransaction = (config: TransactionConfig) => {
    return window.ethereum.request({
      method: "eth_sendTransaction",
      params: [config],
    });
  };

  const switchToMainnet = () => {
    window.ethereum
      .request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: MAINNET_CHAIN_ID }],
      })
      .then(() => chainId.refetch())
      .catch((err) => {
        const { code } = err;
        captureException(err);
        if (code === 4902) {
          window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [NEVMNetwork],
          });
        }
      });
  };

  const connect = () => {
    account.refetch();
  };

  const signMessage = (message: string): Promise<string> => {
    return window.ethereum.request({
      method: "personal_sign",
      params: [message, account.data],
    });
  };

  useEffect(() => {
    if (chainId.isFetched && !isChainChangedCallbackSet) {
      window.ethereum.on("chainChanged", () => {
        chainId.refetch();
      });
      setIsChainChangedCallbackSet(true);
    }
  }, [chainId.isFetched, chainId, isChainChangedCallbackSet]);

  return (
    <NEVMContext.Provider
      value={{
        account: account.isSuccess && account.data ? account.data : undefined,
        sendTransaction,
        balance: balance.data,
        isTestnet: !!isTestnet,
        switchToMainnet,
        connect,
        chainId: chainId.isSuccess && chainId.data ? chainId.data : undefined,
        signMessage,
      }}
    >
      {children}
    </NEVMContext.Provider>
  );
};

export default NEVMProvider;
