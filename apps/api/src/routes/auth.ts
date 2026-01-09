import { fromNodeHeaders } from "better-auth/node";
import { auth } from "@vendly/auth";
import { Router } from "express";

const router: Router = Router();

router.get("/api/me", async (req, res) => {
	const session = await auth.api.getSession({
		headers: fromNodeHeaders(req.headers),
	});
	return res.json(session);
});