// apps/api/src/routes/onboarding.ts
import { Router, Request, Response } from 'express';
import type { Router as ExpressRouter } from 'express';
import { z } from 'zod';

const router: ExpressRouter = Router();

// Debug: module load
console.log('[onboarding] router initialized');

// Trace requests hitting this router
router.use((req, _res, next) => {
  console.log('[onboarding] hit', req.method, req.originalUrl);
  next();
});

// Enums mirrored for validation (align with @vendly/types)
const CountryEnum = z.enum(['KE', 'UG']);
const PayoutMethodEnum = z.enum(['mobile_money', 'bank']);
const MobileMoneyProviderEnum = z.enum(['mpesa', 'airtel', 'mtn']);

// Schemas mirroring SellerOnboardingRequest (packages/types/src/dtos/Onboarding.ts)
const accountSchema = z.object({
  fullName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(6),
  country: CountryEnum,
});

const storeSchema = z.object({
  name: z.string().min(1),
  slug: z.string().regex(/^[a-z0-9-]{3,30}$/),
  primaryCategory: z.string().min(1),
  city: z.string().min(1),
  pickupAddress: z.string().min(1),
  description: z.string().optional(),
  logoUrl: z.string().url().optional(),
  bannerUrl: z.string().url().optional(),
  templateId: z.string().optional(),
  primaryColor: z.string().optional(),
  secondaryColor: z.string().optional(),
  marketplaceListed: z.boolean().optional(),
});

const payoutSchema = z.object({
  method: PayoutMethodEnum,
  mobileMoney: z
    .object({
      provider: MobileMoneyProviderEnum,
      phone: z.string().min(6),
    })
    .optional(),
  bank: z
    .object({
      accountName: z.string().min(1),
      accountNumber: z.string().min(3),
      bankName: z.string().min(1),
      branch: z.string().optional(),
      swift: z.string().optional(),
    })
    .optional(),
}).superRefine((val, ctx) => {
  if (val.method === 'mobile_money' && !val.mobileMoney) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'mobileMoney is required when method is mobile_money', path: ['mobileMoney'] });
  }
  if (val.method === 'bank' && !val.bank) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'bank is required when method is bank', path: ['bank'] });
  }
});

const socialSchema = z.object({
  instagram: z.boolean(),
  whatsappCatalog: z.boolean(),
});

const onboardingSchema = z.object({
  account: accountSchema,
  store: storeSchema,
  payout: payoutSchema,
  social: socialSchema,
});

type OnboardingBody = z.infer<typeof onboardingSchema>;

function genId(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

// Health/diagnostic
router.get('/', (_req: Request, res: Response) => {
  res.json({ ok: true, route: 'onboarding' });
});

// POST /api/onboarding
// Accepts SellerOnboardingRequest, returns SellerOnboardingResponse
router.post('/', async (req: Request, res: Response) => {
  const parse = onboardingSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({
      ok: false,
      error: 'ValidationError',
      details: parse.error.flatten(),
    });
  }

  const body: OnboardingBody = parse.data;

  // TODO: Implement persistence:
  // - Create User (if not exists from auth context)
  // - Create SellerProfile with payout details
  // - Create Store with currency inferred from country (KE->KES, UG->UGX)
  // - Kick off initial imports for IG/WhatsApp (background job)
  // - Issue access/refresh tokens if creating user here

  const userId = genId('usr');
  const sellerProfileId = genId('sel');
  const storeId = genId('str');

  // Normalize slug (backend should ensure uniqueness)
  const storeSlug = body.store.slug;

  // Placeholder response shaped like SellerOnboardingResponse
  return res.status(201).json({
    ok: true,
    data: {
      userId,
      sellerProfileId,
      storeId,
      storeSlug,
      // Optionally include tokens if the flow generates them here
      // accessToken,
      // refreshToken,
    },
  });
});

export default router;