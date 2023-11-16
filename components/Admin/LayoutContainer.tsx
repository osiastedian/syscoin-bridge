import { Container } from "@mui/material";
import { ReactNode } from "react";

export const AdminLayoutContainer: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  return (
    <Container
      sx={{ py: 4, height: "100vh", display: "flex", flexDirection: "column" }}
    >
      {children}
    </Container>
  );
};
