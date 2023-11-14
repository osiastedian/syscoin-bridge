import { Box, Button, TextField } from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEventHandler, useState } from "react";

const AdminTransferFilters: React.FC = () => {
  const { get } = useSearchParams();
  const [id, setId] = useState(get("id"));

  return (
    <Box component="form" sx={{ mt: 2, alignItems: "center", display: "flex" }}>
      <TextField
        name="id"
        label="ID"
        placeholder="Input ID here"
        value={id}
        onChange={(e) => setId(e.target.value)}
      />
      <Button type="submit" sx={{ ml: 2 }}>
        Filter
      </Button>
    </Box>
  );
};

export default AdminTransferFilters;
