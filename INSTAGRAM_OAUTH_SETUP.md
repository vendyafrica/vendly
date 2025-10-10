# Instagram OAuth2 Login Setup Guide

This guide will help you set up Instagram Login (OAuth2) for your Vendly application using Meta's Instagram Graph API.

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Meta Developer Setup](#meta-developer-setup)
3. [Local Development Setup](#local-development-setup)
4. [Testing the Integration](#testing-the-integration)
5. [Common Issues & Solutions](#common-issues--solutions)
6. [API Endpoints Reference](#api-endpoints-reference)

---

## Prerequisites

Before you begin, ensure you have:

- A Meta (Facebook) Developer account
- An Instagram Business or Creator account
- Node.js (v18+) and pnpm installed
- Your app running locally

---

## Meta Developer Setup

### Step 1: Create a Meta App

1. Go to [Meta Developer Dashboard](https://developers.facebook.com/apps/)
2. Click **"Create App"**
3. Select **"Other"** as the use case
4. Choose **"Business"** as the app type
5. Fill in your app details:
   - **App Name**: Your app name (e.g., "Vendly")
   - **App Contact Email**: Your email
6. Click **"Create App"**

### Step 2: Add Instagram Product

1. In your app dashboard, scroll to **"Add Products"**
2. Find **"Instagram Graph API"** and click **"Set Up"**
3. This will add Instagram capabilities to your app

### Step 3: Configure Instagram Basic Display (Optional)

If you need basic profile access:

1. Go to **Products** → **Instagram** → **Basic Display**
2. Click **"Create New App"**
3. Fill in the required fields

### Step 4: Get Your Credentials

1. Go to **Settings** → **Basic**
2. Copy your **App ID** (this is your `INSTAGRAM_CLIENT_ID`)
3. Copy your **App Secret** (this is your `INSTAGRAM_CLIENT_SECRET`)
4. Add these to your `.env` file

### Step 5: Configure OAuth Redirect URIs

1. In **Instagram** → **Basic Display** settings
2. Under **"Valid OAuth Redirect URIs"**, add:
   ```
   http://localhost:8000/auth/instagram/callback
   ```
3. For production, add your production URL:
   ```
   https://yourdomain.com/auth/instagram/callback
   ```
4. Click **"Save Changes"**

### Step 6: Add Test Users (IMPORTANT for Development Mode)

⚠️ **Your app starts in Development Mode** - only test users can authenticate!

1. Go to **Roles** → **Roles** in the left sidebar
2. Click **"Add Testers"**
3. Search for Instagram accounts and add them as testers
4. The Instagram user must accept the tester invitation:
   - Go to their Instagram app
   - Settings → Apps and Websites → Tester Invites
   - Accept the invitation

### Step 7: Request Permissions (For Production)

For production use, you need to request permissions:

1. Go to **App Review** → **Permissions and Features**
2. Request these permissions:
   - `instagram_business_basic`
   - `instagram_business_manage_messages`
   - `instagram_business_manage_comments`
   - `instagram_business_content_publishing`
3. Submit for review with required documentation

---

## Local Development Setup

### Step 1: Install Dependencies

```bash
# Install backend dependencies
pnpm add axios dotenv --filter @vendly/api
```

### Step 2: Configure Environment Variables

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Update your `.env` file with your Instagram credentials:
   ```env
   # Instagram OAuth Providers
   INSTAGRAM_CLIENT_ID="your_app_id_here"
   INSTAGRAM_CLIENT_SECRET="your_app_secret_here"
   INSTAGRAM_REDIRECT_URI="http://localhost:8000/auth/instagram/callback"
   ```

### Step 3: Start the Development Servers

```bash
# Start both frontend and backend
pnpm dev

# Or start them separately:
# Terminal 1 - Backend (port 8000)
cd apps/api
pnpm dev

# Terminal 2 - Frontend (port 3000)
cd apps/web
pnpm dev
```

---

## Testing the Integration

### Step 1: Access the Login Page

1. Open your browser and navigate to:
   ```
   http://localhost:3000/login
   ```

2. You should see the login page with both Google and Instagram buttons

### Step 2: Test Instagram Login

1. Click **"Sign in with Instagram"**
2. You'll be redirected to Instagram's authorization page
3. Log in with a test user account (must be added as tester in Meta Dashboard)
4. Grant the requested permissions
5. You'll be redirected back to your app

### Step 3: Verify Authentication

After successful login, you can test the API endpoints:

1. **Check authentication status:**
   ```bash
   curl http://localhost:8000/auth/status
   ```

2. **Get user profile:**
   ```bash
   curl http://localhost:8000/me
   ```

   Expected response:
   ```json
   {
     "success": true,
     "profile": {
       "id": "instagram_user_id",
       "username": "instagram_username",
       "account_type": "BUSINESS",
       "media_count": 42
     }
   }
   ```

---

## Common Issues & Solutions

### Issue 1: "Insufficient Developer Role"

**Error Message:**
```
The user must be an administrator, developer, or tester for the app
```

**Solution:**
1. Go to Meta Developer Dashboard → **Roles** → **Roles**
2. Add the Instagram account as a **Tester**
3. The user must accept the invitation in their Instagram app
4. Wait a few minutes for changes to propagate

### Issue 2: "Invalid OAuth Redirect URI"

**Error Message:**
```
redirect_uri is not valid
```

**Solution:**
1. Verify the redirect URI in your `.env` matches exactly what's in Meta Dashboard
2. Check for trailing slashes (they matter!)
3. Ensure you've saved changes in Meta Dashboard
4. Try using the exact format: `http://localhost:8000/auth/instagram/callback`

### Issue 3: "Invalid Client Secret"

**Error Message:**
```
Invalid client_secret parameter
```

**Solution:**
1. Regenerate your App Secret in Meta Dashboard
2. Update your `.env` file with the new secret
3. Restart your backend server

### Issue 4: Token Exchange Fails

**Error Message:**
```
Error validating verification code
```

**Solution:**
1. The authorization code expires quickly (60 seconds)
2. Don't refresh the callback page
3. Ensure your system clock is synchronized
4. Check that your backend is running and accessible

### Issue 5: App in Development Mode

**Limitation:**
Only test users can authenticate when app is in Development Mode.

**Solution:**
- For testing: Add users as testers (see Step 6 above)
- For production: Submit your app for App Review

### Issue 6: CORS Errors

**Error Message:**
```
Access to fetch has been blocked by CORS policy
```

**Solution:**
1. Ensure CORS is properly configured in [`apps/api/src/index.ts`](apps/api/src/index.ts:11)
2. Verify `WEB_URL` in `.env` matches your frontend URL
3. Restart the backend server

---

## API Endpoints Reference

### Backend Endpoints

#### 1. Initiate Instagram Login
```
GET http://localhost:8000/auth/instagram
```
Redirects user to Instagram authorization page.

#### 2. OAuth Callback (Automatic)
```
GET http://localhost:8000/auth/instagram/callback?code={auth_code}
```
Handles the OAuth callback, exchanges code for tokens.

**Response:**
```json
{
  "success": true,
  "message": "Instagram authentication successful",
  "data": {
    "userId": "instagram_user_id",
    "expiresIn": 5183944,
    "tokenObtained": true
  }
}
```

#### 3. Get User Profile
```
GET http://localhost:8000/me
```
Fetches authenticated user's Instagram profile.

**Response:**
```json
{
  "success": true,
  "profile": {
    "id": "instagram_user_id",
    "username": "username",
    "account_type": "BUSINESS",
    "media_count": 42
  }
}
```

#### 4. Check Auth Status
```
GET http://localhost:8000/auth/status
```
Checks if user is authenticated.

**Response:**
```json
{
  "authenticated": true,
  "userId": "instagram_user_id",
  "tokenExpiry": "2025-12-10T15:30:00.000Z"
}
```

---

## OAuth Flow Diagram

```
┌─────────┐                                    ┌──────────┐
│ User    │                                    │Instagram │
│ Browser │                                    │  OAuth   │
└────┬────┘                                    └────┬─────┘
     │                                              │
     │  1. Click "Login with Instagram"            │
     ├──────────────────────────────────────►      │
     │     GET /auth/instagram                     │
     │                                              │
     │  2. Redirect to Instagram                   │
     │◄─────────────────────────────────────       │
     │                                              │
     │  3. User authorizes app                     │
     ├─────────────────────────────────────────────►
     │                                              │
     │  4. Redirect with auth code                 │
     │◄─────────────────────────────────────────────┤
     │     ?code=AUTH_CODE                          │
     │                                              │
     │  5. Backend exchanges code for token        │
     │     POST /oauth/access_token                │
     ├─────────────────────────────────────────────►
     │                                              │
     │  6. Returns short-lived token               │
     │◄─────────────────────────────────────────────┤
     │                                              │
     │  7. Exchange for long-lived token           │
     │     GET /access_token?grant_type=ig_exchange│
     ├─────────────────────────────────────────────►
     │                                              │
     │  8. Returns long-lived token (60 days)      │
     │◄─────────────────────────────────────────────┤
     │                                              │
     │  9. Success response                        │
     │◄─────────────────────────────────────       │
     │                                              │
```

---

## Security Best Practices

1. **Never commit `.env` file** - It contains sensitive credentials
2. **Use environment variables** - Never hardcode credentials
3. **Validate redirect URIs** - Only allow whitelisted URIs
4. **Store tokens securely** - Use encrypted database storage in production
5. **Implement token refresh** - Long-lived tokens expire after 60 days
6. **Use HTTPS in production** - Never use HTTP for OAuth in production
7. **Implement CSRF protection** - Use state parameter in OAuth flow

---

## Production Checklist

Before deploying to production:

- [ ] Submit app for App Review in Meta Dashboard
- [ ] Request required Instagram permissions
- [ ] Update redirect URIs to production URLs
- [ ] Use HTTPS for all OAuth endpoints
- [ ] Implement proper token storage (database)
- [ ] Add token refresh mechanism
- [ ] Implement error logging and monitoring
- [ ] Add rate limiting to API endpoints
- [ ] Set up proper CORS configuration
- [ ] Test with multiple Instagram account types

---

## Additional Resources

- [Instagram Graph API Documentation](https://developers.facebook.com/docs/instagram-api)
- [Instagram Login Documentation](https://developers.facebook.com/docs/instagram-basic-display-api/getting-started)
- [OAuth 2.0 Authorization Framework](https://oauth.net/2/)
- [Meta App Review Process](https://developers.facebook.com/docs/app-review)

---

## Support

If you encounter issues:

1. Check the [Common Issues](#common-issues--solutions) section
2. Review Meta Developer Dashboard logs
3. Check browser console for errors
4. Review backend server logs
5. Verify all environment variables are set correctly

---

## File Structure

```
vendly/
├── apps/
│   ├── api/
│   │   └── src/
│   │       ├── index.ts                    # Main server file
│   │       └── routes/
│   │           └── instagram.routes.ts     # Instagram OAuth routes
│   └── web/
│       └── src/
│           └── app/
│               ├── login/
│               │   └── page.tsx            # Login page
│               └── instagram/
│                   └── callback/
│                       └── page.tsx        # OAuth callback handler
├── .env                                     # Environment variables (DO NOT COMMIT)
├── .env.example                            # Example environment file
└── INSTAGRAM_OAUTH_SETUP.md               # This file
```

---

**Last Updated:** 2025-10-10

**Version:** 1.0.0