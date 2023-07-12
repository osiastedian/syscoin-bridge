import { Button, IconButton, Tooltip, Typography } from "@mui/material";
import ChangeCirlce from "@mui/icons-material/ChangeCircle";
import { Box } from "@mui/system";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

type WalletSwitchConfirmCardProps = {
  address: string;
  onChange: () => void;
  onConfirm: () => void;
};

const WalletSwitchConfirmCard: React.FC<WalletSwitchConfirmCardProps> = ({
  address,
  onChange,
  onConfirm,
}) => {
  return (
    <Box>
      <Typography variant="body1">{address}</Typography>
      <Button
        variant="contained"
        aria-label="Change"
        onClick={onChange}
        color="secondary"
        size="small"
      >
        Change
      </Button>
      <Button
        variant="contained"
        aria-label="Set"
        onClick={onConfirm}
        color="primary"
        sx={{ ml: 1 }}
        size="small"
      >
        Set
      </Button>
    </Box>
  );
};

export default WalletSwitchConfirmCard;
