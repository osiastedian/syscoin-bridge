import { withSessionRoute } from "lib/session";
import { NextApiHandler } from "next";

const adminSessionGuard = (handler: NextApiHandler) => {
  const checkHandler: NextApiHandler = withSessionRoute(async (req, res) => {
    const { user } = req.session;
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    return handler(req, res);
  });
  return checkHandler;
};

export default adminSessionGuard;
