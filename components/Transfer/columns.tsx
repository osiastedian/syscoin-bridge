import { Typography } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";

const DateField: React.FC<{ value: number }> = ({ value }) => {
  if (!value) {
    return (
      <Typography variant="body2" color="GrayText">
        EMPTY
      </Typography>
    );
  }
  return (
    <Typography variant="body1">{new Date(value).toLocaleString()}</Typography>
  );
};

export const TRANSFER_COLUMNS: GridColDef[] = [
  {
    field: "type",
    headerName: "Type",
  },
  {
    field: "amount",
    headerName: "Amount",
    renderCell: ({ value }) => `${value} SYS`,
  },
  {
    field: "utxoAddress",
    headerName: "UTXO",
    width: 320,
  },
  {
    field: "nevmAddress",
    headerName: "NEVM",
    width: 300,
  },
  {
    field: "status",
    headerName: "Status",
    renderCell: ({ value }) => {
      let color = "inherit";
      if (value === "completed") {
        color = "green";
      }
      if (value === "error") {
        color = "error";
      }
      return (
        <Typography variant="body1" color={color}>
          {value}
        </Typography>
      );
    },
  },
  {
    field: "createdAt",
    headerName: "Created At",
    width: 200,
    renderCell: ({ value }) => <DateField value={value} />,
  },
  {
    field: "updatedAt",
    headerName: "Updated At",
    width: 200,
    renderCell: ({ value }) => <DateField value={value} />,
  },
];
