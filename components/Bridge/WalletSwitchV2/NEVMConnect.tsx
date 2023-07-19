import { useNEVM } from "@contexts/ConnectedWallet/NEVMProvider";
import { usePaliWalletV2 } from "@contexts/PaliWallet/usePaliWallet";
import { Alert, Button, Link, Typography } from "@mui/material";
import WalletSwitchCard from "./Card";
import WalletSwitchConfirmCard from "./ConfirmCard";
import { ITransfer } from "@contexts/Transfer/types";
import { useNevmBalance } from "utils/balance-hooks";

type NEVMConnectProps = {
  transfer: ITransfer;
  setNevm: (nevm: { address: string }) => void;
};

const NEVMConnect: React.FC<NEVMConnectProps> = ({ setNevm, transfer }) => {
  const { account, connect, switchToMainnet } = useNEVM();
  const { isBitcoinBased, switchTo, changeAccount } = usePaliWalletV2();
  const balance = useNevmBalance(transfer.nevmAddress);

  const setTransferNevm = () => {
    if (!account) return;
    setNevm({ address: account });
  };

  const change = () => {
    const prom = isBitcoinBased ? switchTo("ethereum") : Promise.resolve();
    setNevm({ address: "" });
    prom.then(() => changeAccount());
  };

  const allowChange = transfer.status === "initialize";
  if (
    !isBitcoinBased && allowChange
      ? transfer.nevmAddress === account
      : Boolean(transfer.nevmAddress)
  ) {
    let balanceNum = balance.data ?? 0;
    if (isNaN(balanceNum)) {
      balanceNum = 0;
    }
    const faucetLink =
      balance.isFetched && balanceNum < 0.01 ? (
        <Alert severity="warning">
          <Typography variant="body2">
            You don&apos;t have enough balance. Please go to&nbsp;
            <Link href="https://faucet.syscoin.org/" target="_blank">
              Faucet
            </Link>
          </Typography>
        </Alert>
      ) : undefined;
    return (
      <WalletSwitchCard
        address={transfer.nevmAddress ?? ""}
        allowChange={allowChange}
        balance={
          balance.isLoading ? "Loading..." : `${balanceNum?.toFixed(4)} SYS`
        }
        onChange={change}
        faucetLink={faucetLink}
      />
    );
  }

  if (isBitcoinBased) {
    return (
      <Button variant="contained" onClick={() => switchTo("ethereum")}>
        Set NEVM Account
      </Button>
    );
  }

  if (!account) {
    return <Button onClick={() => connect()}>Fetch account</Button>;
  }

  return (
    <WalletSwitchConfirmCard
      address={account ?? ""}
      onChange={change}
      onConfirm={setTransferNevm}
    />
  );
};

export default NEVMConnect;
