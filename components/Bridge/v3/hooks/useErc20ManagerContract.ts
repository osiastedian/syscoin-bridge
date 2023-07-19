import { useMemo } from "react";
import { useWeb3 } from "../context/Web";
import SyscoinERC20ManagerABI from "@contexts/Transfer/abi/SyscoinERC20Manager";

export const useErc20ManagerContract = () => {
  const web3 = useWeb3();
  return useMemo(
    () =>
      new web3.eth.Contract(
        SyscoinERC20ManagerABI,
        "0xA738a563F9ecb55e0b2245D1e9E380f0fE455ea1"
      ),
    [web3]
  );
};
