import {
  fromRpcSig,
  hashPersonalMessage,
  toBuffer,
  ecrecover,
  bufferToHex,
  pubToAddress,
} from "ethereumjs-util";

export const verifySignature = (
  message: string,
  signedMessage: string,
  address: string
) => {
  const sigParams = fromRpcSig(signedMessage);

  const msgHash = hashPersonalMessage(
    toBuffer(`0x${Buffer.from(message, "utf8").toString("hex")}`)
  );

  const publicKey = ecrecover(msgHash, sigParams.v, sigParams.r, sigParams.s);
  const recoveredAddress = bufferToHex(pubToAddress(publicKey));

  return recoveredAddress.toLowerCase() !== address.toLowerCase();
};
