import { useMemo } from "react";

import relayAbi from "@contexts/Transfer/relay-abi";
import { useWeb3 } from "../context/Web";

export const useRelayContract = () => {
  const web3 = useWeb3();
  return useMemo(
    () =>
      new web3.eth.Contract(
        relayAbi,
        "0xD822557aC2F2b77A1988617308e4A29A89Cb95A6"
      ),
    [web3]
  );
};
