import { ADMIN_LOGIN_MESSAGE } from "@constants";
import { useNEVM } from "@contexts/ConnectedWallet/NEVMProvider";
import { Button, Container, Typography } from "@mui/material";
import ConnectAdmin from "components/Admin/ConnectAdmin";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";

export const AdminAuthenticationPage: NextPage = () => {
  const { account, signMessage } = useNEVM();
  const { replace } = useRouter();

  const onLogin = () => {
    signMessage(ADMIN_LOGIN_MESSAGE)
      .then((signedMessage) =>
        fetch("/api/admin/login", {
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ address: account, signedMessage }),
          method: "POST",
        })
      )
      .then((res) => {
        if (res.status === 200) {
          replace("/admin");
        }
      });
  };

  useEffect(() => {
    if (account) {
      console.log({ account });
    }
  }, [account]);

  return (
    <Container
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <ConnectAdmin />
      {account && (
        <Button variant="contained" onClick={onLogin}>
          Login as Admin: {account}
        </Button>
      )}
    </Container>
  );
};

export default AdminAuthenticationPage;
