import { Box, Button, Card, CardContent, Typography } from "@mui/material";

import { useConnectedWallet } from "../../contexts/ConnectedWallet/useConnectedWallet";
import { ITransfer } from "../../contexts/Transfer/types";
import { useTransfer } from "../../contexts/Transfer/useTransfer";
import SyscoinLogo from "../Icons/syscoin";

type WalletType = "utxo" | "nevm" | string;

interface IProps {
  label: string;
  walletType: WalletType;
  account: string | undefined;
  network: {
    name: string;
    symbol: string;
  };
}

const PaliWallet: React.FC<{ transfer: ITransfer }> = ({ transfer }) => {
  const { utxo, connectUTXO, availableWallets } = useConnectedWallet();
  return (
    <Box display="flex" alignItems="center">
      <img
        src="/pali-wallet-logo.svg"
        height="32px"
        width="32px"
        alt="PaliWallet logo"
      />
      {transfer.status === "initialize" ? (
        utxo.account ? (
          <Typography variant="body2">{utxo.account}</Typography>
        ) : (
          <Button
            disabled={!availableWallets.paliWallet}
            onClick={() => connectUTXO("pali-wallet")}
          >
            {availableWallets.paliWallet === undefined
              ? "Checking Pali Wallet"
              : availableWallets.paliWallet
              ? "Connect"
              : "Not installed"}
          </Button>
        )
      ) : utxo.account ? (
        utxo.account === transfer.utxoAddress ? (
          <Typography variant="body2">{transfer.utxoAddress}</Typography>
        ) : (
          <Typography variant="body2">
            Change to {transfer.utxoAddress}
          </Typography>
        )
      ) : (
        <Button
          disabled={!availableWallets.paliWallet}
          onClick={() => connectUTXO("pali-wallet")}
        >
          Reconnect
        </Button>
      )}
    </Box>
  );
};

const BridgeWalletInfo: React.FC<IProps> = ({ label, network, walletType }) => {
  const { nevm, utxo, connectNEVM, availableWallets } = useConnectedWallet();
  const { transfer } = useTransfer();

  return (
    <Box>
      <Typography variant="caption" color="gray">
        {label}
      </Typography>
      <Card variant="outlined" sx={{ mb: 1 }}>
        <CardContent sx={{ p: "1rem !important" }}>
          <SyscoinLogo />
          <Box display="inline-block" sx={{ ml: 1 }}>
            <Typography variant="body1" display="block">
              {network.name}
            </Typography>
            <Typography variant="caption" display="block" color="gray">
              {network.symbol}
            </Typography>
          </Box>
        </CardContent>
      </Card>
      {walletType === "utxo" && utxo.type === "pali-wallet" && (
        <PaliWallet transfer={transfer} />
      )}
      {walletType === "nevm" && nevm.type === "metamask" && (
        <Box display="flex" alignItems="center">
          <img
            src="/metamask-logo.svg"
            height="32px"
            width="32px"
            alt="Metamask logo"
          />
          {transfer.status === "initialize" ? (
            nevm.account ? (
              <Typography variant="body2">{nevm.account}</Typography>
            ) : (
              <Button
                disabled={!availableWallets.metamask}
                onClick={() => connectNEVM("metamask")}
              >
                {availableWallets.metamask === undefined
                  ? "Checking Metamask"
                  : availableWallets.metamask
                  ? "Connect"
                  : "Not installed"}
              </Button>
            )
          ) : (
            <Typography variant="body2">{transfer.nevmAddress}</Typography>
          )}
        </Box>
      )}
    </Box>
  );
};

export default BridgeWalletInfo;
