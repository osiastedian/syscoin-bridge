import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from "react";
import reducer from "./store/reducer";
import { ITransfer, TransferStatus, TransferType } from "./types";

import { useConnectedWallet } from "../ConnectedWallet/useConnectedWallet";
import {
  addLog,
  initialize,
  setNevmAddress,
  setStatus,
  setUtxoAddress,
  setUtxoXpub,
  setVersion,
} from "./store/actions";
import relayAbi from "./relay-abi";
import runWithSysToNevmStateMachine from "./functions/sysToNevm";
import runWithNevmToSysStateMachine from "./functions/nevmToSys";
import { TransferStep, nevmToSysSteps, sysToNevmSteps } from "./Steps";
import { usePaliWallet } from "@contexts/PaliWallet/usePaliWallet";

interface ITransferContext {
  transfer: ITransfer;
  error?: any;
  steps: TransferStep[];
  startTransfer: (amount: number) => void;
  setTransferType: (type: TransferType) => void;
  retry: () => void;
  revertToPreviousStatus: () => void;
  proceedNextStep: () => void;
  setUtxo: (payload: { xpub: string; address: string }) => void;
  setNevm: (payload: { address: string }) => void;
}

export const TransferContext = createContext({} as ITransferContext);

type TransferProviderProps = {
  id: string;
  includeSwitchStep?: boolean;
  children: React.ReactNode;
};

const TransferProvider: React.FC<TransferProviderProps> = ({
  id,
  includeSwitchStep,
  children,
}) => {
  const { sendUtxoTransaction, confirmTransaction, syscoinInstance, web3 } =
    useConnectedWallet();

  const { version } = usePaliWallet();

  const relayContract = useMemo(() => {
    return new web3.eth.Contract(
      relayAbi,
      "0xD822557aC2F2b77A1988617308e4A29A89Cb95A6"
    );
  }, [web3]);

  const baseTransfer: Partial<ITransfer> = useMemo(() => {
    return {
      amount: "0",
      id,
      type: "sys-to-nevm",
      status: "initialize",
      logs: [],
      createdAt: Date.now(),
      version: "v1",
    };
  }, [id]);

  const [transfer, dispatch] = useReducer<typeof reducer>(reducer, {
    ...baseTransfer,
    id,
  } as ITransfer);

  const [initialized, setIsInitialized] = useState(false);
  const [previousStatus, setPreviousStatus] = useState<TransferStatus>();
  const [error, setError] = useState();

  const steps = useMemo(() => {
    let conditionalSteps: TransferStep[] = [];

    if (transfer.type === "sys-to-nevm") {
      conditionalSteps = [...sysToNevmSteps];
    } else if (transfer.type === "nevm-to-sys") {
      conditionalSteps = [...nevmToSysSteps];
    }

    if (includeSwitchStep) {
      const transferType = transfer.type;
      const switchStep: TransferStep = {
        id: "switch",
        label:
          transferType === "sys-to-nevm"
            ? "Switch to NEVM"
            : "Switch to SYSCOIN",
      };

      const targetStepId =
        transferType === "sys-to-nevm" ? "submit-proofs" : "mint-sysx";
      const targetStepIndex = conditionalSteps.findIndex(
        (step) => step.id === targetStepId
      );

      conditionalSteps.splice(targetStepIndex, 0, switchStep);
    }

    return conditionalSteps;
  }, [transfer.type, includeSwitchStep]);

  const startTransfer = (amount: number) => {
    if (
      (!transfer.utxoAddress || !transfer.nevmAddress) &&
      !includeSwitchStep
    ) {
      console.log("Some accounts are not connected", {
        nevm: transfer.nevmAddress,
        utxo: transfer.utxoAddress,
      });
      return;
    }
    updateAmount(`${amount}`);
    dispatch(setVersion(version));
    dispatch(setStatus("initialize"));
    dispatch(addLog("initialize", "Starting Sys to NEVM transfer", transfer));
    if (transfer.type === "sys-to-nevm") {
      dispatch(setStatus("burn-sys"));
    } else if (transfer.type === "nevm-to-sys") {
      dispatch(setStatus("freeze-burn-sys"));
    }
  };

  const updateAmount = (amount: string) => {
    dispatch({
      type: "set-amount",
      payload: amount,
    });
  };

  const setTransferType = (type: TransferType) => {
    dispatch({
      type: "set-type",
      payload: type,
    });
  };

  const setUtxo = (payload: { xpub: string; address: string }) => {
    const { address, xpub } = payload;
    dispatch(setUtxoXpub(xpub));
    dispatch(setUtxoAddress(address));
  };

  const setNevm = (payload: { address: string }) => {
    const { address } = payload;
    dispatch(setNevmAddress(address));
  };

  const proceedNextStep = useCallback(() => {
    if (transfer.status === "completed") {
      return;
    }
    const currentStepIndex = steps.findIndex(
      (step) => step.id === transfer.status
    );
    const nextStep = steps[currentStepIndex + 1];
    if (nextStep) {
      dispatch(setStatus(nextStep.id));
    } else if (transfer.status === "finalizing") {
      dispatch(setStatus("completed"));
    }
  }, [steps, transfer.status, dispatch]);

  const runSideEffects = useCallback(() => {
    let sideEffectPromise =
      transfer.type === "sys-to-nevm"
        ? runWithSysToNevmStateMachine({
            transfer,
            syscoinInstance,
            web3,
            dispatch,
            sendUtxoTransaction,
            relayContract,
            confirmTransaction,
          })
        : runWithNevmToSysStateMachine(
            transfer,
            web3,
            syscoinInstance,
            sendUtxoTransaction,
            dispatch,
            confirmTransaction
          );
    sideEffectPromise
      .then(() => {
        if (transfer.status === "switch") {
          return;
        }
        proceedNextStep();
      })
      .catch((err) => {
        setError(err);
      });
  }, [
    transfer,
    syscoinInstance,
    web3,
    sendUtxoTransaction,
    relayContract,
    confirmTransaction,
    proceedNextStep,
  ]);

  const revertToPreviousStatus = () => {
    if (transfer.logs.length === 0) {
      return;
    }
    const latestLog = transfer.logs[transfer.logs.length - 1];
    if (latestLog.payload.previousStatus) {
      dispatch(setStatus(latestLog.payload.previousStatus));
    }
  };

  useEffect(() => {
    if (
      ["initialize", "completed"].includes(transfer.status) ||
      previousStatus === transfer.status
    ) {
      return;
    }
    setError(undefined);
    runSideEffects();
    setPreviousStatus(transfer.status);
  }, [initialized, previousStatus, runSideEffects, transfer.status]);

  useEffect(() => {
    if (!transfer.id || transfer.status === "initialize") {
      return;
    }
    localStorage.setItem(`transfer-${transfer.id}`, JSON.stringify(transfer));
    fetch(`/api/transfer/${transfer.id}`, {
      body: JSON.stringify(transfer),
      method: "PATCH",
      headers: {
        "content-type": "application/json",
      },
    }).catch((e) => {
      console.error("Saved in DB Error", e);
    });
  }, [transfer, transfer.status, initialized]);

  useEffect(() => {
    if (initialized) {
      return;
    }
    setIsInitialized(true);
    const loadDefault = () => {
      const item = localStorage.getItem(`transfer-${id}`);
      const defaultState = {
        ...baseTransfer,
        id,
      } as ITransfer;
      dispatch(initialize(item ? JSON.parse(item) : defaultState));
    };
    fetch(`/api/transfer/${id}`)
      .then((transfer) => {
        return transfer.status === 200 ? transfer.json() : undefined;
      })
      .then((state) => {
        if (state) {
          dispatch(initialize(state));
        } else {
          loadDefault();
        }
      })
      .catch(() => loadDefault());
  }, [id, baseTransfer, initialized]);

  useEffect(() => {
    setIsInitialized(false);
  }, [id]);

  return (
    <TransferContext.Provider
      value={{
        transfer,
        startTransfer,
        setTransferType,
        retry: () => {
          runSideEffects();
          setError(undefined);
        },
        error,
        revertToPreviousStatus,
        steps,
        proceedNextStep,
        setNevm,
        setUtxo,
      }}
    >
      {children}
    </TransferContext.Provider>
  );
};

export default TransferProvider;
