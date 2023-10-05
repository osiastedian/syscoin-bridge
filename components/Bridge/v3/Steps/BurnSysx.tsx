import { Alert, Box, Button, Typography } from "@mui/material";
import UTXOStepWrapper from "../UTXOStepWrapper";
import { useTransfer } from "../context/TransferContext";
import {
  ITransferLog,
  SYS_TO_ETH_TRANSFER_STATUS,
  TransferStatus,
} from "@contexts/Transfer/types";
import { useBurnSysx } from "../hooks/useBurnSysx";

const isError = (error: unknown): error is Error => {
  return error instanceof Error;
};

type BurnSysProps = {
  successStatus: TransferStatus;
  toNevm?: boolean;
};

const BurnSysx: React.FC<BurnSysProps> = ({ successStatus, toNevm }) => {
  const { transfer, saveTransfer } = useTransfer();
  const {
    mutate: signBurnSys,
    isLoading: isSigning,
    isError: isSignError,
    error: signError,
  } = useBurnSysx(transfer, toNevm);

  const onSignatureSuccess = (tx: string) => {
    const updatedLogs: ITransferLog[] = [
      ...transfer.logs,
      {
        date: Date.now(),
        payload: {
          data: {
            tx,
          },
          message: "Burning SYSX to NEVM",
        },
        status: SYS_TO_ETH_TRANSFER_STATUS.BURN_SYSX,
      },
    ];
    saveTransfer({
      ...transfer,
      logs: updatedLogs,
      status: successStatus,
    });
  };

  const onSignatureError = (error: unknown) => {
    const updatedLogs: ITransferLog[] = [
      ...transfer.logs,
      {
        date: Date.now(),
        payload: {
          data: {
            error,
          },
          message: "Burning SYSX to NEVM",
        },
        status: SYS_TO_ETH_TRANSFER_STATUS.BURN_SYSX,
      },
    ];
    saveTransfer({
      ...transfer,
      logs: updatedLogs,
    });
  };

  const sign = () => {
    signBurnSys(undefined, {
      onSuccess: onSignatureSuccess,
      onError: onSignatureError,
    });
  };

  if (isSigning) {
    return <Alert severity="info">Check Pali Wallet for signing</Alert>;
  }

  if (isSignError) {
    let errorMessage =
      typeof signError === "string" ? signError : JSON.stringify(signError);

    if (isError(signError)) {
      errorMessage = signError.message;
    }
    return (
      <Alert severity="error" action={<Button onClick={sign}>Retry</Button>}>
        Burn SYS error: {errorMessage}
      </Alert>
    );
  }

  return (
    <Box>
      <Typography variant="body2" sx={{ mb: 1 }}>
        Confirm Burning of SYSX:
      </Typography>
      <Typography variant="h6" sx={{ mb: 2 }}>
        {transfer.amount} SYSX
      </Typography>
      <Button color="primary" variant="contained" onClick={sign}>
        Confirm
      </Button>
    </Box>
  );
};

const BridgeV3StepBurnSysx: React.FC<BurnSysProps> = (props) => (
  <UTXOStepWrapper>
    <BurnSysx {...props} />
  </UTXOStepWrapper>
);

export default BridgeV3StepBurnSysx;
