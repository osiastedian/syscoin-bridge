import { SendUtxoTransaction } from "@contexts/ConnectedWallet/Provider";
import { Dispatch } from "react";
import { SPVProof, syscoin, utils as syscoinUtils } from "syscoinjs-lib";
import { BlockbookAPIURL, SYSX_ASSET_GUID } from "../constants";
import burnSysToSysx from "./burnSysToSysx";
import burnSysx from "./burnSysx";
import { addLog, TransferActions } from "../store/actions";
import { ITransfer } from "../types";
import Web3 from "web3";
import { Contract } from "web3-eth-contract";

import { getProof } from "bitcoin-proof";
import { TransactionReceipt } from "web3-core";
import { captureException } from "@sentry/nextjs";

type SysToNevmStateMachineParams = {
  transfer: ITransfer;
  dispatch: Dispatch<TransferActions>;
  syscoinInstance: syscoin;
  web3: Web3;
  sendUtxoTransaction: SendUtxoTransaction;
  relayContract: Contract;
  confirmTransaction: (
    chain: "nevm" | "utxo",
    transactionHash: string,
    duration?: number,
    confirmations?: number
  ) => Promise<syscoinUtils.BlockbookTransactionBTC | TransactionReceipt>;
};

const runWithSysToNevmStateMachine = async (
  params: SysToNevmStateMachineParams
) => {
  const {
    transfer,
    syscoinInstance,
    web3,
    dispatch,
    relayContract,
    sendUtxoTransaction,
    confirmTransaction,
  } = params;
  switch (transfer.status) {
    case "burn-sys": {
      if (transfer.logs.find((log) => log.status === "burn-sys")) {
        return Promise.resolve();
      }
      const burnSysTransaction = await burnSysToSysx(
        syscoinInstance,
        parseFloat(transfer.amount).toFixed(6),
        transfer.utxoXpub!,
        transfer.utxoAddress!
      );
      await sendUtxoTransaction(burnSysTransaction)
        .then((burnSysTransactionReceipt) => {
          console.log("burn-sys", burnSysTransactionReceipt, new Date());
          dispatch(
            addLog("burn-sys", "Burning SYS to SYSX", burnSysTransactionReceipt)
          );
        })
        .catch((error) => {
          captureException(error);
          console.error("burn-sys error", error);
          return Promise.reject(error);
        });
      break;
    }

    case "confirm-burn-sys": {
      const { tx } = transfer.logs.find((log) => log.status === "burn-sys")
        ?.payload.data;
      const transactionRaw = await confirmTransaction("utxo", tx, 0, 0);
      if (!transactionRaw) {
        return;
      }
      break;
    }

    case "burn-sysx": {
      if (transfer.logs.find((log) => log.status === "burn-sysx")) {
        return Promise.resolve();
      }
      const burnSysxTransaction = await burnSysx(
        syscoinInstance,
        transfer.amount,
        SYSX_ASSET_GUID,
        transfer.utxoAddress!,
        transfer.utxoXpub!,
        transfer.nevmAddress!.replace(/^0x/g, "")
      );
      await sendUtxoTransaction(burnSysxTransaction)
        .then((burnSysxTransactionReceipt) => {
          dispatch(
            addLog(
              "burn-sysx",
              "Burning SYSX to NEVM",
              burnSysxTransactionReceipt
            )
          );
        })
        .catch((error) => {
          captureException(error);
          console.error("burn-sysx error", error);
          return Promise.reject(error);
        });
      break;
    }

    case "confirm-burn-sysx": {
      const { tx } = transfer.logs.find((log) => log.status === "burn-sysx")
        ?.payload.data;
      const transactionRaw = await confirmTransaction("utxo", tx);
      if (!transactionRaw) {
        return;
      }
      break;
    }

    case "generate-proofs": {
      console.log("Fetching backednd proof");
      const { tx } = transfer.logs.find((log) => log.status === "burn-sysx")
        ?.payload.data;
      const proof = await syscoinUtils.fetchBackendSPVProof(
        BlockbookAPIURL,
        tx
      );
      if (proof.result === "") {
        throw new Error("Proof not yet available");
      }
      const results = JSON.parse(proof.result) as SPVProof;
      dispatch(addLog("generate-proofs", "Submitting proofs", { results }));
      break;
    }

    case "submit-proofs": {
      if (transfer.logs.find((log) => log.status === "submit-proofs")) {
        return Promise.resolve();
      }
      let fromAccount = transfer.nevmAddress!;
      const switchLog = transfer.logs
        .reverse()
        .find((log) => log.status === "switch")?.payload.data;
      if (switchLog) {
        fromAccount = switchLog.address;
      }
      const proof = transfer.logs.find(
        (log) => log.status === "generate-proofs"
      )?.payload.data.results as SPVProof;
      const nevmBlock = await web3.eth.getBlock(`0x${proof.nevm_blockhash}`);
      if (!nevmBlock) {
        throw new Error("NEVM block not found: " + proof.nevm_blockhash);
      }
      const txBytes = `0x${proof.transaction}`;
      const txIndex = proof.index;
      const merkleProof = getProof(proof.siblings, txIndex);
      merkleProof.sibling = merkleProof.sibling.map(
        (sibling) => `0x${sibling}`
      );
      const syscoinBlockheader = `0x${proof.header}`;

      const method = relayContract.methods.relayTx(
        nevmBlock.number,
        txBytes,
        txIndex,
        merkleProof.sibling,
        syscoinBlockheader
      );

      const gasPrice = await web3.eth.getGasPrice();

      const gas = await method
        .estimateGas({ from: fromAccount })
        .catch((error: Error) => {
          captureException(error);
          console.error("Estimate gas error", error);
        });

      return new Promise((resolve, reject) => {
        method
          .send({
            from: fromAccount,
            gas: gas ?? 400_000,
            gasPrice,
          })
          .once("transactionHash", (hash: string | { success: false }) => {
            if (typeof hash !== "string" && !hash.success) {
              dispatch(
                addLog("error", "Submission Failed", {
                  error: hash,
                })
              );
              reject("Failed to submit proofs. Check browser logs");
            } else {
              dispatch(
                addLog("submit-proofs", "Transaction hash", {
                  hash,
                })
              );
              resolve(hash);
            }
          })
          .on("error", (error: { message: string }) => {
            if (/might still be mined/.test(error.message)) {
              resolve("");
            } else {
              dispatch(
                addLog("error", error.message ?? "Proof error", {
                  error,
                })
              );
              reject(error.message);
            }
          });
      });
    }
    case "finalizing":
      {
        const submitProofLog = transfer.logs.find(
          (log) => log.status === "submit-proofs"
        );
        const submitProofsHash = submitProofLog?.payload.data.hash;
        if (!submitProofsHash) {
          console.error("submit-proofs hash not found");
          return;
        }
        const receipt = await confirmTransaction("nevm", submitProofsHash);
        dispatch(
          addLog("finalizing", "Transaction Receipt", {
            receipt,
          })
        );
      }
      break;

    default:
      return;
  }
};

export default runWithSysToNevmStateMachine;
