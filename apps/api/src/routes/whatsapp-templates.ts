import { Router } from "express";
import type { Router as ExpressRouter } from "express";
import { templateRegistry } from "../services/whatsapp/template-registry";
import { whatsappClient } from "../services/whatsapp/whatsapp-client";

export const whatsappTemplatesRouter: ExpressRouter = Router();

// POST /api/internal/whatsapp/templates/sync
// Protected by a simple shared secret to avoid accidentally exposing template management.
whatsappTemplatesRouter.post("/internal/whatsapp/templates/sync", async (req, res, next) => {
  try {
    const expected = process.env.INTERNAL_API_KEY;
    const provided = req.header("x-internal-api-key");

    if (!expected || !provided || provided !== expected) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const defs = [templateRegistry.sellerNewPaidOrder(), templateRegistry.orderReadyUpdate()];

    const results = [];
    for (const def of defs) {
      const created = await whatsappClient.createTemplate(def);
      results.push({ name: def.name, result: created });
    }

    return res.json({ ok: true, results });
  } catch (err) {
    next(err);
  }
});
