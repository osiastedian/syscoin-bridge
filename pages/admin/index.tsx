import { Container, Typography } from "@mui/material";
import ConnectAdmin from "components/Admin/ConnectAdmin";
import AdminProvider from "components/Admin/Provider";
import AdminTransferDetails from "components/Admin/Transfer/Details";
import { NextPage } from "next";

const AdminPage: NextPage = () => {
  return (
    <Container>
      <AdminProvider>
        <Typography>Bridge Admin Panel</Typography>
        <ConnectAdmin />
        <AdminTransferDetails />
      </AdminProvider>
    </Container>
  );
};

export default AdminPage;
