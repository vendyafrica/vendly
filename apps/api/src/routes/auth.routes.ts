import { Router } from "express";
import { auth, toNodeHandler } from "@vendly/auth";


const router: Router = Router();

router.get("/test", (_req, res) => {
  console.log("✅ /test route was reached!");
  res.json({ message: "Auth router is working!" });
});

router.use(toNodeHandler(auth));

export default router;