import { Router } from "express";
import { joinWaitlistHandler } from "./handler";

export const waitlistRoutes : Router = Router();

waitlistRoutes.post("/join", joinWaitlistHandler);