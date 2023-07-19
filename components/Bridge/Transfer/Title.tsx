import { Typography, TypographyProps } from "@mui/material";
import { useTransfer } from "../v3/context/TransferContext";

const TransferTitle: React.FC<TypographyProps> = (props) => {
  const { transfer } = useTransfer();

  return (
    <Typography variant="body1" {...props}>
      Transfer #
      {transfer == undefined || transfer.status === "initialize"
        ? "--------"
        : transfer.id}
    </Typography>
  );
};

export default TransferTitle;
