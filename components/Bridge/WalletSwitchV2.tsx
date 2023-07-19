import { usePaliWalletV2 } from "@contexts/PaliWallet/usePaliWallet";
import { useTransfer } from "@contexts/Transfer/useTransfer";
import { CompareArrows } from "@mui/icons-material";
import {
  Grid,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
} from "@mui/material";
import SyscoinLogo from "components/Icons/syscoin";
import UTXOConnect from "./WalletSwitchV2/UTXOConnect";
import NEVMConnect from "./WalletSwitchV2/NEVMConnect";

type WalletInfoCardProps = {
  label: string;
  walletType: "utxo" | "nevm" | string;
  account: string | undefined;
  network: {
    name: string;
    symbol: string;
  };
};

const WalletInfoCard: React.FC<WalletInfoCardProps> = ({
  network,
  walletType,
}) => {
  const { transfer, setUtxo, setNevm } = useTransfer();
  return (
    <Card variant="outlined" sx={{ mb: 1 }}>
      <CardContent
        sx={{
          p: "1rem !important",
          width: "100%",
          display: "flex",
          alignItems: "center",
        }}
      >
        <SyscoinLogo />
        <Box
          display="inline-block"
          sx={{ ml: 1, flex: 1, maxWidth: "calc(100% - 16px - 48px)" }}
        >
          <Typography variant="h6" display="block">
            {network.name}
          </Typography>
          {walletType === "utxo" && (
            <UTXOConnect setUtxo={setUtxo} transfer={transfer} />
          )}
          {walletType === "nevm" && (
            <NEVMConnect setNevm={setNevm} transfer={transfer} />
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

const BridgeWalletSwitch: React.FC = () => {
  const {
    transfer: { type, status, amount },
    setTransferType,
  } = useTransfer();

  const {} = usePaliWalletV2();

  const utxoWalletInfo = {
    walletType: "utxo",
    account: "0x0",
    network: { name: "Syscoin Network", symbol: "SYS" },
  };

  const nevmWalletInfo = {
    walletType: "nevm",
    account: "0x0",
    network: { name: "NEVM Network", symbol: "NEVM" },
  };

  return (
    <Grid container spacing={2} sx={{ mb: 3 }}>
      <Grid item xs={5}>
        <WalletInfoCard
          label="From"
          {...(type === "sys-to-nevm" ? utxoWalletInfo : nevmWalletInfo)}
        />
      </Grid>
      <Grid item xs={2} display="flex">
        <Box sx={{ m: "auto", textAlign: "center" }}>
          {status !== "initialize" && (
            <Typography variant="body1" color="primary">
              {amount} SYS
            </Typography>
          )}
          {status === "initialize" && (
            <Button
              variant="contained"
              startIcon={<CompareArrows />}
              onClick={() =>
                setTransferType(
                  type === "sys-to-nevm" ? "nevm-to-sys" : "sys-to-nevm"
                )
              }
            >
              Switch
            </Button>
          )}
        </Box>
      </Grid>
      <Grid item xs={5}>
        <WalletInfoCard
          label="To"
          {...(type === "sys-to-nevm" ? nevmWalletInfo : utxoWalletInfo)}
        />
      </Grid>
    </Grid>
  );
};

export default BridgeWalletSwitch;
