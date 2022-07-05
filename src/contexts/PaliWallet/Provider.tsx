import React, { createContext, useEffect, useState } from "react";
import { UTXOTransaction } from "syscoinjs-lib";
import { utils as syscoinUtils } from "syscoinjs-lib";
import { PaliWallet } from "./types";

interface ConnectionsController {
  connectWallet: () => Promise<void>;
  disconnectWallet: () => Promise<void>;
  getConnectedAccount: () => Promise<PaliWallet.Account>;
  onWalletUpdate: (fn: () => Promise<any>) => Promise<any>;
  getConnectedAccountXpub: () => Promise<string>;
  signAndSend: (psbt: UTXOTransaction) => Promise<UTXOTransaction>;
  signPSBT: (psbt: UTXOTransaction) => Promise<UTXOTransaction>;
  getWalletState: () => Promise<PaliWallet.WalletState>;
}

declare global {
  interface Window {
    SyscoinWallet?: string;
    ConnectionsController?: ConnectionsController;
  }
}

interface IPaliWalletContext {
  isInstalled?: boolean;
  connectedAccount?: string;
  xpubAddress?: string;
  connectWallet: () => void;
  balance: number | undefined;
  sendTransaction: (
    transaction: UTXOTransaction
  ) => Promise<{ tx: string; error?: any }>;
}

export const PaliWalletContext = createContext({} as IPaliWalletContext);

const PaliWalletContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [controller, setController] = useState<ConnectionsController>();
  const [isInstalled, setIsInstalled] = useState<boolean>();
  const [connectedAccount, setConnectedAccount] = useState<string>();
  const [xpubAddress, setXpubAddress] = useState<string>();
  const [walletState, setWalletState] = useState<PaliWallet.WalletState>();

  const connectWallet = () => {
    if (!controller) {
      return;
    }
    return controller.connectWallet();
  };

  const sendTransaction = async (transaction: UTXOTransaction) => {
    if (!controller) {
      return Promise.reject("No controller");
    }
    const account = await controller.getConnectedAccount();
    if (account === null) {
      await connectWallet();
    }
    const signedTransaction = await controller.signAndSend(transaction);
    const unserializedResp = syscoinUtils.importPsbtFromJson(
      signedTransaction,
      syscoinUtils.syscoinNetworks.mainnet
    );
    return {
      tx: unserializedResp.psbt.extractTransaction().getId(),
      error: null,
    };
  };

  useEffect(() => {
    if (window === undefined) {
      return;
    }

    const check = (intervalId?: NodeJS.Timeout) => {
      if (window && window.ConnectionsController && !isInstalled) {
        setIsInstalled(true);
        const controller = window.ConnectionsController;
        setController(window.ConnectionsController);
        controller.onWalletUpdate(async () => {
          const xpubAddress = await controller.getConnectedAccountXpub();
          const account = await controller.getConnectedAccount();
          const walletState = await controller.getWalletState();
          setConnectedAccount(account ? account.address.main : undefined);
          setXpubAddress(xpubAddress);
          setWalletState(walletState);
        });
        clearInterval(intervalId);
      }
    };

    check();

    if (!isInstalled) {
      setTimeout(() => {
        if (isInstalled === undefined) {
          setIsInstalled(false);
        }
      }, 10000);
      const checkInterval = setInterval(() => {
        check(checkInterval);
      }, 100);
    }

    return () => {
      if (controller) {
        controller.disconnectWallet();
      }
    };
  }, [controller, isInstalled]);

  return (
    <PaliWalletContext.Provider
      value={{
        isInstalled,
        connectedAccount,
        connectWallet,
        xpubAddress,
        sendTransaction,
        balance: walletState?.accounts.find(
          (account) => account.address.main === connectedAccount
        )?.balance,
      }}
    >
      {children}
    </PaliWalletContext.Provider>
  );
};

export default PaliWalletContextProvider;
