import { ADMIN_LOGIN_MESSAGE } from "@constants";
import { sessionOptions, withSessionRoute } from "lib/session";
import { NextApiHandler } from "next";
import {
  fromRpcSig,
  hashPersonalMessage,
  toBuffer,
  ecrecover,
  bufferToHex,
  pubToAddress,
} from "ethereumjs-util";
import dbConnect from "lib/mongodb";
import AdminModel from "models/admin";
import { verifySignature } from "utils/api/verify-signature";

const AdminLoginApiRoute: NextApiHandler = withSessionRoute(
  async (req, res) => {
    const { address, signedMessage } = req.body;

    const isVerified = verifySignature(
      ADMIN_LOGIN_MESSAGE,
      signedMessage,
      address
    );

    if (isVerified) {
      return res.status(401).json({ success: false });
    }

    await dbConnect();

    const adminUser = await AdminModel.findOne({ address });

    if (!adminUser) {
      return res.status(401).json({ success: false });
    }

    req.session.user = {
      address: adminUser.address,
      name: adminUser.name,
    };

    await req.session.save();
    return res.status(200).json({ success: true });
  }
);

export default AdminLoginApiRoute;
