# Custom Admin Signup & Email Verification Flow

## Overview
The admin app now uses a **custom signup and email verification system** that is independent of Better Auth's default flow. This provides full control over the admin registration process and ensures proper super_admin role assignment.

## Complete Flow

### 1. User Signs Up (`/sign-up`)
**Endpoint**: `POST /api/admin-signup`

1. User fills in:
   - Full Name
   - Email  
   - Password

2. Backend process:
   - Validates input
   - Checks if user already exists (returns 422 if exists)
   - Hashes password using Better Auth's hash utility
   - Creates user in `users` table with `emailVerified: false`
   - Creates account in `account` table with hashed password
   - Generates verification token (32-byte random hex)
   - Stores token in `verification` table (expires in 24 hours)
   - Sends **custom admin verification email** using `AdminVerificationEmail` template
   - Returns success message

3. User is redirected to `/login?message=verify-email`

### 2. Email Verification
**Endpoint**: `GET /api/verify-email?token=xxx&email=xxx`

1. User receives email from `Vendly Admin <admin@vendlyafrica.store>`
2. Email contains:
   - Professional admin-themed design
   - Clear explanation of super admin access
   - "Verify Email & Access Dashboard" button
3. User clicks verification link
4. Backend process:
   - Validates token and email
   - Checks token expiration (24 hours)
   - Updates user: `emailVerified: true`
   - **Automatically assigns `super_admin` role** in `platform_roles` table
   - Deletes verification token
   - Redirects to `/login?message=email-verified`

### 3. Login (`/login`)
1. User sees success message: "Email verified successfully! You can now sign in."
2. User signs in with:
   - Email & Password (via Better Auth)
   - Google OAuth
3. On successful login:
   - Session cookie is set
   - User is redirected to `/` (dashboard)

### 4. Dashboard Access (`/`)
1. `proxy.ts` middleware checks for session token
2. `(super-admin)/layout.tsx` verifies `super_admin` role
3. Dashboard is rendered

## Key Implementation Files

### API Endpoints
- **`apps/admin/src/app/api/admin-signup/route.ts`**: Custom signup endpoint
- **`apps/admin/src/app/api/verify-email/route.ts`**: Custom email verification endpoint

### Email Templates
- **`packages/transactional/emails/admin-verification.tsx`**: Custom admin verification email
- **`packages/transactional/email.ts`**: Added `sendAdminVerificationEmail()` function

### Frontend Components
- **`apps/admin/src/app/(auth)/components/signup-form.tsx`**: Uses `/api/admin-signup`
- **`apps/admin/src/app/(auth)/components/login-form.tsx`**: Displays verification messages

## Database Tables Used

### `users`
- Stores user information
- `emailVerified` field tracks verification status

### `account`
- Stores authentication credentials
- `providerId: "credential"` for email/password
- `password` field contains hashed password

### `verification`
- Stores verification tokens
- `identifier`: email address
- `value`: verification token
- `expiresAt`: token expiration (24 hours)

### `platform_roles`
- Stores user roles
- `role: "super_admin"` assigned after verification

## Email Configuration

### Sender
- **From**: `Vendly Admin <admin@vendlyafrica.store>`
- **Subject**: "Verify your Vendly Admin account"

### Template Features
- Professional blue/white design
- Clear call-to-action button
- Explanation of super admin access
- Footer with security note

## Error Handling

### Signup Errors
- **400**: Missing required fields
- **422**: User already exists
- **500**: Server error

### Verification Errors
All redirect to `/login` with error parameter:
- `invalid-verification-link`: Missing token or email
- `invalid-or-expired-token`: Token not found in database
- `token-expired`: Token past 24-hour expiration
- `user-not-found`: Email doesn't match any user
- `verification-failed`: General verification error

### Success Messages
- `verify-email`: Account created, check email
- `email-verified`: Email verified, can now sign in

## Security Features

1. **Password Hashing**: Uses Better Auth's hash utility
2. **Token Expiration**: Verification tokens expire in 24 hours
3. **One-Time Tokens**: Tokens deleted after successful verification
4. **Email Verification Required**: Cannot sign in without verification
5. **Automatic Role Assignment**: Server-side role assignment (not client-side)

## Testing the Flow

1. **Start the admin app**:
   ```bash
   cd apps/admin
   pnpm dev
   ```

2. **Sign up**:
   - Navigate to `http://localhost:4000`
   - Click "Sign up"
   - Fill in your details
   - Submit the form

3. **Check email**:
   - Look for email from "Vendly Admin"
   - Click "Verify Email & Access Dashboard" button

4. **Sign in**:
   - You'll be redirected to login with success message
   - Sign in with your email and password
   - Access the dashboard!

## Troubleshooting

### Email Not Received
- Check spam folder
- Verify `RESEND_API_KEY` in `.env`
- Check Resend dashboard for delivery logs
- Ensure sender domain is verified in Resend

### Verification Link Not Working
- Check if token is expired (24 hours)
- Verify URL format: `/api/verify-email?token=xxx&email=xxx`
- Check server logs for error messages

### Cannot Sign In After Verification
- Verify `emailVerified` is `true` in `users` table
- Check `account` table has entry with `providerId: "credential"`
- Verify `platform_roles` table has `super_admin` role for user

### Role Not Assigned
- Check server logs for "Assigned super_admin role" message
- Verify `platform_roles` table in database
- Ensure verification endpoint completed successfully

## Production Considerations

1. **Email Sender**: Update sender domain to production domain
2. **Verification URL**: Ensure `NEXT_PUBLIC_APP_URL` is set to production URL
3. **Token Expiration**: Consider adjusting 24-hour expiration if needed
4. **Rate Limiting**: Add rate limiting to signup endpoint
5. **Invite-Only**: Consider implementing invite system instead of open signup
6. **Email Templates**: Customize branding and copy for your organization
