import { GetServerSideProps, NextPage } from "next";
import { SessionUser, withSessionSsr } from "lib/session";
import { Button, Container, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
type Props = {
  user: SessionUser;
};

const AdminPage: NextPage<Props> = ({ user }) => {
  const { refresh } = useRouter();

  const onLogout = () => {
    fetch("/api/admin/logout").then((res) => {
      res.ok && refresh();
    });
  };

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h5">Admin, {user.name}</Typography>
      <Button variant="contained" onClick={onLogout}>
        Logout
      </Button>
    </Container>
  );
};

// This gets called on every request
export const getServerSideProps: GetServerSideProps = withSessionSsr(
  async ({ req }) => {
    const { user } = req.session;

    if (!user) {
      return {
        redirect: {
          destination: "/admin/login",
          permanent: false,
        },
      };
    }

    return {
      props: {
        user,
      },
    };
  }
);

export default AdminPage;
