import { useQuery } from "react-query";
import { useWeb3 } from "../context/Web";

export const useNevmTransaction = (transactionHash?: string) => {
  const web3 = useWeb3();
  return useQuery(["nevm", "transaction", transactionHash], {
    queryFn: async () => {
      const receipt = await web3.eth.getTransactionReceipt(transactionHash!);

      if (receipt.status === true) {
        return receipt;
      }
      throw new Error("Transaction not confirmed");
    },
    refetchInterval: 1000,
    retry: true,
    enabled: Boolean(transactionHash),
  });
};
