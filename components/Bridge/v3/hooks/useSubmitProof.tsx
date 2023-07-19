import { useMutation } from "react-query";
import { SPVProof } from "syscoinjs-lib";

import { getProof } from "bitcoin-proof";
import { useWeb3 } from "../context/Web";
import { useRelayContract } from "./useRelayContract";
import { ITransfer } from "@contexts/Transfer/types";

export const isSpvProof = (data: unknown): data is SPVProof => {
  return typeof data === "object" && data !== null && "nevm_blockhash" in data;
};

export const useSubmitProof = (transfer: ITransfer, proof: SPVProof) => {
  const relayContract = useRelayContract();
  const web3 = useWeb3();
  return useMutation(["submitProof", proof.transaction], async () => {
    const nevmBlock = await web3.eth.getBlock(`0x${proof.nevm_blockhash}`);
    if (!nevmBlock) {
      throw new Error("NEVM block not found: " + proof.nevm_blockhash);
    }
    const txBytes = `0x${proof.transaction}`;
    const txIndex = proof.index;
    const merkleProof = getProof(proof.siblings, txIndex);
    merkleProof.sibling = merkleProof.sibling.map((sibling) => `0x${sibling}`);
    const syscoinBlockheader = `0x${proof.header}`;

    const method = relayContract.methods.relayTx(
      nevmBlock.number,
      txBytes,
      txIndex,
      merkleProof.sibling,
      syscoinBlockheader
    );

    const gasPrice = await web3.eth.getGasPrice();

    const gas = await method.estimateGas().catch((error: Error) => {
      console.error("Estimate gas error", error);
    });

    return new Promise((resolve, reject) => {
      method
        .send({
          from: transfer.nevmAddress,
          gas: gas ?? 400_000,
          gasPrice,
        })
        .once("transactionHash", (hash: string | { success: false }) => {
          if (typeof hash !== "string" && !hash.success) {
            reject("Failed to submit proofs. Check browser logs");
            console.error("Submission failed", hash);
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
  });
};
