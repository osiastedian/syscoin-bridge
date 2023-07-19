import { CircularProgress, Typography } from "@mui/material";
import { useTransfer } from "./context/TransferContext";

const BridgeV3SavingIndicator = () => {
  const { isSaving } = useTransfer();
  if (!isSaving) return null;
  return (
    <Typography variant="body2" sx={{ mt: 2 }}>
      <CircularProgress sx={{ mr: 1 }} size={"1rem"} />
      Saving state...
    </Typography>
  );
};

export default BridgeV3SavingIndicator;
