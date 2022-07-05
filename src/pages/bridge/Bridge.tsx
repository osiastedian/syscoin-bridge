import { CircularProgress, Container, Grid, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import BridgeTransferStepper from "../../components/Bridge/Stepper";
import BridgeTransferStepSwitch from "../../components/Bridge/Transfer/StepSwitch";
import BridgeWalletSwitch from "../../components/Bridge/WalletSwitch";
import DrawerPage from "../../components/DrawerPage";
import TransferProvider from "../../contexts/Transfer/Provider";

const Bridge: React.FC = () => {
  const { id } = useParams();

  if (!id) {
    return <CircularProgress />;
  }

  return (
    <TransferProvider id={id as string}>
      <DrawerPage>
        <Container sx={{ mt: 10 }}>
          <Typography variant="h5" fontWeight="bold">
            Bridge Tokens
          </Typography>
          <Typography variant="caption" color="gray">
            Transfer SYS back and forth between the Syscoin and NEVM
            blockchains.
          </Typography>

          <Typography variant="body1" sx={{ my: 3 }}>
            New Transfer
          </Typography>
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
