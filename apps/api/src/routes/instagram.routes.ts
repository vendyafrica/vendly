import { Router, Request, Response } from "express";
import {
  InstagramConfig,
  TokenStore,
  InstagramOAuthService,
  TokenData
} from "@vendly/instagram";

// Initialize services
const config = new InstagramConfig();
const tokenStore = new TokenStore();
const instagramService = new InstagramOAuthService(config, tokenStore);

const router: Router = Router();

// Import route handlers
import { handleAuthInstagram } from './instagram/auth.routes';
import { handleCallback, handleExchange } from './instagram/callback.routes';
import { handleGetProfile } from './instagram/profile.routes';
import { handleStatus } from './instagram/status.routes';
import { handleRefresh } from './instagram/refresh.routes';
import { handleDebug } from './instagram/debug.routes';

// Route definitions
router.get("/auth/instagram", handleAuthInstagram(config, instagramService));
router.get("/auth/instagram/callback", handleCallback(instagramService, tokenStore));
router.post("/auth/instagram/exchange", handleExchange(instagramService, tokenStore));
router.get("/me", handleGetProfile(instagramService, tokenStore));
router.get("/auth/instagram/status", handleStatus(tokenStore));
router.post("/auth/instagram/refresh", handleRefresh(instagramService, tokenStore));
router.get("/auth/instagram/debug", handleDebug(config));

export default router;