import { useNEVM } from "@contexts/ConnectedWallet/NEVMProvider";
import { usePaliWalletV2 } from "@contexts/PaliWallet/usePaliWallet";
import { Button, Typography } from "@mui/material";
import { useAdmin } from "./Provider";

const ConnectAdmin = () => {
  const { account, connect } = useNEVM();
  const { isBitcoinBased, isEVMInjected, switchTo } = usePaliWalletV2();

  const isConnected = Boolean(account);

  const { admin } = useAdmin();

  return (
    <>
      <Typography>Connected Account: {account ?? "-"}</Typography>
      {!isConnected && !isBitcoinBased && (
        <Button onClick={connect}>Connect</Button>
      )}
      {isBitcoinBased && isEVMInjected && (
        <Button onClick={() => switchTo("ethereum")}>Switch to NEVM</Button>
      )}
      {admin && <Typography>Welcome Admin {admin.name}!</Typography>}
    </>
  );
};

export default ConnectAdmin;
