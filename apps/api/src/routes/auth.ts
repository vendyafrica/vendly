import { Router } from "express";
import { getSession } from "../lib/auth";


export const authRoutes : Router = Router();

authRoutes.post("/me",getSession);
