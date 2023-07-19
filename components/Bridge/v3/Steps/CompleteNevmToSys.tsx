import { ITransfer } from "@contexts/Transfer/types";
import { Alert, Box, Typography, Link } from "@mui/material";

import React from "react";

const SYSCOIN_TX_BLOCKCHAIN_URL = "https://blockbook.elint.services/tx/";
const NEVM_TX_BLOCKCHAIN_URL = "https://explorer.syscoin.org/tx/";

type Props = {
  transfer: ITransfer;
};

const BridgeV3CompleteNevmToSys: React.FC<Props> = ({ transfer }) => {
  const { logs } = transfer;
  const mintSysTx = logs.find(
    (log) => log.status === "mint-sysx" && log.payload.data.tx !== undefined
  );
  const burnSysxTx = logs.find(
    (log) => log.status === "burn-sysx" && log.payload.data.tx !== undefined
  );
  const freezeAndBurnTx = logs.find(
    (log) =>
      log.status === "freeze-burn-sys" && log.payload.data.hash !== undefined
  );
  return (
    <Box>
      <Alert severity="success" sx={{ mb: 3 }}>
        Transfer complete!
      </Alert>
      <Box sx={{ mb: 2 }}>
        <Typography variant="body2">Freeze and Burn SYS tx:</Typography>
        <Link
          href={`${NEVM_TX_BLOCKCHAIN_URL}${freezeAndBurnTx?.payload.data.hash}`}
          target="_blank"
        >
          {freezeAndBurnTx?.payload.data.hash}
        </Link>
      </Box>
      <Box sx={{ mb: 2 }}>
        <Typography variant="body2">Mint SYSX tx:</Typography>
        <Link
          href={`${SYSCOIN_TX_BLOCKCHAIN_URL}${mintSysTx?.payload.data.tx}`}
          target="_blank"
        >
          {mintSysTx?.payload.data.tx}
        </Link>
      </Box>
      <Box>
        <Typography variant="body2">Burn SYSX tx:</Typography>
        <Link
          href={`${SYSCOIN_TX_BLOCKCHAIN_URL}${burnSysxTx?.payload.data.tx}`}
          target="_blank"
        >
          {burnSysxTx?.payload.data.tx}
        </Link>
      </Box>
    </Box>
  );
};

export default BridgeV3CompleteNevmToSys;
