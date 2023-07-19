import { Alert, Box, CircularProgress } from "@mui/material";
import { useTransfer } from "../context/TransferContext";
import { useUtxoTransaction } from "components/Bridge/v3/hooks/useUtxoTransaction";
import { ITransferLog, TransferStatus } from "@contexts/Transfer/types";
import { useEffect } from "react";

type Props = {
  invalidStateMessage: string;
  loadingMessage: string;
  successStatus: TransferStatus;
  sourceStatus: TransferStatus;
  confirmations?: number;
};

const BridgeV3StepConfirmUTXOTransaction: React.FC<Props> = ({
  sourceStatus,
  successStatus,
  invalidStateMessage,
  loadingMessage,
  confirmations,
}) => {
  const { transfer, saveTransfer } = useTransfer();

  const utxoStepLog = transfer.logs.find(
    (log) => log.status === sourceStatus && Boolean(log.payload?.data?.tx)
  );

  const txId: string | undefined = utxoStepLog?.payload?.data?.tx;

  const { data, isFetched } = useUtxoTransaction(txId, confirmations);

  useEffect(() => {
    if (!isFetched || !data) {
      return;
    }
    const updatedLogs: ITransferLog[] = [
      ...transfer.logs,
      {
        date: Date.now(),
        payload: {
          data,
          message: "Confirm UTXO Transaction",
        },
        status: sourceStatus,
      },
    ];

    saveTransfer({
      ...transfer,
      logs: updatedLogs,
      status: successStatus,
    });
  }, [data, isFetched, saveTransfer, transfer, successStatus, sourceStatus]);

  if (!txId) {
    return <Alert severity="error">{invalidStateMessage}</Alert>;
  }

  return (
    <Alert
      severity="info"
      sx={{
        "& .MuiAlert-message": {
          width: "100%",
        },
      }}
    >
      {loadingMessage} &nbsp;
      <CircularProgress size={"1rem"} />
    </Alert>
  );
};

export default BridgeV3StepConfirmUTXOTransaction;
