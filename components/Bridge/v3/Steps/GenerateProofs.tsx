import { Alert, Button, CircularProgress } from "@mui/material";
import { useTransfer } from "../context/TransferContext";
import {
  ITransferLog,
  SYS_TO_ETH_TRANSFER_STATUS,
  TransferStatus,
} from "@contexts/Transfer/types";
import { useProof } from "../hooks/useProofs";

type Props = {
  successStatus: TransferStatus;
};

const BridgeV3StepGenerateProofs: React.FC<Props> = ({ successStatus }) => {
  const { transfer, saveTransfer } = useTransfer();

  const burnSysLog = transfer.logs.find(
    (log) => log.status === "burn-sysx" && Boolean(log.payload?.data?.tx)
  );

  const burnSysTxId: string | undefined = burnSysLog?.payload?.data?.tx;

  const onSuccess = (data: unknown) => {
    const updatedLogs: ITransferLog[] = [
      ...transfer.logs,
      {
        date: Date.now(),
        payload: {
          data: typeof data === "string" ? JSON.parse(data) : data,
          message: "Generated proofs",
          previousStatus: SYS_TO_ETH_TRANSFER_STATUS.CONFIRM_BURN_SYSX,
        },
        status: SYS_TO_ETH_TRANSFER_STATUS.GENERATE_PROOFS,
      },
    ];

    saveTransfer({
      ...transfer,
      logs: updatedLogs,
      status: successStatus,
    });
  };

  const { isFetched } = useProof(burnSysTxId, {
    onSuccess,
  });

  if (!burnSysTxId) {
    return (
      <Alert severity="error" action={<Button>Retry Burn Sys</Button>}>
        Invalid state: Not Burn Sysx log was saved
      </Alert>
    );
  }

  if (isFetched) {
    return <Alert severity="info">Proofs generated</Alert>;
  }

  return (
    <Alert severity="info">
      Generating Proofs for NEVM
      <CircularProgress size={"1rem"} />
    </Alert>
  );
};

export default BridgeV3StepGenerateProofs;
