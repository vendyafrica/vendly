import { Router } from 'express';
import onboardingController from '../controllers/onboarding.controller';

const router:Router = Router();
router.post('/onboarding', onboardingController.onboardUser);