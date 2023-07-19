import {
  MAINNET_CHAIN_ID,
  useNEVM,
} from "@contexts/ConnectedWallet/NEVMProvider";
import { usePaliWalletV2 } from "@contexts/PaliWallet/usePaliWallet";
import { Button } from "@mui/material";
import { isValidEthereumAddress } from "@pollum-io/sysweb3-utils";

type Props = {
  children: React.ReactNode;
};

const NEVMStepWrapper: React.FC<Props> = ({ children }) => {
  const { version, isBitcoinBased, switchTo, isEVMInjected, connectWallet } =
    usePaliWalletV2();

  const { connect, account, chainId, switchToMainnet } = useNEVM();

  if (version === "v2" && isBitcoinBased && isEVMInjected) {
    return (
      <Button variant="contained" onClick={() => switchTo("ethereum")}>
        Switch to Syscoin NEVM
      </Button>
    );
  }

  if (!account) {
    return <Button onClick={connectWallet}>Connect Pali Wallet</Button>;
  }

  if (!isValidEthereumAddress(account)) {
    return (
      <>
        <Button variant="contained" onClick={connect}>
          Switch Account
        </Button>
      </>
    );
  }

  if (chainId !== MAINNET_CHAIN_ID) {
    return (
      <Button variant="contained" onClick={switchToMainnet}>
        Switch to NEVM Network
      </Button>
    );
  }
  return <>{children}</>;
};

export default NEVMStepWrapper;
