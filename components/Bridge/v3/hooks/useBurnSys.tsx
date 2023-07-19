import burnSysToSysx from "@contexts/Transfer/functions/burnSysToSysx";
import { ITransfer } from "@contexts/Transfer/types";
import { useMutation } from "react-query";
import { useSyscoin } from "../context/Syscoin";
import { usePaliWalletV2 } from "@contexts/PaliWallet/usePaliWallet";

export const useBurnSys = (transfer: ITransfer) => {
  const syscoinInstance = useSyscoin();
  const { sendTransaction } = usePaliWalletV2();
  return useMutation(["burnSys", transfer.id], {
    mutationFn: async () => {
      if (!transfer.utxoXpub || !transfer.utxoAddress) {
        throw new Error("Missing UTXO information");
      }
      const psbt = await burnSysToSysx(
        syscoinInstance,
        transfer.amount,
        transfer.utxoXpub,
        transfer.utxoAddress
      );

      const { tx, error } = await sendTransaction(psbt);

      if (error) {
        throw new Error(error);
      }
      return tx;
    },
  });
};
