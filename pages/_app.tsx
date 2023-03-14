import { ChakraProvider, extendTheme, Flex } from "@chakra-ui/react";
import { PaliWalletV2Provider } from "@contexts/PaliWallet/V2Provider";
import { ThemeProvider } from "@mui/material";
import { Config, DAppProvider } from "@usedapp/core";
import {
  RolluxChain,
  TanenbaumChain,
} from "blockchain/NevmRolluxBridge/config/chainsUseDapp";
import { NetworkValidator } from "components/Common/NetworkValidator";
import { Header } from "components/Header";
import { RolluxHeader } from "components/RolluxHeader";
import type { AppProps } from "next/app";
import { Roboto } from "next/font/google";
import { useRouter } from "next/router";
import { QueryClient, QueryClientProvider } from "react-query";
import theme from "../components/theme";
import ConnectedWalletProvider from "../contexts/ConnectedWallet/Provider";
import MetamaskProvider from "../contexts/Metamask/Provider";
import PaliWalletContextProvider from "../contexts/PaliWallet/Provider";
import "../styles/globals.css";

const queryClient = new QueryClient();

const dappConfig: Config = {
  readOnlyChainId: 5700,
  readOnlyUrls: {
    [5700]: "https://rpc.tanenbaum.io",
    [57000]: "https://rpc-bedrock.rollux.com/",
  },
  multicallAddresses: {
    [5700]: "0x1F359C32b5D8c9678b076eAac411A4d2Eb11E697", // multicall 2 address.
    [57000]: "0x1F359C32b5D8c9678b076eAac411A4d2Eb11E697",
  },
  networks: [RolluxChain, TanenbaumChain],
};

function MyApp({ Component, pageProps }: AppProps) {
  const { pathname } = useRouter();

  return (
    <QueryClientProvider client={queryClient}>
      <PaliWalletV2Provider>
        <MetamaskProvider>
          <ConnectedWalletProvider>
            <DAppProvider config={dappConfig}>
              {/* <NetworkValidator> */}
              <ThemeProvider theme={theme}>
                <Component {...pageProps} />
              </ThemeProvider>
              {/* </NetworkValidator> */}
            </DAppProvider>
          </ConnectedWalletProvider>
        </MetamaskProvider>
      </PaliWalletV2Provider>
    </QueryClientProvider>
  );
}

export default MyApp;
