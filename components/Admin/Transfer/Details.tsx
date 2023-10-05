"use client";

import TransferProvider from "@contexts/Transfer/Provider";
import { Box, TextField } from "@mui/material";
import { useState } from "react";
import AdminTransferBasicDetails from "./BasicDetails";

const AdminTransferDetails = () => {
  const [transferId, setTransferId] = useState<string>();
  return (
    <Box my={4}>
      <TextField
        value={transferId}
        onChange={(e) => setTransferId(e.target.value)}
        label="Transfer ID"
        sx={{ mb: 2 }}
      />

      {transferId && (
        <TransferProvider id={transferId}>
          <AdminTransferBasicDetails />
        </TransferProvider>
      )}
    </Box>
  );
};

export default AdminTransferDetails;
