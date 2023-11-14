import { ADMIN_LOGIN_MESSAGE } from "@constants";
import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "lib/session";
import { NextApiHandler } from "next";
import {
  fromRpcSig,
  hashPersonalMessage,
  toBuffer,
  ecrecover,
  bufferToHex,
  pubToAddress,
} from "ethereumjs-util";

const AdminLoginApiRoute: NextApiHandler = withIronSessionApiRoute(
  async (req, res) => {
    const { address, signedMessage } = req.body;

    const sigParams = fromRpcSig(signedMessage);

    const msgHash = hashPersonalMessage(
      toBuffer(`0x${Buffer.from(ADMIN_LOGIN_MESSAGE, "utf8").toString("hex")}`)
    );

    // Recover the public key from the signature
    const publicKey = ecrecover(msgHash, sigParams.v, sigParams.r, sigParams.s);
    const recoveredAddress = bufferToHex(pubToAddress(publicKey));

    console.log({ recoveredAddress, publicKey });

    if (recoveredAddress.toLowerCase() === address.toLowerCase()) {
      req.session.user = {
        address,
        name: "Test",
      };
      await req.session.save();
      return res.status(200).json({ success: true });
    }

    return res.status(401).json({ success: false });
  },
  sessionOptions
);

export default AdminLoginApiRoute;
