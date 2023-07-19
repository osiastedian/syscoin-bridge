import { usePaliWalletV2 } from "@contexts/PaliWallet/usePaliWallet";
import { Alert, Button, Typography } from "@mui/material";
import WalletSwitchCard from "./Card";
import WalletSwitchConfirmCard from "./ConfirmCard";
import { ITransfer } from "@contexts/Transfer/types";
import { useUtxoBalance } from "utils/balance-hooks";

type UTXOConnectProps = {
  transfer: ITransfer;
  setUtxo: (utxo: { xpub: string; address: string }) => void;
};

const UTXOConnect: React.FC<UTXOConnectProps> = ({ setUtxo, transfer }) => {
  const balance = useUtxoBalance(transfer.utxoXpub);
  const {
    isBitcoinBased,
    switchTo,
    connectedAccount,
    xpubAddress,
    changeAccount,
  } = usePaliWalletV2();

  const setTransferUtxo = () => {
    if (!connectedAccount || !xpubAddress) return;
    setUtxo({ xpub: xpubAddress, address: connectedAccount });
  };

  const change = () => {
    const prom = !isBitcoinBased ? switchTo("bitcoin") : Promise.resolve();
    setUtxo({ xpub: "", address: "" });
    prom.then(() => changeAccount());
  };

  const allowChange = transfer.status === "initialize";

  if (
    isBitcoinBased && allowChange
      ? transfer.utxoAddress === connectedAccount
      : Boolean(transfer.utxoAddress)
  ) {
    let balanceNum = balance.data ?? 0;
    if (isNaN(balanceNum)) {
      balanceNum = 0;
    }

    const faucetLink =
      balance.isFetched && balanceNum < 0.01 ? (
        <Alert severity="warning">
          <Typography variant="body2">
            Please send at least 0.01 SYS into your Pali wallet to continue the
            transaction
          </Typography>
        </Alert>
      ) : undefined;

    return (
      <WalletSwitchCard
        address={transfer.utxoAddress ?? ""}
        allowChange={allowChange}
        balance={
          balance.isLoading ? "Loading..." : `${balanceNum?.toFixed(4)} SYS`
        }
        onChange={change}
        faucetLink={faucetLink}
      />
    );
  }

  if (!isBitcoinBased) {
    return (
      <Button variant="contained" onClick={() => switchTo("bitcoin")}>
        Set UTXO Account
      </Button>
    );
  }

  return (
    <WalletSwitchConfirmCard
      address={connectedAccount ?? ""}
      onChange={change}
      onConfirm={setTransferUtxo}
    />
  );
};

export default UTXOConnect;
