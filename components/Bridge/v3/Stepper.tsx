import { Step, StepLabel, Stepper } from "@mui/material";
import { nevmToSysSteps, sysToNevmSteps } from "./contants/steps";
import { useTransfer } from "./context/TransferContext";
import {
  ETH_TO_SYS_TRANSFER_STATUS,
  SYS_TO_ETH_TRANSFER_STATUS,
} from "@contexts/Transfer/types";

const NEVMToSYSStepper: React.FC<{ activeStep: number }> = ({ activeStep }) => (
  <Stepper activeStep={activeStep}>
    <Step key="connect-and-validate">
      <StepLabel>Connect and Validated</StepLabel>
    </Step>
    <Step key="freeze-and-burn">
      <StepLabel>Freeze and Burn SYS</StepLabel>
    </Step>
    <Step key="mint-sysx">
      <StepLabel>Mint SYSX</StepLabel>
    </Step>
    <Step key="burn-sysx">
      <StepLabel>Burn SYSX</StepLabel>
    </Step>
    <Step key="Completed">
      <StepLabel>Completed</StepLabel>
    </Step>
  </Stepper>
);

const SYSToNEVMStepper: React.FC<{ activeStep: number }> = ({ activeStep }) => (
  <Stepper activeStep={activeStep}>
    <Step key="connect-and-validate">
      <StepLabel>Connect and Validated</StepLabel>
    </Step>
    <Step key="burn-sys">
      <StepLabel>Burn SYS</StepLabel>
    </Step>
    <Step key="burn-sysx">
      <StepLabel>Burn SYSX</StepLabel>
    </Step>
    <Step key="validate-proofs">
      <StepLabel>Validate Proofs</StepLabel>
    </Step>
    <Step key="Completed">
      <StepLabel>Completed</StepLabel>
    </Step>
  </Stepper>
);

const BridgeV3Stepper: React.FC = () => {
  const {
    transfer: { type, status },
  } = useTransfer();
  let activeStep = 1;
  let modifiedStatus = status;

  if (type === "nevm-to-sys") {
    if (modifiedStatus === ETH_TO_SYS_TRANSFER_STATUS.CONFIRM_FREEZE_BURN_SYS) {
      modifiedStatus = ETH_TO_SYS_TRANSFER_STATUS.FREEZE_BURN_SYS;
    } else if (
      modifiedStatus === ETH_TO_SYS_TRANSFER_STATUS.CONFIRM_MINT_SYSX
    ) {
      modifiedStatus = ETH_TO_SYS_TRANSFER_STATUS.MINT_SYSX;
    } else if (modifiedStatus === "confirm-burn-sysx") {
      modifiedStatus = ETH_TO_SYS_TRANSFER_STATUS.BURN_SYSX;
    }
    activeStep = nevmToSysSteps.findIndex((step) => step === modifiedStatus);
    return <NEVMToSYSStepper activeStep={activeStep} />;
  }

  if (modifiedStatus === "confirm-burn-sys") {
    modifiedStatus = SYS_TO_ETH_TRANSFER_STATUS.BURN_SYS;
  } else if (modifiedStatus === "confirm-burn-sysx") {
    modifiedStatus = SYS_TO_ETH_TRANSFER_STATUS.BURN_SYSX;
  } else if (
    modifiedStatus === "finalizing" ||
    modifiedStatus === "generate-proofs"
  ) {
    modifiedStatus = SYS_TO_ETH_TRANSFER_STATUS.SUBMIT_PROOFS;
  }

  activeStep = sysToNevmSteps.findIndex((step) => step === modifiedStatus);
  return <SYSToNEVMStepper activeStep={activeStep} />;
};

export default BridgeV3Stepper;
