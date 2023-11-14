import { ITransfer } from "@contexts/Transfer/types";
import { DataGrid } from "@mui/x-data-grid";
import { TRANSFER_COLUMNS } from "components/Transfer/columns";

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
