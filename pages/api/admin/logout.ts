import { withSessionRoute } from "lib/session";
import { NextApiHandler } from "next";

const AdminLogoutRoute: NextApiHandler = withSessionRoute(async (req, res) => {
  req.session.destroy();
  res.send({ ok: true });
});

export default AdminLogoutRoute;
