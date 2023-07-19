import { BlockbookAPIURL } from "@contexts/Transfer/constants";
import { UseQueryOptions, useQuery } from "react-query";
import { utils as syscoinUtils } from "syscoinjs-lib";

export const useProof = (
  txId: string | undefined,
  options: Partial<UseQueryOptions>
) => {
  return useQuery(
    ["proofs", txId],
    async () => {
      const { result } = await syscoinUtils.fetchBackendSPVProof(
        BlockbookAPIURL,
        txId!
      );
      return result;
    },
    {
      onSuccess: options.onSuccess,
      enabled: Boolean(txId),
    }
  );
};
