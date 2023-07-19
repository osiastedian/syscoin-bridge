import {
  Alert,
  Button,
  CircularProgress,
  Container,
  Grid,
  Typography,
} from "@mui/material";
import { NextPage } from "next";
import DrawerPage from "../../components/DrawerPage";
import TransferProvider from "../../contexts/Transfer/Provider";
import BridgeTransferStepSwitch from "components/Bridge/Transfer/StepSwitch";
import BridgeTransferStepper from "components/Bridge/Stepper";
import { useRouter } from "next/router";
import { ITransfer } from "contexts/Transfer/types";
import BridgeWalletSwitch from "components/Bridge/WalletSwitch";
import { usePaliWallet } from "@contexts/PaliWallet/usePaliWallet";
import BlocktimeDisclaimer from "components/BlocktimeDisclaimer";
import TransferTitle from "components/Bridge/Transfer/Title";
import { useNEVM } from "@contexts/ConnectedWallet/NEVMProvider";
import { INavigationItem } from "components/Navigation/Item";
import { useConnectedWallet } from "@contexts/ConnectedWallet/useConnectedWallet";

interface Props {
  transfer: ITransfer;
}

const Bridge: NextPage<Props> = ({ transfer }) => {
  const router = useRouter();
  const paliWallet = usePaliWallet();
  const metamask = useNEVM();
  const { nevm, utxo } = useConnectedWallet();
  const { id } = router.query;

  const routes: INavigationItem[] = [
    {
      label: "New Transfer",
      path: `/bridge/${utxo.type === nevm.type ? "v2/" : ""}${Date.now()}`,
    },
    {
      label: "My Transfers",
      path: "/transfers",
    },
    {
      label: "FAQ",
      path: "/#faq",
    },
  ];

  if (!id) {
    return <CircularProgress />;
  }

  return (
    <TransferProvider id={id as string}>
      <DrawerPage routes={routes}>
        <BlocktimeDisclaimer />
        <Container sx={{ mt: 10 }}>
          {paliWallet.isTestnet && (
            <Alert severity="error" sx={{ mb: 2 }}>
              Your Pali Wallet is not set to SYS Main Network.
            </Alert>
          )}
          {metamask.isTestnet && (
            <Alert
              severity="error"
              action={
                <Button onClick={() => metamask.switchToMainnet()}>
                  Switch
                </Button>
              }
              sx={{ mb: 2 }}
            >
              Your Metamask is not set to NEVM Main Network.
            </Alert>
          )}
          <Typography variant="h5" fontWeight="bold">
            Bridge Your SYS
          </Typography>
          <Typography variant="caption" color="gray">
            Trustlessly transfer SYS back and forth between the Syscoin Base and
            Syscoin NEVM blockchains without middlemen!
          </Typography>
          <TransferTitle sx={{ my: 3 }} />
          <BridgeWalletSwitch />
          <BridgeTransferStepper />
          <Grid container>
            <Grid item xs="auto" sx={{ mx: "auto" }}>
              <BridgeTransferStepSwitch />
            </Grid>
          </Grid>
        </Container>
      </DrawerPage>
    </TransferProvider>
  );
};

export default Bridge;
