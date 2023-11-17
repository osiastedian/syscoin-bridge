import { Change } from "api/types/admin";
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import adminSessionGuard from "utils/api/admin-session-guard";
import { verifySignature } from "utils/api/verify-signature";
import TransferModel from "models/transfer";
import dbConnect from "lib/mongodb";
import { ITransfer } from "@contexts/Transfer/types";

interface OverrideTransferRequestBody {
  changes: Change[];
  signedMessage: string;
}

const AdminTransfer: NextApiHandler = adminSessionGuard(
  async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== "POST") {
      return res.status(405).json({ message: "Method not allowed" });
    }

    const { user } = req.session;
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { id } = req.query;

    const { changes, signedMessage } = req.body as OverrideTransferRequestBody;

    if (changes.length === 0) {
      return res.status(400).json({ message: "No changes provided" });
    }

    const isVerified = verifySignature(
      JSON.stringify(changes),
      signedMessage,
      user.address
    );

    if (isVerified) {
      return res.status(401).json({ success: false });
    }

    await dbConnect();

    const transfer = await TransferModel.findOne({ id });

    if (!transfer) {
      return res.status(404).json({ message: "Transfer not found" });
    }

    changes.forEach((change) => {
      const { property, from, to } = change;
      const isSameType =
        typeof transfer[property] !== "object" &&
        typeof transfer[property] === typeof from &&
        typeof transfer[property] === typeof to;
      if (isSameType && transfer[property] === from) {
        transfer[property] = to as never;
      }
    });

    const updatedTransfer = await transfer.save();

    console.log({ updatedTransfer })

    return res.status(200).json(updatedTransfer);
  }
);

export default AdminTransfer;
