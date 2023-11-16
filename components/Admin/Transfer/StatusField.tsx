import { COMMON_STATUS, ITransfer } from "@contexts/Transfer/types";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useFormContext } from "react-hook-form";
import { nevmToSysSteps, sysToNevmSteps } from "@contexts/Transfer/Steps";

type Props = {
  transfer: ITransfer;
};

const AdminTransferStatusSelect: React.FC<Props> = ({ transfer }) => {
  const { register } = useFormContext();

  return (
    <FormControl sx={{ mb: 2 }}>
      <InputLabel id="status-label">Status</InputLabel>
      <Select
        label="Status"
        labelId="status-label"
        {...register("status")}
        defaultValue={transfer.status}
        disabled={transfer.status === COMMON_STATUS.COMPLETED}
      >
        {(transfer.type === "sys-to-nevm"
          ? sysToNevmSteps
          : nevmToSysSteps
        ).map((step) => (
          <MenuItem key={step.id} value={step.id}>
            {step.label}
          </MenuItem>
        ))}
        <MenuItem value={COMMON_STATUS.COMPLETED}>Completed</MenuItem>
      </Select>
    </FormControl>
  );
};

export default AdminTransferStatusSelect;
