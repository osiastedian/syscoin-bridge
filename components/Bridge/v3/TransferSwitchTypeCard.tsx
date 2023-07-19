import { Button, Card, CardContent, Typography } from "@mui/material";
import { useTransfer } from "./context/TransferContext";
import NextLink from "next/link";
import { ChangeCircle } from "@mui/icons-material";

const BridgeV3TransferSwitchTypeCard = () => {
  const { transfer } = useTransfer();
  if (transfer.status !== "initialize") {
    return null;
  }
  return (
    <Card>
      <CardContent sx={{ display: "flex", alignItems: "center" }}>
        {transfer.type === "sys-to-nevm" && (
          <Typography>Syscoin UTXO &gt;&gt;&gt; Syscoin NEVM</Typography>
        )}
        {transfer.type === "nevm-to-sys" && (
          <Typography>Syscoin NEVM &gt;&gt;&gt; Syscoin UTXO</Typography>
        )}
        <Button
          variant="contained"
          LinkComponent={NextLink}
          href={transfer.type === "nevm-to-sys" ? "sys-to-nevm" : "nevm-to-sys"}
          color="secondary"
          sx={{ ml: "auto" }}
          size="small"
        >
          Switch
          <ChangeCircle />
        </Button>
      </CardContent>
    </Card>
  );
};

export default BridgeV3TransferSwitchTypeCard;
