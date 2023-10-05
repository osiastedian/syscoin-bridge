import {
  COMMON_STATUS,
  ETH_TO_SYS_TRANSFER_STATUS,
  SYS_TO_ETH_TRANSFER_STATUS,
} from "@contexts/Transfer/types";
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
    if (transfer.status === COMMON_STATUS.INITIALIZE) {
      return (
        <BridgeV3ConnectValidateStep
          successStatus={ETH_TO_SYS_TRANSFER_STATUS.FREEZE_BURN_SYS}
        />
      );
    } else if (transfer.status === ETH_TO_SYS_TRANSFER_STATUS.FREEZE_BURN_SYS) {
      return (
        <BridgeV3StepFreezeAndBurnSys
          successStatus={ETH_TO_SYS_TRANSFER_STATUS.CONFIRM_FREEZE_BURN_SYS}
        />
      );
    } else if (
      transfer.status === ETH_TO_SYS_TRANSFER_STATUS.CONFIRM_FREEZE_BURN_SYS
    ) {
      return (
        <BridgeV3ConfirmNEVMTransaction
          invalidStateMessage="Invalid State: Freeze and Burn logs was not saved"
          loadingMessage="Confirming freeze and burn transaction..."
          sourceStatus={ETH_TO_SYS_TRANSFER_STATUS.FREEZE_BURN_SYS}
          successStatus={ETH_TO_SYS_TRANSFER_STATUS.MINT_SYSX}
        />
      );
    } else if (transfer.status === ETH_TO_SYS_TRANSFER_STATUS.MINT_SYSX) {
      return (
        <BridgeV3StepMintSysx
          successStatus={ETH_TO_SYS_TRANSFER_STATUS.CONFIRM_MINT_SYSX}
        />
      );
    } else if (
      transfer.status === ETH_TO_SYS_TRANSFER_STATUS.CONFIRM_MINT_SYSX
    ) {
      return (
        <BridgeV3StepConfirmUTXOTransaction
          invalidStateMessage="Invalid State: Mint Sysx transaction was not saved"
          loadingMessage="Confirming Mint of Sysx transaction..."
          sourceStatus={ETH_TO_SYS_TRANSFER_STATUS.MINT_SYSX}
          successStatus={ETH_TO_SYS_TRANSFER_STATUS.BURN_SYSX}
        />
      );
    } else if (transfer.status === ETH_TO_SYS_TRANSFER_STATUS.BURN_SYSX) {
      return (
        <BridgeV3StepBurnSysx
          successStatus={ETH_TO_SYS_TRANSFER_STATUS.CONFIRM_BURN_SYSX}
          toNevm={false}
        />
      );
    } else if (
      transfer.status === ETH_TO_SYS_TRANSFER_STATUS.CONFIRM_BURN_SYSX
    ) {
      return (
        <BridgeV3StepConfirmUTXOTransaction
          invalidStateMessage="Invalid State: Burn Sysx transaction was not saved"
          loadingMessage="Confirming Burn of Sysx transaction..."
          sourceStatus={ETH_TO_SYS_TRANSFER_STATUS.BURN_SYSX}
          successStatus={COMMON_STATUS.COMPLETED}
        />
      );
    } else if (transfer.status === COMMON_STATUS.COMPLETED) {
      return <BridgeV3CompleteNevmToSys transfer={transfer} />;
    }
  }
  if (transfer.status === COMMON_STATUS.INITIALIZE) {
    return (
      <BridgeV3ConnectValidateStep
        successStatus={SYS_TO_ETH_TRANSFER_STATUS.BURN_SYS}
      />
    );
  } else if (transfer.status === SYS_TO_ETH_TRANSFER_STATUS.BURN_SYS) {
    return (
      <BridgeV3StepBurnSys
        successStatus={SYS_TO_ETH_TRANSFER_STATUS.CONFIRM_BURN_SYS}
      />
    );
  } else if (transfer.status === SYS_TO_ETH_TRANSFER_STATUS.CONFIRM_BURN_SYS) {
    return (
      <BridgeV3StepConfirmUTXOTransaction
        invalidStateMessage="Invalid State: Burn SYS transaction was not saved"
        loadingMessage="Confirming Burn of SYS transaction..."
        sourceStatus={SYS_TO_ETH_TRANSFER_STATUS.BURN_SYS}
        successStatus={SYS_TO_ETH_TRANSFER_STATUS.BURN_SYSX}
        confirmations={0}
      />
    );
  } else if (transfer.status === SYS_TO_ETH_TRANSFER_STATUS.BURN_SYSX) {
    return (
      <BridgeV3StepBurnSysx
        successStatus={SYS_TO_ETH_TRANSFER_STATUS.CONFIRM_BURN_SYSX}
        toNevm={true}
      />
    );
  } else if (transfer.status === SYS_TO_ETH_TRANSFER_STATUS.CONFIRM_BURN_SYSX) {
    return (
      <BridgeV3StepConfirmUTXOTransaction
        invalidStateMessage="Invalid State: Burn SYSX transaction was not saved"
        loadingMessage="Confirming Burn of SYSX transaction..."
        sourceStatus={SYS_TO_ETH_TRANSFER_STATUS.BURN_SYSX}
        successStatus={SYS_TO_ETH_TRANSFER_STATUS.GENERATE_PROOFS}
      />
    );
  } else if (transfer.status === SYS_TO_ETH_TRANSFER_STATUS.GENERATE_PROOFS) {
    return (
      <BridgeV3StepGenerateProofs
        successStatus={SYS_TO_ETH_TRANSFER_STATUS.SUBMIT_PROOFS}
      />
    );
  } else if (transfer.status === SYS_TO_ETH_TRANSFER_STATUS.SUBMIT_PROOFS) {
    return (
      <BridgeV3StepSubmitProofs successStatus={COMMON_STATUS.FINALIZING} />
    );
  } else if (transfer.status == COMMON_STATUS.FINALIZING) {
    return (
      <BridgeV3ConfirmNEVMTransaction
        invalidStateMessage="Invalid State: Submit Proofs logs was not saved"
        loadingMessage="Confirming final transaction..."
        sourceStatus={SYS_TO_ETH_TRANSFER_STATUS.SUBMIT_PROOFS}
        successStatus={COMMON_STATUS.COMPLETED}
      />
    );
  } else if (transfer.status === "completed") {
    return <BridgeV3CompleteSysToNevm transfer={transfer} />;
  }

  return null;
};

export default BridgeV3StepSwitch;
