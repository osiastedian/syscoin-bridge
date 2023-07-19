import { BlockbookAPIURL } from "@contexts/Transfer/constants";
import { useQuery } from "react-query";
import { utils as syscoinUtils } from "syscoinjs-lib";

export const useUtxoTransaction = (transactionId?: string, confirmations = 1) =>
  useQuery(["utxo", "transaction", transactionId], {
    queryFn: async () => {
      const transaction = await syscoinUtils.fetchBackendRawTx(
        BlockbookAPIURL,
        transactionId!
      );
      if (transaction.confirmations >= confirmations) {
        return transaction;
      }
      throw new Error("Transaction not confirmed");
    },
    refetchInterval: 1000,
    retry: true,
    enabled: Boolean(transactionId),
  });
