import { ITransfer } from "@contexts/Transfer/types";
import firebase from "firebase-setup";
import { doc, getDoc } from "firebase/firestore";

export const getTransfer = async (id: string): Promise<ITransfer> => {
  const document = await getDoc(
    doc(firebase.firestore, "transfers", id as string)
  );
  if (!document.exists()) {
    throw new Error("Transfer not found");
  }
  return document.data() as ITransfer;
};
