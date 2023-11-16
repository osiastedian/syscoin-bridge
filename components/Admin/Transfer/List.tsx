import { ITransfer } from "@contexts/Transfer/types";
import { Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { TRANSFER_COLUMNS } from "components/Transfer/columns";
import Link from "next/link";

const AdminTransferList: React.FC<{
  transfers: ITransfer[];
  total: number;
}> = ({ transfers, total }) => {
  return (
    <DataGrid
      columns={[
        {
          field: "id",
          headerName: "ID",
          renderCell: (params) => (
            <Link href={`/admin/transfer/${params.value}`}>
              <Typography variant="body1" color="primary">
                {params.value}
              </Typography>
            </Link>
          ),
        },
        ...TRANSFER_COLUMNS,
      ]}
      rows={transfers ?? []}
      rowCount={total}
      paginationMode="server"
      pageSize={10}
      pagination
    />
  );
};

export default AdminTransferList;
