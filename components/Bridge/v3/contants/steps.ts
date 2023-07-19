import { TransferStatus } from "@contexts/Transfer/types";

export const sysToNevmSteps: TransferStatus[] = [
  "initialize",
  "burn-sys",
  "burn-sysx",
  "submit-proofs",
  "completed",
];

export const nevmToSysSteps: TransferStatus[] = [
  "initialize",
  "freeze-burn-sys",
  "mint-sysx",
  "burn-sysx",
  "completed",
];
