import { Router } from "express";
import { joinWaitlistHandler } from "./handler.js";

export const waitlistRoutes: Router = Router();

waitlistRoutes.post("/join", joinWaitlistHandler);