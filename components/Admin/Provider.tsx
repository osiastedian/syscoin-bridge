import { useNEVM } from "@contexts/ConnectedWallet/NEVMProvider";
import { usePaliWalletV2 } from "@contexts/PaliWallet/usePaliWallet";
import { Button, Container, Typography } from "@mui/material";
import { IAdmin } from "models/admin";
import { NextPage } from "next";
import { createContext, useContext, useMemo } from "react";
import { useQuery } from "react-query";

interface IAdminContext {
  admin?: IAdmin | null;
}

const AdminContext = createContext({} as IAdminContext);

export const useAdmin = () => useContext(AdminContext);

const AdminProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { account } = useNEVM();
  const isConnected = Boolean(account);
  const { data: admin, isFetched } = useQuery(
    [account, "is_admin"],
    async () => {
      const res = await fetch(`/api/admin?address=${account}`);
      const data: IAdmin = await res.json();
      return data;
    },
    { enabled: isConnected }
  );
  const value = useMemo(
    () => ({ admin: isFetched ? admin : null }),
    [admin, isFetched]
  );
  return (
    <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
  );
};

export default AdminProvider;
