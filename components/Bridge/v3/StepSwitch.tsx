import BridgeV3StepBurnSys from "./Steps/BurnSys";
import BridgeV3StepBurnSysx from "./Steps/BurnSysx";
import BridgeV3CompleteNevmToSys from "./Steps/CompleteNevmToSys";
import BridgeV3CompleteSysToNevm from "./Steps/CompleteSysToNevm";
import BridgeV3ConfirmNEVMTransaction from "./Steps/ConfirmNEVMTransaction";
import BridgeV3StepConfirmUTXOTransaction from "./Steps/ConfirmUTXOTransaction";
import BridgeV3ConnectValidateStep from "./Steps/ConnectValidate";
import BridgeV3StepFreezeAndBurnSys from "./Steps/FreezeAndBurnSys";
import BridgeV3StepGenerateProofs from "./Steps/GenerateProofs";
import BridgeV3StepMintSysx from "./Steps/MintSysx";
import BridgeV3StepSubmitProofs from "./Steps/SubmitProofs";
import { useTransfer } from "./context/TransferContext";

const BridgeV3StepSwitch = () => {
  const { transfer } = useTransfer();
  if (transfer.type === "nevm-to-sys") {
    if (transfer.status === "initialize") {
      return <BridgeV3ConnectValidateStep successStatus="freeze-burn-sys" />;
    } else if (transfer.status === "freeze-burn-sys") {
      return (
        <BridgeV3StepFreezeAndBurnSys successStatus="confirm-freeze-burn-sys" />
      );
    } else if (transfer.status === "confirm-freeze-burn-sys") {
      return (
        <BridgeV3ConfirmNEVMTransaction
          invalidStateMessage="Invalid State: Freeze and Burn logs was not saved"
          loadingMessage="Confirming freeze and burn transaction..."
          sourceStatus="freeze-burn-sys"
          successStatus="mint-sysx"
        />
      );
    } else if (transfer.status === "mint-sysx") {
      return <BridgeV3StepMintSysx successStatus="confirm-mint-sysx" />;
    } else if (transfer.status === "confirm-mint-sysx") {
      return (
        <BridgeV3StepConfirmUTXOTransaction
          invalidStateMessage="Invalid State: Mint Sysx transaction was not saved"
          loadingMessage="Confirming Mint of Sysx transaction..."
          sourceStatus="mint-sysx"
          successStatus="burn-sysx"
        />
      );
    } else if (transfer.status === "burn-sysx") {
      return (
        <BridgeV3StepBurnSysx
          successStatus="confirm-burn-sysx"
          toNevm={false}
        />
      );
    } else if (transfer.status === "confirm-burn-sysx") {
      return (
        <BridgeV3StepConfirmUTXOTransaction
          invalidStateMessage="Invalid State: Burn Sysx transaction was not saved"
          loadingMessage="Confirming Burn of Sysx transaction..."
          sourceStatus="burn-sysx"
          successStatus="completed"
        />
      );
    } else if (transfer.status === "completed") {
      return <BridgeV3CompleteNevmToSys transfer={transfer} />;
    }
  }
  if (transfer.status === "initialize") {
    return <BridgeV3ConnectValidateStep successStatus="burn-sys" />;
  } else if (transfer.status === "burn-sys") {
    return <BridgeV3StepBurnSys successStatus="confirm-burn-sys" />;
  } else if (transfer.status === "confirm-burn-sys") {
    return (
      <BridgeV3StepConfirmUTXOTransaction
        invalidStateMessage="Invalid State: Burn SYS transaction was not saved"
        loadingMessage="Confirming Burn of SYS transaction..."
        sourceStatus="burn-sys"
        successStatus="burn-sysx"
        confirmations={0}
      />
    );
  } else if (transfer.status === "burn-sysx") {
    return (
      <BridgeV3StepBurnSysx successStatus="confirm-burn-sysx" toNevm={true} />
    );
  } else if (transfer.status === "confirm-burn-sysx") {
    return (
      <BridgeV3StepConfirmUTXOTransaction
        invalidStateMessage="Invalid State: Burn SYSX transaction was not saved"
        loadingMessage="Confirming Burn of SYSX transaction..."
        sourceStatus="burn-sysx"
        successStatus="generate-proofs"
      />
    );
  } else if (transfer.status === "generate-proofs") {
    return <BridgeV3StepGenerateProofs successStatus="submit-proofs" />;
  } else if (transfer.status === "submit-proofs") {
    return <BridgeV3StepSubmitProofs successStatus="finalizing" />;
  } else if (transfer.status == "finalizing") {
    return (
      <BridgeV3ConfirmNEVMTransaction
        invalidStateMessage="Invalid State: Submit Proofs logs was not saved"
        loadingMessage="Confirming final transaction..."
        sourceStatus="submit-proofs"
        successStatus="completed"
      />
    );
  } else if (transfer.status === "completed") {
    return <BridgeV3CompleteSysToNevm transfer={transfer} />;
  }

  return null;
};

export default BridgeV3StepSwitch;
