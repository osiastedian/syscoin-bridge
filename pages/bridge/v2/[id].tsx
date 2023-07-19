import { CircularProgress, Container, Grid, Typography } from "@mui/material";
import BlocktimeDisclaimer from "components/BlocktimeDisclaimer";
import DrawerPage from "components/DrawerPage";
import { NextPage } from "next";
import { useRouter } from "next/router";
import BridgeTransferStepper from "components/Bridge/Stepper";
import TransferProvider from "@contexts/Transfer/Provider";
import BridgeWalletSwitch from "components/Bridge/WalletSwitchV2";
import TransferTitle from "components/Bridge/Transfer/Title";
import BridgeTransferStepSwitch from "components/Bridge/Transfer/StepSwitch";
import { useConnectedWallet } from "@contexts/ConnectedWallet/useConnectedWallet";
import { INavigationItem } from "components/Navigation/Item";

const Bridge: NextPage = () => {
  const { nevm, utxo } = useConnectedWallet();
  const router = useRouter();

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
    <TransferProvider
      id={id as string}
      includeSwitchStep={nevm.type === utxo.type}
    >
      <DrawerPage routes={routes}>
        <BlocktimeDisclaimer />
        <Container sx={{ mt: 10 }}>
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
