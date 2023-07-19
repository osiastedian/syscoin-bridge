import { BlockbookAPIURL } from "@contexts/Transfer/constants";
import { createContext, useContext, useMemo } from "react";

import { syscoin, utils as syscoinUtils } from "syscoinjs-lib";

export const SyscoinContext = createContext<syscoin>(
  new syscoin(null, BlockbookAPIURL, syscoinUtils.syscoinNetworks.mainnet)
);

export const useSyscoin = () => useContext(SyscoinContext);

export const SyscoinProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const instance = useMemo(
    () =>
      new syscoin(null, BlockbookAPIURL, syscoinUtils.syscoinNetworks.mainnet),
    []
  );
  return (
    <SyscoinContext.Provider value={instance}>
      {children}
    </SyscoinContext.Provider>
  );
};
