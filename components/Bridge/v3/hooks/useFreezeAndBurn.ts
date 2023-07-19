import { ITransfer } from "@contexts/Transfer/types";
import { useWeb3 } from "../context/Web";
import { useMutation } from "react-query";
import { SYSX_ASSET_GUID } from "@contexts/Transfer/constants";
import { toWei } from "web3-utils";
import { useErc20ManagerContract } from "./useErc20ManagerContract";

export const useFreezeAndBurn = (transfer: ITransfer) => {
  const erc20ManagerContract = useErc20ManagerContract();
  const web3 = useWeb3();
  return useMutation(["freezeAndBurn", transfer.id], {
    mutationFn: async () => {
      const amount = toWei(transfer.amount.toString(), "ether");
      const method = erc20ManagerContract.methods.freezeBurnERC20(
        amount,
        SYSX_ASSET_GUID,
        transfer.utxoAddress
      );

      const gasPrice = await web3.eth.getGasPrice();

      const gas = await method.estimateGas().catch((error: Error) => {
        console.error("Estimate gas error", error);
      });

      return new Promise<string>((resolve, reject) => {
        method
          .send({
            from: transfer.nevmAddress,
            gas,
            value: amount,
            gasPrice,
          })
          .once("transactionHash", (hash: string | { success: false }) => {
            if (typeof hash !== "string") {
              reject("Failed to freeze and burn sys. Check browser logs");
              console.error("freeze and burn failed", hash);
            } else {
              resolve(hash);
            }
          })
          .on("error", (error: { message: string }) => {
            if (/might still be mined/.test(error.message)) {
              resolve("");
            } else {
              console.error(error);
              reject(error.message);
            }
          });
      });
    },
  });
};
