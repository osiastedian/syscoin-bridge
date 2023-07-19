import { ITransfer } from "@contexts/Transfer/types";
import { Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import NextLink from "next/link";
import { useQuery } from "react-query";

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

type TransferDataGridProps = {
  xpub?: string;
  account?: string;
  isFullyConnected: boolean;
  items: ITransfer[];
  version?: string;
  bridgeVersion?: string;
};
const TransferDataGrid: React.FC<TransferDataGridProps> = ({
  account,
  xpub,
  isFullyConnected,
  items,
  version,
  bridgeVersion,
}) => {
  const { data, isFetched, isLoading, error } = useQuery(
    "transfers",
    () => {
      const searchParams = new URLSearchParams();
      if (xpub) {
        searchParams.set("utxo", xpub);
      }
      if (account) {
        searchParams.set("nevm", account);
      }
      if (version) {
        searchParams.set("version", version);
      }
      return axios(`/api/transfer?${searchParams.toString()}`);
    },
    { enabled: isFullyConnected }
  );
  return (
    <DataGrid
      loading={isLoading}
      columns={[
        {
          field: "id",
          headerName: "Id",
          width: 130,
          renderCell: ({ value, row }) => (
            <NextLink
              href={`/bridge/${
                row.version !== "v1" ? (bridgeVersion ?? row.version) + "/" : ""
              }${value}`}
            >
              <Typography
                variant="body2"
                color="primary"
                sx={{ cursor: "pointer" }}
              >
                {value}
              </Typography>
            </NextLink>
          ),
        },
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
      ]}
      rows={isFetched ? data?.data ?? items : []}
      sx={{ background: "white", mb: 2 }}
      autoHeight
      error={error}
    />
  );
};

export default TransferDataGrid;
