# Instagram Webhook Setup Instructions

## Overview
Webhook endpoints are now ready for Instagram integration. The auto-import logic is commented out and will be implemented later.

## Endpoints Created

### 1. Verification Endpoint
**GET** `/api/instagram/webhooks`

Used by Meta to verify your server during webhook setup.

### 2. Event Handler Endpoint  
**POST** `/api/instagram/webhooks`

Receives webhook events from Instagram when:
- User posts new media
- User receives comments
- User is @mentioned

## Meta App Dashboard Configuration

### Step 1: Add Webhooks Product
1. Go to [Meta App Dashboard](https://developers.facebook.com/apps)
2. Select your app
3. Click **Add Product** → **Webhooks**

### Step 2: Configure Instagram Webhooks
1. Click on **Instagram** in Webhooks settings
2. Click **Edit Subscription**
3. Fill in:
   - **Callback URL**: `https://yourdomain.com/api/instagram/webhooks`
   - **Verify Token**: Create a random string (e.g., `vendly_webhook_secret_123`)
4. Click **Verify and Save**

### Step 3: Environment Variable
Add to your `.env` file:

```bash
WEBHOOK_VERIFY_TOKEN=vendly_webhook_secret_123
```

(Use the same token you entered in Meta Dashboard)

### Step 4: Subscribe to Fields
After verification succeeds, subscribe to these fields:
- ✅ **media** - New posts
- ✅ **comments** - Comments on posts
- ✅ **mentions** - @mentions

## Testing Webhooks

### Test from Meta Dashboard
1. In Webhooks settings, find "media" field
2. Click **Test** button
3. Click **Send to My Server**
4. Check your server logs for: `✅ Webhook verified successfully`

### Test with Real Instagram Post
1. Connect Instagram account via OAuth
2. Post a photo on Instagram
3. Check server logs for: `🎨 New media event`

## What's Implemented

✅ **Webhook verification** - Responds to Meta's verification requests  
✅ **Signature validation** - Verifies requests are from Instagram  
✅ **Event routing** - Routes events to appropriate handlers  
✅ **Logging** - Comprehensive logging for debugging  

## What's NOT Implemented (Commented Out)

❌ Auto-import logic  
❌ Product creation from Instagram posts  
❌ Media download and attachment  
❌ Comment handling  
❌ Mention handling  

## File Locations

- **Webhook Controller**: `apps/api/src/modules/instagram/instagram-webhook-controller.ts`
- **Routes**: `apps/api/src/modules/instagram/instagram-routes.ts`
- **Auth Config**: `packages/auth/src/auth.ts` (OAuth already configured)

## Next Steps

When ready to implement auto-import:

1. Uncomment the logic in `handleNewMedia()` method
2. Ensure Instagram connection is saved to database after OAuth
3. Test with real Instagram post
4. Handle edge cases (videos, carousels, errors)

## Troubleshooting

**Verification fails:**
- Check `WEBHOOK_VERIFY_TOKEN` matches Meta Dashboard
- Ensure server is accessible publicly (use ngrok for local dev)

**Events not received:**
- Check webhook subscription is active
- Verify signature validation is passing
- Check Instagram account is subscribed to webhook fields

**500 errors:**
- Check environment variables are set
- Review server logs for detailed errors
