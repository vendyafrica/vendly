# Instagram OAuth + Webhooks Setup Complete ✅

## What's Ready

### 1. OAuth Authentication ✅
- **Better Auth configured** with Instagram OAuth
- **Client plugin** added for frontend
- **Auto token exchange** - Short-lived → Long-lived (60 days)
- Location: `packages/auth/src/auth.ts`

### 2. Webhook Endpoints ✅
- **GET** `/api/instagram/webhooks` - Verification endpoint
- **POST** `/api/instagram/webhooks` - Event handler
- **Signature verification** - Validates requests from Instagram
- Location: `apps/api/src/modules/instagram/instagram-webhook-controller.ts`

### 3. Event Handlers (Stubbed) 📝
- `handleNewMedia()` - Auto-import logic **commented out**
- `handleComment()` - Comment handling **stubbed**
- `handleMention()` - Mention handling **stubbed**

## File Structure

```
apps/api/src/modules/instagram/
├── instagram-webhook-controller.ts  ✅ NEW - Webhook handler
├── instagram-routes.ts              ✅ UPDATED - Added webhook routes
├── instagram-controller.ts          ✅ Existing
├── instagram-sync-service.ts        ✅ Refactored
├── instagram-media-service.ts       ✅ Existing
├── instagram-repository.ts          ✅ Existing
├── instagram-models.ts              ✅ Updated
└── WEBHOOK_SETUP.md                 ✅ NEW - Setup guide

packages/auth/src/
├── auth.ts                          ✅ Instagram OAuth configured
├── auth-client.ts                   ✅ Client plugin ready
└── instagram.ts                     ✅ Token exchange logic
```

## Environment Variables Needed

Add to `.env`:

```bash
# Instagram OAuth (from Meta App Dashboard)
INSTAGRAM_CLIENT_ID=your_app_id
INSTAGRAM_CLIENT_SECRET=your_app_secret

# Webhook Verification (you create this)
WEBHOOK_VERIFY_TOKEN=vendly_secret_123

# Blob Storage (for media uploads)
BLOB_READ_WRITE_TOKEN=your_vercel_blob_token
```

## Quick Test

### Test OAuth Flow
```typescript
// In your frontend
import { authClient } from '@vendly/auth/client';

await authClient.signIn.oauth2({
  providerId: "instagram",
  callbackURL: "/dashboard",
});
```

### Test Webhook Verification
```bash
# Meta will call this during setup
GET https://yourdomain.com/api/instagram/webhooks
  ?hub.mode=subscribe
  &hub.verify_token=vendly_secret_123
  &hub.challenge=123456

# Your server should respond: 123456
```

## Next Steps (When Ready to Implement)

1. **Uncomment auto-import logic** in `handleNewMedia()` method
2. **Save Instagram connection** to database after OAuth
3. **Subscribe to webhooks** after user connects
4. **Test with real post** on Instagram

## Meta App Dashboard Setup

See detailed instructions in:
- `WEBHOOK_SETUP.md`
- `instagram_oauth_guide.md`

Quick version:
1. Add Webhooks product
2. Configure callback URL
3. Set verify token
4. Subscribe to `media`, `comments`, `mentions`

## Current Flow

```
User Flow:
┌─────────────────────────────────┐
│ 1. User clicks "Connect"        │
│ 2. OAuth window opens           │
│ 3. User approves                │
│ 4. Token saved automatically ✅ │
└─────────────────────────────────┘

Webhook Flow (Ready but commented):
┌──────────────────────────────────┐
│ 1. User posts on Instagram       │
│ 2. Instagram → Your webhook      │
│ 3. Signature verified ✅         │
│ 4. Event logged ✅               │
│ 5. Auto-import (TODO) 📝         │
└──────────────────────────────────┘
```

## What to Uncomment Later

In `instagram-webhook-controller.ts`, line ~115:

```typescript
private async handleNewMedia(instagramUserId: string, mediaData: any) {
  // Remove /* and */ to enable auto-import
  /*
  const connection = await instagramConnectionRepository...
  const media = await instagramMediaService.fetchMediaDetails...
  const product = await productService.createProduct...
  await mediaService.createProductMediaFromUrl...
  */
}
```

---

**Status**: Infrastructure ready, auto-import logic staged for implementation 🚀
