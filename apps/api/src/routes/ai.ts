 import { Router } from "express";
 import { aiController } from "../controllers/ai-controller";
 
 const router = Router();
 
 router.post("/chat", (req, res) => aiController.chat(req, res));
 router.get("/chats", (req, res) => aiController.getChats(req, res));
 router.get("/chats/:chatId", (req, res) => aiController.getChatById(req, res));
 router.post("/chat/resume", (req, res) => aiController.resumeChat(req, res));
 router.post("/chat/ownership", (req, res) => aiController.createOwnership(req, res));
 
 export default router;
