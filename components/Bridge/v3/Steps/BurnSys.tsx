import { Alert, Box, Button, Typography } from "@mui/material";
import UTXOStepWrapper from "../UTXOStepWrapper";
import { useTransfer } from "../context/TransferContext";
import { useBurnSys } from "../hooks/useBurnSys";
import { ITransferLog, TransferStatus } from "@contexts/Transfer/types";

const isError = (error: unknown): error is Error => {
  return error instanceof Error;
};

type BurnSysProps = {
  successStatus: TransferStatus;
};

const BurnSys: React.FC<BurnSysProps> = ({ successStatus }) => {
  const { transfer, saveTransfer } = useTransfer();
  const {
    mutate: signBurnSys,
    isLoading: isSigning,
    isError: isSignError,
    error: signError,
  } = useBurnSys(transfer);

  const onSignatureSuccess = (tx: string) => {
    const updatedLogs: ITransferLog[] = [
      ...transfer.logs,
      {
        date: Date.now(),
        payload: {
          data: {
            tx,
          },
          message: "Burning SYS to SYSX",
        },
        status: "burn-sys",
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
          message: "Burning SYS to SYSX Error",
        },
        status: "burn-sys",
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
        Confirm Burning of SYS:
      </Typography>
      <Typography variant="h6" sx={{ mb: 2 }}>
        {transfer.amount} SYS
      </Typography>
      <Button color="primary" variant="contained" onClick={sign}>
        Confirm
      </Button>
    </Box>
  );
};

const BridgeV3StepBurnSys: React.FC<BurnSysProps> = (props) => (
  <UTXOStepWrapper>
    <BurnSys {...props} />
  </UTXOStepWrapper>
);

export default BridgeV3StepBurnSys;
