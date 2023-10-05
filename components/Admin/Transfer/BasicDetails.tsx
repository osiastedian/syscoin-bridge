import {
  COMMON_STATUS,
  ETH_TO_SYS_TRANSFER_STATUS,
  SYS_TO_ETH_TRANSFER_STATUS,
} from "@contexts/Transfer/types";
import { useTransfer } from "@contexts/Transfer/useTransfer";
import {
  Alert,
  Box,
  Card,
  CardContent,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";

const AdminTransferBasicDetails = () => {
  const { transfer } = useTransfer();
  const { amount, nevmAddress, utxoAddress, type, createdAt, status } =
    transfer;

  const statuses =
    type === "sys-to-nevm"
      ? Object.values(SYS_TO_ETH_TRANSFER_STATUS)
      : Object.values(ETH_TO_SYS_TRANSFER_STATUS);
  const commonStatuses = Object.values(COMMON_STATUS);

  const statusOptions = [...statuses, ...commonStatuses].map((value) => ({
    label: value,
    value: value,
  }));

  if (!transfer.id) {
    return null;
  }

  if (!transfer.nevmAddress || !transfer.utxoAddress) {
    return <Alert severity="error"> Transfer not found </Alert>;
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" sx={{ mb: 3 }}>
          Basic Details
        </Typography>
        <TextField label="Amount" value={amount} fullWidth sx={{ mb: 2 }} />
        <TextField
          label="NEVM Address"
          value={nevmAddress}
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextField
          label="UTXO Address"
          value={utxoAddress}
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextField label="Type" value={type} fullWidth sx={{ mb: 2 }} />
        <TextField
          label="Created At"
          value={new Date(createdAt).toLocaleString()}
          fullWidth
          sx={{ mb: 2 }}
        />
        <Select label="Status" value={status} fullWidth sx={{ mb: 2 }}>
          {statusOptions.map(({ label, value }) => (
            <MenuItem key={value} value={value}>
              {label}
            </MenuItem>
          ))}
        </Select>
      </CardContent>
    </Card>
  );
};

export default AdminTransferBasicDetails;
