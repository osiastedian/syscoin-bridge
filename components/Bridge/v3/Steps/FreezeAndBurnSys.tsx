import { Alert, Box, Button, Typography } from "@mui/material";
import NEVMStepWrapper from "../NEVMStepWrapepr";
import { useTransfer } from "../context/TransferContext";
import { useFreezeAndBurn } from "../hooks/useFreezeAndBurn";
import {
  ETH_TO_SYS_TRANSFER_STATUS,
  ITransferLog,
  TransferStatus,
} from "@contexts/Transfer/types";

type Props = {
  successStatus: TransferStatus;
};

const FreezeAndBurn: React.FC<Props> = ({ successStatus }) => {
  const { transfer, saveTransfer } = useTransfer();

  const {
    mutate: freezeAndBurn,
    isLoading: isSigning,
    isError: isSignError,
    error: signError,
  } = useFreezeAndBurn(transfer);

  const onSignatureSuccess = (hash: string) => {
    const updatedLogs: ITransferLog[] = [
      ...transfer.logs,
      {
        date: Date.now(),
        payload: {
          data: {
            hash,
          },
          message: "Freeze and Burn SYS",
        },
        status: ETH_TO_SYS_TRANSFER_STATUS.FREEZE_BURN_SYS,
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
          message: "Freeze and Burn SYS Error",
        },
        status: ETH_TO_SYS_TRANSFER_STATUS.FREEZE_BURN_SYS,
      },
    ];
    saveTransfer({
      ...transfer,
      logs: updatedLogs,
    });
  };

  const sign = () => {
    freezeAndBurn(undefined, {
      onSuccess: onSignatureSuccess,
      onError: onSignatureError,
    });
  };

  if (isSigning) {
    return <Alert severity="info">Check NEVM Wallet for signing</Alert>;
  }

  if (isSignError) {
    let errorMessage =
      typeof signError === "string" ? signError : JSON.stringify(signError);

    if (signError instanceof Error) {
      errorMessage = signError.message;
    }
    return (
      <Alert severity="error" action={<Button onClick={sign}>Retry</Button>}>
        Freeze and Burn SYS error: {errorMessage}
      </Alert>
    );
  }

  return (
    <Box>
      <Typography variant="body2" sx={{ mb: 1 }}>
        Confirm Freezing and Burning of SYS:
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

const BridgeV3StepFreezeAndBurnSys: React.FC<Props> = (props) => {
  return (
    <NEVMStepWrapper>
      <FreezeAndBurn {...props} />
    </NEVMStepWrapper>
  );
};

export default BridgeV3StepFreezeAndBurnSys;
