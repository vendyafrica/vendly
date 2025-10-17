import { fromNodeHeaders } from "better-auth/node";
import { auth } from "@vendly/auth";
import { Router } from "express";


const router: Router = Router();

router.get("/me", async (req, res) => {
    const session = await auth.api.getSession({
        headers: fromNodeHeaders(req.headers),
    });
    return res.json(session);
});

router.get("/ok", async (_req, res) => {
    return res.json({ status: "ok" });
});



export default router;

