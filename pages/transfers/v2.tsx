import { usePaliWalletV2 } from "@contexts/PaliWallet/usePaliWallet";
import { Alert, Box, Button, Container, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import TransferDataGrid from "components/Transfer/DataGrid";
import WalletList from "components/WalletList";
import { useConnectedWallet } from "contexts/ConnectedWallet/useConnectedWallet";
import { ITransfer } from "contexts/Transfer/types";
import { NextPage } from "next";
import NextLink from "next/link";
import { useEffect, useState } from "react";

const TransfersPage: NextPage = () => {
  const [items, setItems] = useState<ITransfer[]>([]);
  const { utxo, nevm } = useConnectedWallet();
  const { version, isBitcoinBased, isEVMInjected } = usePaliWalletV2();
  const isPaliV2Connected = isBitcoinBased
    ? Boolean(utxo.account)
    : Boolean(nevm.account);
  const onlyV2 = version === "v2" && isEVMInjected;
  const isFullyConnected = onlyV2
    ? isPaliV2Connected
    : Boolean(utxo.account && nevm.account);

  useEffect(() => {
    if (!localStorage) {
      return;
    }
    setItems(
      Object.entries(localStorage)
        .filter(([key]) => key.startsWith("transfer-"))
        .map(([key, value]) => JSON.parse(value))
    );
  }, []);

  return (
    <Container sx={{ py: 10 }}>
      <Box display="flex" marginBottom={"1rem"}>
        <Typography variant="h5">Transfers</Typography>
        <Button
          LinkComponent={NextLink}
          href="/bridge/v3/sys-to-nevm"
          sx={{ ml: "auto" }}
        >
          <AddIcon /> New Transfer
        </Button>
      </Box>
      <TransferDataGrid
        account={nevm.account}
        isFullyConnected={isFullyConnected}
        items={items}
        xpub={utxo.xpub}
        version={onlyV2 ? version : undefined}
        bridgeVersion="v3"
      />
      {!isFullyConnected && (
        <Alert severity="info" sx={{ mb: 2 }}>
          <Typography variant="body1">Connect both wallets</Typography>
        </Alert>
      )}
      <WalletList />
    </Container>
  );
};

export default TransfersPage;
