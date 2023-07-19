import { Step, StepLabel, Stepper } from "@mui/material";
import { nevmToSysSteps, sysToNevmSteps } from "./contants/steps";
import { useTransfer } from "./context/TransferContext";

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
    if (modifiedStatus === "confirm-freeze-burn-sys") {
      modifiedStatus = "freeze-burn-sys";
    } else if (modifiedStatus === "confirm-mint-sysx") {
      modifiedStatus = "mint-sysx";
    } else if (modifiedStatus === "confirm-burn-sysx") {
      modifiedStatus = "burn-sysx";
    }
    activeStep = nevmToSysSteps.findIndex((step) => step === modifiedStatus);
    return <NEVMToSYSStepper activeStep={activeStep} />;
  }

  if (modifiedStatus === "confirm-burn-sys") {
    modifiedStatus = "burn-sys";
  } else if (modifiedStatus === "confirm-burn-sysx") {
    modifiedStatus = "burn-sysx";
  } else if (
    modifiedStatus === "finalizing" ||
    modifiedStatus === "generate-proofs"
  ) {
    modifiedStatus = "submit-proofs";
  }

  activeStep = sysToNevmSteps.findIndex((step) => step === modifiedStatus);
  return <SYSToNEVMStepper activeStep={activeStep} />;
};

export default BridgeV3Stepper;
