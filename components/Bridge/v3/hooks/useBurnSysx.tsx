import burnSysToSysx from "@contexts/Transfer/functions/burnSysToSysx";
import { ITransfer } from "@contexts/Transfer/types";
import { useMutation } from "react-query";
import { useSyscoin } from "../context/Syscoin";
import { usePaliWalletV2 } from "@contexts/PaliWallet/usePaliWallet";
import burnSysx from "@contexts/Transfer/functions/burnSysx";
import { SYSX_ASSET_GUID } from "@contexts/Transfer/constants";

export const useBurnSysx = (transfer: ITransfer, toNevm = true) => {
  const syscoinInstance = useSyscoin();
  const { sendTransaction } = usePaliWalletV2();
  return useMutation(["burnSyx", transfer.id], {
    mutationFn: async () => {
      if (!transfer.utxoXpub || !transfer.utxoAddress) {
        throw new Error("Missing UTXO information");
      }

      if (!transfer.nevmAddress) {
        throw new Error("Missing NEVM address");
      }

      const psbt = await burnSysx(
        syscoinInstance,
        transfer.amount,
        SYSX_ASSET_GUID,
        transfer.utxoAddress,
        transfer.utxoXpub,
        toNevm ? transfer.nevmAddress.replace(/^0x/g, "") : ""
      );

      const { tx, error } = await sendTransaction(psbt);

      if (error) {
        throw new Error(error);
      }
      return tx;
    },
  });
};
