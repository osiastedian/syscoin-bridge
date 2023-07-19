import NEVMProvider from "@contexts/ConnectedWallet/NEVMProvider";
import ConnectedWalletProvider from "@contexts/ConnectedWallet/Provider";
import MetamaskProvider from "@contexts/Metamask/Provider";
import { PaliWalletV2Provider } from "@contexts/PaliWallet/V2Provider";
import { ITransfer, TransferType } from "@contexts/Transfer/types";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Typography,
} from "@mui/material";
import BlocktimeDisclaimer from "components/BlocktimeDisclaimer";
import TransferTitle from "components/Bridge/Transfer/Title";
import BridgeV3SavingIndicator from "components/Bridge/v3/SavingIndicator";
import BridgeV3StepSwitch from "components/Bridge/v3/StepSwitch";
import BridgeV3Stepper from "components/Bridge/v3/Stepper";
import { SyscoinProvider } from "components/Bridge/v3/context/Syscoin";
import { TransferContextProvider } from "components/Bridge/v3/context/TransferContext";
import { Web3Provider } from "components/Bridge/v3/context/Web";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useMemo } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import TableRowsIcon from "@mui/icons-material/TableRows";
import NextLink from "next/link";
import BridgeV3TransferSwitchTypeCard from "components/Bridge/v3/TransferSwitchTypeCard";

const createTransfer = (type: TransferType): ITransfer => ({
  amount: "0",
  id: `${Date.now()}`,
  type,
  status: "initialize",
  logs: [],
  createdAt: Date.now(),
  version: "v2",
});

const BridgeV3Page: NextPage = () => {
  const { query } = useRouter();
  const queryClient = useMemo(() => new QueryClient(), []);

  const initialTransfer = useMemo(() => {
    const id = query.id;
    if (id === "sys-to-nevm" || id === "nevm-to-sys") {
      return createTransfer(id);
    }
    return {
      id,
    } as ITransfer;
  }, [query.id]);

  return (
    <SyscoinProvider>
      <Web3Provider>
        <QueryClientProvider client={queryClient}>
          <PaliWalletV2Provider>
            <MetamaskProvider>
              <NEVMProvider>
                <ConnectedWalletProvider>
                  <TransferContextProvider transfer={initialTransfer}>
                    <Container sx={{ mt: 10 }}>
                      <BlocktimeDisclaimer />
                      <Typography variant="h5" fontWeight="bold">
                        Bridge Your SYS
                      </Typography>
                      <Typography variant="caption" color="gray">
                        Trustlessly transfer SYS back and forth between the
                        Syscoin UTXO and Syscoin NEVM blockchains without
                        middlemen!
                      </Typography>
                      <Box sx={{ my: 3 }}>
                        <TransferTitle />
                        <Button LinkComponent={NextLink} href="/transfers/v2">
                          <TableRowsIcon />
                          View All Transfers
                        </Button>
                      </Box>
                      <BridgeV3Stepper />
                      <Box sx={{ mt: 3, mb: 2, width: "50%" }}>
                        <BridgeV3TransferSwitchTypeCard />
                      </Box>
                      <Card
                        sx={{
                          mt: 1,
                          display: "flex",
                          flexDirection: "column",
                          minWidth: "20rem",
                          width: "50%",
                        }}
                      >
                        <CardContent>
                          <BridgeV3StepSwitch />
                          <BridgeV3SavingIndicator />
                        </CardContent>
                      </Card>
                    </Container>
                  </TransferContextProvider>
                </ConnectedWalletProvider>
              </NEVMProvider>
            </MetamaskProvider>
          </PaliWalletV2Provider>
        </QueryClientProvider>
      </Web3Provider>
    </SyscoinProvider>
  );
};

export default BridgeV3Page;
