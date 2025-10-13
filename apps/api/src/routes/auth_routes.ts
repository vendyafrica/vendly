import { Router } from "express";
import { auth, toNodeHandler } from "@vendly/auth";
import { fromNodeHeaders } from "better-auth/node";


const router: Router = Router();

router.get("/me", async (req, res) => {
 	const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });
	return res.json(session);
});

router.use(toNodeHandler(auth));

export default router;