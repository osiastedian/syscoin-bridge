import { Button, Box, Typography, Link } from "@mui/material";
import Image from "next/image";
import { useConnectedWallet } from "../contexts/ConnectedWallet/useConnectedWallet";
import { Launch } from "@mui/icons-material";

const PaliWallet = () => {
  const { utxo, connectUTXO, availableWallets } = useConnectedWallet();
  return (
    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
      <Image
        src="/pali-wallet-logo.svg"
        height={32}
        width={32}
        alt="PaliWallet logo"
      />
      {utxo.type === "pali-wallet" && utxo.account ? (
        <>
          <Typography variant="body1" color="secondary" noWrap maxWidth={"70%"}>
            {utxo.account}
          </Typography>
          <Typography variant="body1" color="success.main" sx={{ ml: "auto" }}>
            CONNECTED
          </Typography>
        </>
      ) : (
        <>
          <Typography variant="body1">PaliWallet</Typography>
          <Link href="https://paliwallet.com/" title="Go to PaliWallet">
            <Launch />
          </Link>
          <Button
            sx={{ ml: "auto" }}
            variant="contained"
            onClick={() => connectUTXO("pali-wallet")}
            disabled={!availableWallets.paliWallet}
          >
            {availableWallets.paliWallet
              ? "Connect"
              : availableWallets.paliWallet === undefined
              ? "Checking Pali Wallet"
              : "Not installed"}
          </Button>
        </>
      )}
    </Box>
  );
};

const WalletList: React.FC = () => {
  const { nevm, utxo, connectNEVM, connectUTXO, availableWallets } =
    useConnectedWallet();
  return (
    <Box>
      <Typography variant="body2">Connect Wallet:</Typography>
      <PaliWallet />
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <Image
          src="/metamask-logo.svg"
          height={32}
          width={32}
          alt="Metamask logo"
        />

        {nevm.type === "metamask" && nevm.account ? (
          <>
            <Typography variant="body1" color="secondary">
              {nevm.account}
            </Typography>
            <Typography
              variant="body1"
              color="success.main"
              sx={{ ml: "auto" }}
            >
              CONNECTED
            </Typography>
          </>
        ) : (
          <>
            <Typography variant="body1">Metamask</Typography>
            <Link href="https://metamask.io/" title="Go to Metamask">
              <Launch />
            </Link>
            <Button
              sx={{ ml: "auto" }}
              variant="contained"
              onClick={() => connectNEVM("metamask")}
              disabled={!availableWallets.metamask}
            >
              {availableWallets.metamask ? "Connect" : "Not installed"}
            </Button>
          </>
        )}
      </Box>
    </Box>
  );
};

export default WalletList;
