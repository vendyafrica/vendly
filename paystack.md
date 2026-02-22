pa# Paystack Payments — Developer Skill Reference

A concise reference for integrating Paystack payments across web, mobile, and server-side contexts.

---

## 1. Accepting Payments

### Three Integration Methods

| Method | Best For |
|---|---|
| **Popup (InlineJS)** | Web apps — seamless in-page checkout |
| **Redirect** | Server-rendered apps — redirect to Paystack checkout |
| **Charge API** | Custom flows, mobile money, USSD, direct bank |

---

### Popup (InlineJS)

**Install**
```bash
npm i @paystack/inline-js
```

```js
import PaystackPop from '@paystack/inline-js'
```

**3-Step Flow**

**Step 1 — Initialize transaction (backend)**
```bash
curl https://api.paystack.co/transaction/initialize \
  -H "Authorization: Bearer YOUR_SECRET_KEY" \
  -H "Content-Type: application/json" \
  -d '{ "email": "customer@email.com", "amount": "500000" }' \
  -X POST
```
> Returns `access_code` — send this to your frontend.

**Step 2 — Complete transaction (frontend)**
```js
const popup = new PaystackPop()
popup.resumeTransaction(access_code)
```

**Step 3 — Verify transaction (backend)**

Check `data.status` and `data.amount` via webhook or the Verify API before delivering value.

---

### Redirect Method

1. POST to `/transaction/initialize` with `callback_url`
2. Redirect customer to returned `authorization_url`
3. Paystack redirects back to `callback_url?reference=YOUR_REFERENCE`
4. Call `/transaction/verify/:reference` to confirm status

```php
$fields = [
  'email'        => 'customer@email.com',
  'amount'       => '20000',
  'callback_url' => 'https://yoursite.com/callback',
  'metadata'     => ['cancel_action' => 'https://yoursite.com/cancel']
];
```

---

### React Integration

```bash
yarn add react-paystack
```

```jsx
import { PaystackButton } from 'react-paystack'

const componentProps = {
  email,
  amount,        // in kobo (multiply NGN by 100)
  publicKey,     // use PUBLIC key on client
  text: 'Pay Now',
  metadata: { name, phone },
  onSuccess: () => console.log('Payment successful'),
  onClose: () => console.log('Payment cancelled'),
}

<PaystackButton {...componentProps} />
```

> **Never use your secret key on the client side.** Use your public key (`pk_...`) for all frontend integrations.

---

## 2. Payment Channels (Charge API)

### Endpoint
```
POST https://api.paystack.co/charge
```
Authorization: `Bearer YOUR_SECRET_KEY`

### Cards
```json
{ "email": "...", "amount": 10000, "card": { ... } }
```
> Requires PCI-DSS compliance (AOC from a QSA). Available in all markets.

### Mobile Money (Ghana, Kenya, Côte d'Ivoire)
```json
{
  "email": "customer@email.com",
  "amount": 100,
  "currency": "GHS",
  "mobile_money": { "phone": "0551234987", "provider": "mtn" }
}
```

**Provider codes:**

| Provider | Code | Country |
|---|---|---|
| MTN | `mtn` | Ghana, CIV |
| AT/Airtel | `atl` | Ghana, Kenya |
| Telecel | `vod` | Ghana |
| M-PESA | `mpesa` | Kenya |
| Orange | `orange` | CIV |
| Wave | `wave` | CIV |

### USSD (Nigeria only)
```json
{
  "email": "...", "amount": 10000,
  "ussd": { "type": "737" }
}
```
> GTBank = type `737`. Listen for `charge.success` webhook.

### Bank Accounts (Nigeria only)
```json
{
  "email": "...", "amount": 10000,
  "bank": { "code": "057", "account_number": "0000000000" }
}
```

### Pay with Transfer / Pesalink
```json
{
  "email": "...", "amount": 10000,
  "bank_transfer": { "account_expires_at": "2025-04-24T16:40:57.954Z" }
}
```
- Nigeria: max 8 hours expiry, min 15 min
- Kenya (Pesalink): max 25 minutes

### QR Code (South Africa only)
```json
{
  "email": "...", "amount": 1000, "currency": "ZAR",
  "qr": { "provider": "scan-to-pay" }
}
```

### EFT (South Africa only)
```json
{
  "email": "...", "amount": 5000, "currency": "ZAR",
  "eft": { "provider": "ozow" }
}
```

---

### Charge API Response Statuses

| Status | Action |
|---|---|
| `pending` | Poll `/charge/check/:reference` after 10s |
| `send_otp` | Collect OTP from customer → POST to Submit OTP endpoint |
| `send_birthday` | Collect DOB → POST to Submit Birthday endpoint |
| `success` | Deliver value |
| `failed` | Show error, start a new charge |
| `timeout` | Transaction failed, start a new charge |

---

## 3. Verifying Transactions

```bash
curl https://api.paystack.co/transaction/verify/:reference \
  -H "Authorization: Bearer YOUR_SECRET_KEY" \
  -X GET
```

**Always check:**
- `response.data.status === 'success'`
- `response.data.amount` matches expected amount

> `response.status` is the API call status — not the transaction status.

### Transaction Statuses

| Status | Meaning |
|---|---|
| `success` | Payment completed |
| `abandoned` | Customer didn't complete |
| `failed` | Transaction failed |
| `pending` / `processing` | In progress |
| `reversed` | Refunded or chargeback |
| `ongoing` | Awaiting customer action (OTP, transfer) |

---

## 4. Webhooks

### Setup
```js
// Express example
app.post('/my/webhook/url', (req, res) => {
  const hash = crypto
    .createHmac('sha512', process.env.SECRET_KEY)
    .update(JSON.stringify(req.body))
    .digest('hex')

  if (hash === req.headers['x-paystack-signature']) {
    const event = req.body
    // process event
  }
  res.sendStatus(200)
})
```

> Always return `200 OK` immediately. Move long-running tasks to a background queue.

### Retry Policy
- **Live:** Every 3 min for 4 tries, then hourly for 72 hours
- **Test:** Hourly for 10 hours (30s timeout per attempt)

### Whitelist IPs (alternative to signature validation)
```
52.31.139.75
52.49.173.169
52.214.14.220
```

### Key Events

| Event | Description |
|---|---|
| `charge.success` | Payment successful |
| `transfer.success` | Transfer completed |
| `transfer.failed` | Transfer failed |
| `refund.processed` | Refund done |
| `subscription.create` | Subscription created |
| `invoice.payment_failed` | Invoice payment failed |
| `customeridentification.success/failed` | ID verification result |
| `dedicatedaccount.assign.success/failed` | DVA assignment result |

---

## 5. Recurring Charges

**Flow:**
1. Customer makes first payment (triggers card tokenization)
2. Store `authorization_code` + `email` from the webhook/verify response
3. Use `reusable: true` authorizations only

```bash
curl https://api.paystack.co/transaction/charge_authorization \
  -H "Authorization: Bearer YOUR_SECRET_KEY" \
  -H "Content-Type: application/json" \
  -d '{ "authorization_code": "AUTH_xxx", "email": "user@email.com", "amount": 300000 }' \
  -X POST
```

**Minimum first-charge amounts:**

| Currency | Minimum |
|---|---|
| NGN | ₦50.00 |
| GHS | GH₵0.10 |
| ZAR | R1.00 |
| KES | KES 3.00 |
| USD | $2.00 |

### 2FA / Card Challenge
If `data.paused === true` in the response, redirect customer to `data.authorization_url` for authentication.

---

## 6. Mobile SDKs

### Android (Kotlin)
```kotlin
Paystack.builder().setPublicKey("pk_test_xxxx").build()
paymentSheet = PaymentSheet(this, ::paymentComplete)
paymentSheet.launch("YOUR_ACCESS_CODE")
```

### iOS (SwiftUI)
```swift
let paystack = try? PaystackBuilder.newInstance.setKey("pk_domain_xxx").build()
paystack?.chargeUIButton(accessCode: "YOUR_ACCESS_CODE", onComplete: paymentDone) {
  Text("Pay Now")
}
```

> Initialize the transaction on your server first to get the `access_code`, then pass it to the SDK.

---

## 7. Key Rules & Best Practices

- **Secret keys** (`sk_...`) → server only, never client/mobile
- **Public keys** (`pk_...`) → client/mobile safe
- Amounts are always in the **smallest currency unit** (kobo, pesewas, cents)
- Always **verify transaction amount** before delivering value
- Use **webhooks** as the primary method to confirm payment (not just callback URL visits)
- Store the **entire authorization object** for recurring charges, including the email used
- Check `reusable: true` before attempting recurring charges
- Avoid double fulfillment — check if value was already delivered before processing webhook events