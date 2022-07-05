import { ThemeProvider } from "@mui/material";
import { QueryClient, QueryClientProvider } from "react-query";
import { useMemo } from "react";
import { useRoutes } from "react-router-dom";
import Home from "./pages/Home";
import theme from "./components/theme";
import PaliWalletContextProvider from "./contexts/PaliWallet/Provider";
import MetamaskProvider from "./contexts/Metamask/Provider";
import ConnectedWalletProvider from "./contexts/ConnectedWallet/Provider";
import Bridge from "./pages/bridge/Bridge";
const App = () => {
  const queryClient = useMemo(() => new QueryClient(), []);

  const routes = useRoutes([
    {
      path: "/bridge/:id",
      element: <Bridge />,
    },
    {
      path: "/",
      element: <Home />,
    },
  ]);

  return (
    <PaliWalletContextProvider>
      <ThemeProvider theme={theme}>
        <MetamaskProvider>
          <ConnectedWalletProvider>
            <QueryClientProvider client={queryClient}>
              {routes}
            </QueryClientProvider>
          </ConnectedWalletProvider>
        </MetamaskProvider>
      </ThemeProvider>
    </PaliWalletContextProvider>
  );
};

export default App;
