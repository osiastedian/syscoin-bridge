import { GetServerSideProps, NextPage } from "next";
import { SessionUser, withSessionSsr } from "lib/session";
import { Box, Button, Container, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import AdminTransferList from "components/Admin/Transfer/List";
import TransferModel from "models/transfer";
import dbConnect from "lib/mongodb";
import { ITransfer } from "@contexts/Transfer/types";
import AdminTransferFilters from "components/Admin/Transfer/Filters";
import { FilterQuery } from "mongoose";
type Props = {
  user: SessionUser;
  transfers: ITransfer[];
  total: number;
};

const AdminPage: NextPage<Props> = ({ user, transfers, total }) => {
  const { refresh } = useRouter();

  const onLogout = () => {
    fetch("/api/admin/logout").then((res) => {
      res.ok && refresh();
    });
  };

  return (
    <Container
      sx={{ py: 4, height: "100vh", display: "flex", flexDirection: "column" }}
    >
      <Box>
        <Typography variant="h5">Admin, {user.name}</Typography>
        <Button variant="contained" onClick={onLogout}>
          Logout
        </Button>
      </Box>
      <AdminTransferFilters />
      <Box
        sx={{
          flex: 1,
          mt: 4,
          bgcolor: "background.paper",
          border: "px solid #000",
        }}
      >
        <AdminTransferList transfers={transfers} total={total} />
      </Box>
    </Container>
  );
};

// This gets called on every request
export const getServerSideProps: GetServerSideProps = withSessionSsr(
  async ({ req, query }) => {
    const { user } = req.session;

    if (!user) {
      return {
        redirect: {
          destination: "/admin/login",
          permanent: false,
        },
      };
    }

    await dbConnect();

    // Get query params
    const { id } = query;
    const filters: FilterQuery<ITransfer> = {};
    if (id) {
      filters.id = id as string;
    }
    const transfers = await TransferModel.find(filters)
      .sort({ createdAt: -1 })
      .limit(10);

    const total = await TransferModel.countDocuments();

    const props: Props = {
      user,
      transfers: transfers.map((transfer) =>
        JSON.parse(JSON.stringify(transfer))
      ),
      total,
    };

    return {
      props,
    };
  }
);

export default AdminPage;
