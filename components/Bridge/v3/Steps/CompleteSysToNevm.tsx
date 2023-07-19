import { ITransfer } from "@contexts/Transfer/types";
import { Alert, Box, Typography, Link } from "@mui/material";

import React from "react";

const SYSCOIN_TX_BLOCKCHAIN_URL = "https://blockbook.elint.services/tx/";
const NEVM_TX_BLOCKCHAIN_URL = "https://explorer.syscoin.org/tx/";

type Props = {
  transfer: ITransfer;
};

const BridgeV3CompleteSysToNevm: React.FC<Props> = ({ transfer }) => {
  const { logs } = transfer;
  const burnSysTx = logs.find(
    (log) => log.status === "burn-sys" && log.payload.data.tx !== undefined
  );
  const burnSysxTx = logs.find((log) => log.status === "burn-sysx");
  const submitProofsTx = logs.find((log) => log.status === "submit-proofs");
  return (
    <Box>
      <Alert severity="success" sx={{ mb: 3 }}>
        Transfer complete!
      </Alert>
      <Box sx={{ mb: 2 }}>
        <Typography variant="body2">Burn Sys tx:</Typography>
        <Link
          href={`${SYSCOIN_TX_BLOCKCHAIN_URL}${burnSysTx?.payload.data.tx}`}
          target="_blank"
        >
          {burnSysTx?.payload.data.tx}
        </Link>
      </Box>
      <Box sx={{ mb: 2 }}>
        <Typography variant="body2">Burn Sysx tx:</Typography>
        <Link
          href={`${SYSCOIN_TX_BLOCKCHAIN_URL}${burnSysxTx?.payload.data.tx}`}
          target="_blank"
        >
          {burnSysxTx?.payload.data.tx}
        </Link>
      </Box>
      <Box>
        <Typography variant="body2">Submit Proofs tx:</Typography>
        <Link
          href={`${NEVM_TX_BLOCKCHAIN_URL}${submitProofsTx?.payload.data.hash}`}
          target="_blank"
        >
          {submitProofsTx?.payload.data.hash}
        </Link>
      </Box>
    </Box>
  );
};

export default BridgeV3CompleteSysToNevm;
