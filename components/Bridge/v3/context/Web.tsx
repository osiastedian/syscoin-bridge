import { createContext, useContext, useEffect, useState } from "react";
import Web3 from "web3";

const Web3Context = createContext(new Web3());

export const useWeb3 = () => useContext(Web3Context);

type Props = {
  children: React.ReactNode;
};

export const Web3Provider: React.FC<Props> = ({ children }) => {
  const [web3, setWeb3] = useState<Web3>(new Web3(Web3.givenProvider));

  useEffect(() => {
    if (!window?.ethereum) {
      return;
    }
    setWeb3(new Web3(window.ethereum));
  }, []);

  return <Web3Context.Provider value={web3}>{children}</Web3Context.Provider>;
};
