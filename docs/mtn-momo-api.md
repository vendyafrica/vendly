---
name: mtn-momo-api
description: Complete guide for integrating MTN Mobile Money (MoMo) API for payment processing in Africa. Use this skill when implementing MTN MoMo payment integration, processing mobile money transactions, handling Collections (request to pay), Disbursements (transfers, deposits), or when working with MTN's sandbox/production environments. Covers authentication (OAuth 2.0, API user/key management), all payment operations (request-to-pay, transfers, deposits, withdrawals), transaction status checking, webhooks/callbacks, error handling, and sandbox testing with predefined test scenarios.
---

# MTN MoMo API Integration

Complete implementation guide for MTN Mobile Money API integration covering Collections and Disbursements.

## Authentication

### Overview

MTN MoMo API uses two-tier authentication:
1. **Subscription Key** - API Manager access (in request header as `Ocp-Apim-Subscription-Key`)
2. **OAuth 2.0** - Wallet system access using API User and API Key

### Sandbox: API User and Key Provisioning

**Step 1: Create API User**

```bash
# Generate UUID for API User
X_REFERENCE_ID=$(uuidgen)

# Create API user
curl -X POST https://sandbox.momodeveloper.mtn.com/v1_0/apiuser \
  -H "X-Reference-Id: $X_REFERENCE_ID" \
  -H "Ocp-Apim-Subscription-Key: YOUR_SUBSCRIPTION_KEY" \
  -H "Content-Type: application/json" \
  -d '{"providerCallbackHost": "your-domain.com"}'

# Response: 201 Created
```

**Step 2: Create API Key**

```bash
# Create API key for the user
curl -X POST https://sandbox.momodeveloper.mtn.com/v1_0/apiuser/$X_REFERENCE_ID/apikey \
  -H "Ocp-Apim-Subscription-Key: YOUR_SUBSCRIPTION_KEY"

# Response: 201 Created
# {"apiKey": "f1db798c98df4bcf83b538175893bbf0"}
```

**Step 3: Verify API User**

```bash
curl -X GET https://sandbox.momodeveloper.mtn.com/v1_0/apiuser/$X_REFERENCE_ID \
  -H "Ocp-Apim-Subscription-Key: YOUR_SUBSCRIPTION_KEY"

# Response: 200 OK
# {
#   "providerCallbackHost": "your-domain.com",
#   "targetEnvironment": "sandbox"
# }
```

### Production: Use Partner Portal

In production, manage API Users and Keys through the MTN Partner Portal (not via API).

### Obtaining Access Token

**Basic Access Token (Collection/Disbursement)**

```bash
# Encode API User:API Key as Base64
AUTH=$(echo -n "$API_USER:$API_KEY" | base64)

# Get access token
curl -X POST https://sandbox.momodeveloper.mtn.com/collection/token/ \
  -H "Authorization: Basic $AUTH" \
  -H "Ocp-Apim-Subscription-Key: YOUR_SUBSCRIPTION_KEY"

# Response:
# {
#   "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
#   "token_type": "access_token",
#   "expires_in": 3600
# }
```

**OAuth2 Token (with Consent Management)**

```bash
curl -X POST https://sandbox.momodeveloper.mtn.com/collection/oauth2/token/ \
  -H "Authorization: Basic $AUTH" \
  -H "X-Target-Environment: sandbox" \
  -H "Ocp-Apim-Subscription-Key: YOUR_SUBSCRIPTION_KEY"

# Response includes refresh_token for consent-based operations
```

Token validity: **3600 seconds (1 hour)**. Reuse tokens until expiration.

## Collections API

### Request to Pay

Request payment from a customer (payer). Transaction remains PENDING until customer approves/rejects.

```bash
# Generate unique reference ID
REFERENCE_ID=$(uuidgen)

curl -X POST https://sandbox.momodeveloper.mtn.com/collection/v1_0/requesttopay \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "X-Reference-Id: $REFERENCE_ID" \
  -H "X-Target-Environment: sandbox" \
  -H "X-Callback-Url: https://your-domain.com/callback" \
  -H "Ocp-Apim-Subscription-Key: YOUR_SUBSCRIPTION_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": "100",
    "currency": "EUR",
    "externalId": "ORDER123",
    "payer": {
      "partyIdType": "MSISDN",
      "partyId": "256772123456"
    },
    "payerMessage": "Payment for order #123",
    "payeeNote": "Customer payment received"
  }'

# Response: 202 Accepted
```

**Party Types:**
- `MSISDN` - Mobile number (ITU-T E.164 format)
- `EMAIL` - Valid email address
- `PARTY_CODE` - UUID of the party

**Check Transaction Status:**

```bash
curl -X GET https://sandbox.momodeveloper.mtn.com/collection/v1_0/requesttopay/$REFERENCE_ID \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "X-Target-Environment: sandbox" \
  -H "Ocp-Apim-Subscription-Key: YOUR_SUBSCRIPTION_KEY"

# Response:
# {
#   "amount": "100",
#   "currency": "EUR",
#   "financialTransactionId": "23503452",
#   "externalId": "ORDER123",
#   "payer": {"partyIdType": "MSISDN", "partyId": "256772123456"},
#   "status": "SUCCESSFUL",
#   "reason": {}
# }
```

**Status Values:**
- `PENDING` - Awaiting customer approval
- `SUCCESSFUL` - Payment completed
- `FAILED` - Payment failed

### Delivery Notification

Send additional SMS/email notification after successful transaction:

```bash
curl -X POST https://sandbox.momodeveloper.mtn.com/collection/v1_0/requesttopay/$REFERENCE_ID/deliverynotification \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "X-Target-Environment: sandbox" \
  -H "notificationMessage: Your order #123 will arrive tomorrow" \
  -H "Language: en" \
  -H "Ocp-Apim-Subscription-Key: YOUR_SUBSCRIPTION_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "notificationMessage": "Your order #123 will arrive tomorrow"
  }'

# Response: 200 OK
```

**Constraints:**
- Max 160 characters
- Only after successful transaction
- Time-limited window (configured in PGW)

### Payments (Bill Payments/Airtime)

Pay external bills or top-up airtime via partner gateway:

```bash
curl -X POST https://sandbox.momodeveloper.mtn.com/collection/v2_0/payment \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "X-Reference-Id: $(uuidgen)" \
  -H "X-Target-Environment: sandbox" \
  -H "X-Callback-Url: https://your-domain.com/callback" \
  -H "Ocp-Apim-Subscription-Key: YOUR_SUBSCRIPTION_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "externalTransactionId": "TXN456",
    "money": {
      "amount": "50",
      "currency": "EUR"
    },
    "customerReference": "256772123456",
    "serviceProviderUserName": "ElectricityProvider",
    "receiverMessage": "Bill payment received",
    "senderNote": "Electricity bill for Jan 2026"
  }'

# Response: 202 Accepted
```

**Check Payment Status:**

```bash
curl -X GET https://sandbox.momodeveloper.mtn.com/collection/v2_0/payment/$REFERENCE_ID \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "X-Target-Environment: sandbox" \
  -H "Ocp-Apim-Subscription-Key: YOUR_SUBSCRIPTION_KEY"
```

## Disbursements API

### Transfer

Transfer funds from provider account to customer account:

```bash
curl -X POST https://sandbox.momodeveloper.mtn.com/disbursement/v1_0/transfer \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "X-Reference-Id: $(uuidgen)" \
  -H "X-Target-Environment: sandbox" \
  -H "X-Callback-Url: https://your-domain.com/callback" \
  -H "Ocp-Apim-Subscription-Key: YOUR_SUBSCRIPTION_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": "200",
    "currency": "EUR",
    "externalId": "PAYOUT789",
    "payee": {
      "partyIdType": "MSISDN",
      "partyId": "256772987654"
    },
    "payerMessage": "Salary payment",
    "payeeNote": "January 2026 salary"
  }'

# Response: 202 Accepted
```

**Check Transfer Status:**

```bash
curl -X GET https://sandbox.momodeveloper.mtn.com/disbursement/v1_0/transfer/$REFERENCE_ID \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "X-Target-Environment: sandbox" \
  -H "Ocp-Apim-Subscription-Key: YOUR_SUBSCRIPTION_KEY"
```

### Deposit

Deposit funds from provider account to payee account:

**V1 (POST callback):**

```bash
curl -X POST https://sandbox.momodeveloper.mtn.com/disbursement/v1_0/deposit \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "X-Reference-Id: $(uuidgen)" \
  -H "X-Target-Environment: sandbox" \
  -H "X-Callback-Url: https://your-domain.com/callback" \
  -H "Ocp-Apim-Subscription-Key: YOUR_SUBSCRIPTION_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": "150",
    "currency": "EUR",
    "externalId": "DEP001",
    "payee": {
      "partyIdType": "MSISDN",
      "partyId": "256772111222"
    },
    "payerMessage": "Refund deposit",
    "payeeNote": "Order cancellation refund"
  }'
```

**V2 (PUT callback):**

```bash
curl -X POST https://sandbox.momodeveloper.mtn.com/disbursement/v2_0/deposit \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "X-Reference-Id: $(uuidgen)" \
  -H "X-Target-Environment: sandbox" \
  -H "X-Callback-Url: https://your-domain.com/callback" \
  -H "Ocp-Apim-Subscription-Key: YOUR_SUBSCRIPTION_KEY" \
  -H "Content-Type: application/json" \
  -d '{ ... }'
```

**Difference:** V1 uses POST for callbacks, V2 uses PUT.

### Account Validation

Verify customer is active and can receive funds:

```bash
# Validate MSISDN
curl -X GET "https://sandbox.momodeveloper.mtn.com/collection/v1_0/accountholder/msisdn/256772123456/active" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "X-Target-Environment: sandbox" \
  -H "Ocp-Apim-Subscription-Key: YOUR_SUBSCRIPTION_KEY"

# Validate Email
curl -X GET "https://sandbox.momodeveloper.mtn.com/collection/v1_0/accountholder/email/user@example.com/active" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "X-Target-Environment: sandbox" \
  -H "Ocp-Apim-Subscription-Key: YOUR_SUBSCRIPTION_KEY"

# Response: 200 OK (active) or 404 Not Found
```

### Check Balance

Get balance of provider's default account:

```bash
curl -X GET https://sandbox.momodeveloper.mtn.com/collection/v1_0/account/balance \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "X-Target-Environment: sandbox" \
  -H "Ocp-Apim-Subscription-Key: YOUR_SUBSCRIPTION_KEY"

# Response:
# {
#   "availableBalance": "1000",
#   "currency": "EUR"
# }
```

## Callbacks/Webhooks

### Callback Flow

When `X-Callback-Url` header is provided in POST request:
1. MTN processes transaction asynchronously
2. Once transaction reaches final state (SUCCESSFUL/FAILED), MTN sends callback
3. **One attempt only** - no retries
4. Use GET endpoint to check status if callback not received

### V1 vs V2 Callbacks

- **V1 APIs** - Callback sent via POST to your URL
- **V2 APIs** - Callback sent via PUT to your URL

### Callback Payload

```json
{
  "financialTransactionId": "23503452",
  "externalId": "ORDER123",
  "amount": "100",
  "currency": "EUR",
  "payer": {
    "partyIdType": "MSISDN",
    "partyId": "256772123456"
  },
  "status": "SUCCESSFUL",
  "reason": {}
}
```

### Implementing Callback Handler

```python
from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/callback', methods=['POST', 'PUT'])
def momo_callback():
    data = request.get_json()
    
    reference_id = request.headers.get('X-Reference-Id')
    status = data.get('status')
    
    # Process based on status
    if status == 'SUCCESSFUL':
        # Update order status, send confirmation
        process_successful_payment(data)
    elif status == 'FAILED':
        # Handle failure, notify customer
        process_failed_payment(data)
    
    return jsonify({"message": "Callback received"}), 200
```

## Error Handling

### Common HTTP Status Codes

- `202 Accepted` - Request received and processing
- `400 Bad Request` - Invalid data format
- `401 Unauthorized` - Invalid/expired token
- `404 Not Found` - Resource not found
- `409 Conflict` - Duplicate reference ID
- `500 Internal Server Error` - Server error

### Error Response Format

```json
{
  "code": "PAYER_NOT_FOUND",
  "message": "Payer not found"
}
```

### Common Error Codes

**Request to Pay:**
- `PAYER_NOT_FOUND` - Customer account doesn't exist
- `PAYEE_NOT_ALLOWED_TO_RECEIVE` - Recipient blocked from receiving
- `INVALID_CURRENCY` - Unsupported currency
- `TRANSACTION_EXPIRED` - Request timed out
- `TRANSACTION_REJECTED` - Customer declined payment

**Transfers/Deposits:**
- `PAYEE_NOT_FOUND` - Recipient account doesn't exist
- `NOT_ENOUGH_FUNDS` - Insufficient balance
- `PAYER_LIMIT_REACHED` - Daily/transaction limit exceeded
- `INCORRECT_CURRENCY` - Wrong currency for environment

### Retry Logic

```python
import time
import requests

def request_payment_with_retry(data, max_retries=3):
    for attempt in range(max_retries):
        try:
            reference_id = generate_uuid()
            response = requests.post(
                'https://sandbox.momodeveloper.mtn.com/collection/v1_0/requesttopay',
                headers={
                    'Authorization': f'Bearer {access_token}',
                    'X-Reference-Id': reference_id,
                    'X-Target-Environment': 'sandbox',
                    'Ocp-Apim-Subscription-Key': subscription_key,
                    'Content-Type': 'application/json'
                },
                json=data
            )
            
            if response.status_code == 202:
                return reference_id, 'success'
            elif response.status_code == 409:
                # Duplicate ID, regenerate and retry
                continue
            elif response.status_code in [500, 503]:
                # Server error, wait and retry
                time.sleep(2 ** attempt)
                continue
            else:
                return None, response.json()
                
        except requests.exceptions.RequestException as e:
            if attempt == max_retries - 1:
                raise
            time.sleep(2 ** attempt)
    
    return None, 'max_retries_exceeded'
```

## Sandbox Testing

### Test Environment Settings

- **Base URL:** `https://sandbox.momodeveloper.mtn.com`
- **Target Environment:** `sandbox`
- **Test Currency:** `EUR`

### Predefined Test Numbers

Sandbox includes predefined test scenarios triggered by specific phone numbers:

**Request to Pay Scenarios:**

| Phone Number | Status | Description |
|-------------|--------|-------------|
| Any other number | SUCCESSFUL | Normal success |
| 46733123450 | FAILED | Transaction failed |
| 46733123451 | REJECTED | Customer rejected |
| 46733123452 | EXPIRED | Request expired |
| 46733123453 | ONGOING | Still processing |
| 46733123455 | PAYER_NOT_FOUND | Payer doesn't exist |
| 46733123456 | PAYEE_NOT_ALLOWED_TO_RECEIVE | Payee blocked |
| 46733123457 | NOT_ALLOWED | Not allowed |
| 46733123460 | INVALID_CURRENCY | Invalid currency |

**Transfer Scenarios:**

| Phone Number | Status | Description |
|-------------|--------|-------------|
| 46733123450 | FAILED | Transfer failed |
| 46733123455 | NOT_ENOUGH_FUNDS | Insufficient funds |
| 46733123456 | PAYER_LIMIT_REACHED | Limit exceeded |
| 46733123457 | PAYEE_NOT_FOUND | Payee not found |

**Account Validation:**

| Phone Number/Email | Result |
|-------------------|--------|
| 46733123450 | NOT_FOUND |
| 46733123451 | NOT_ACTIVE |
| notfound@email.com | NOT_FOUND |
| notactive@email.com | NOT_ACTIVE |

**OAuth2/Consent Scenarios:**

| Phone Number | Scenario |
|-------------|----------|
| 46733123450 | Account holder not found |
| 46733123451 | Consent rejected |
| 46733123452 | Consent pending |
| 46733123458 | Insufficient funds |

### Testing Workflow Example

```python
# 1. Create API User and Key (one-time setup)
api_user = create_api_user()
api_key = create_api_key(api_user)

# 2. Get access token
token = get_access_token(api_user, api_key)

# 3. Test successful payment
success_ref = request_to_pay(
    amount="100",
    payer_msisdn="256772123456",  # Any other number = success
    token=token
)
assert check_status(success_ref, token) == "SUCCESSFUL"

# 4. Test failed payment
failed_ref = request_to_pay(
    amount="100",
    payer_msisdn="46733123450",  # Predefined failure
    token=token
)
assert check_status(failed_ref, token) == "FAILED"

# 5. Test account validation
assert validate_account("46733123450") == False  # Not found
assert validate_account("256772123456") == True  # Active
```

## Best Practices

### 1. Reference ID Management

```python
import uuid

def generate_reference_id():
    """Always use UUID v4 for reference IDs"""
    return str(uuid.uuid4())

# Store mapping for reconciliation
reference_map = {
    'reference_id': 'order_id',
    'created_at': 'timestamp'
}
```

### 2. Token Management

```python
class TokenManager:
    def __init__(self):
        self.token = None
        self.expires_at = None
    
    def get_token(self):
        if self.token and time.time() < self.expires_at:
            return self.token
        
        # Request new token
        response = request_access_token()
        self.token = response['access_token']
        self.expires_at = time.time() + response['expires_in'] - 60  # 60s buffer
        
        return self.token
```

### 3. Idempotency

- **Never reuse reference IDs** - Each transaction needs unique UUID
- Use `externalId` for your internal order/transaction tracking
- Store reference IDs to prevent duplicate submissions

### 4. Status Polling

```python
def wait_for_transaction(reference_id, timeout=300):
    """Poll for transaction completion"""
    start = time.time()
    
    while time.time() - start < timeout:
        status = check_transaction_status(reference_id)
        
        if status in ['SUCCESSFUL', 'FAILED']:
            return status
        
        time.sleep(5)  # Poll every 5 seconds
    
    return 'TIMEOUT'
```

### 5. Production Checklist

- [ ] Switch to production base URL
- [ ] Update target environment to production country code
- [ ] Use production API User/Key from Partner Portal
- [ ] Update currency to local currency (UGX, GHS, etc.)
- [ ] Implement proper logging and monitoring
- [ ] Set up callback URL with HTTPS
- [ ] Implement callback signature verification (if available)
- [ ] Test with small amounts first
- [ ] Set up alerts for failed transactions
- [ ] Implement reconciliation process

## Code Examples

### Complete Python Integration

```python
import requests
import uuid
import time
from typing import Dict, Optional

class MTNMoMoAPI:
    def __init__(self, subscription_key: str, api_user: str, api_key: str, 
                 environment: str = 'sandbox'):
        self.subscription_key = subscription_key
        self.api_user = api_user
        self.api_key = api_key
        self.environment = environment
        
        if environment == 'sandbox':
            self.base_url = 'https://sandbox.momodeveloper.mtn.com'
        else:
            self.base_url = 'https://proxy.momoapi.mtn.com'
        
        self.access_token = None
        self.token_expires_at = 0
    
    def get_access_token(self) -> str:
        """Get or refresh access token"""
        if self.access_token and time.time() < self.token_expires_at:
            return self.access_token
        
        import base64
        auth = base64.b64encode(f'{self.api_user}:{self.api_key}'.encode()).decode()
        
        response = requests.post(
            f'{self.base_url}/collection/token/',
            headers={
                'Authorization': f'Basic {auth}',
                'Ocp-Apim-Subscription-Key': self.subscription_key
            }
        )
        response.raise_for_status()
        
        data = response.json()
        self.access_token = data['access_token']
        self.token_expires_at = time.time() + data['expires_in'] - 60
        
        return self.access_token
    
    def request_to_pay(self, amount: str, currency: str, payer_msisdn: str,
                       external_id: str, payer_message: str = '',
                       payee_note: str = '', callback_url: Optional[str] = None) -> str:
        """Request payment from customer"""
        reference_id = str(uuid.uuid4())
        
        headers = {
            'Authorization': f'Bearer {self.get_access_token()}',
            'X-Reference-Id': reference_id,
            'X-Target-Environment': self.environment,
            'Ocp-Apim-Subscription-Key': self.subscription_key,
            'Content-Type': 'application/json'
        }
        
        if callback_url:
            headers['X-Callback-Url'] = callback_url
        
        payload = {
            'amount': amount,
            'currency': currency,
            'externalId': external_id,
            'payer': {
                'partyIdType': 'MSISDN',
                'partyId': payer_msisdn
            },
            'payerMessage': payer_message,
            'payeeNote': payee_note
        }
        
        response = requests.post(
            f'{self.base_url}/collection/v1_0/requesttopay',
            headers=headers,
            json=payload
        )
        
        if response.status_code == 202:
            return reference_id
        else:
            raise Exception(f'Request failed: {response.status_code} - {response.text}')
    
    def get_transaction_status(self, reference_id: str) -> Dict:
        """Check transaction status"""
        response = requests.get(
            f'{self.base_url}/collection/v1_0/requesttopay/{reference_id}',
            headers={
                'Authorization': f'Bearer {self.get_access_token()}',
                'X-Target-Environment': self.environment,
                'Ocp-Apim-Subscription-Key': self.subscription_key
            }
        )
        response.raise_for_status()
        return response.json()
    
    def transfer(self, amount: str, currency: str, payee_msisdn: str,
                 external_id: str, payer_message: str = '',
                 payee_note: str = '') -> str:
        """Transfer funds to customer"""
        reference_id = str(uuid.uuid4())
        
        payload = {
            'amount': amount,
            'currency': currency,
            'externalId': external_id,
            'payee': {
                'partyIdType': 'MSISDN',
                'partyId': payee_msisdn
            },
            'payerMessage': payer_message,
            'payeeNote': payee_note
        }
        
        response = requests.post(
            f'{self.base_url}/disbursement/v1_0/transfer',
            headers={
                'Authorization': f'Bearer {self.get_access_token()}',
                'X-Reference-Id': reference_id,
                'X-Target-Environment': self.environment,
                'Ocp-Apim-Subscription-Key': self.subscription_key,
                'Content-Type': 'application/json'
            },
            json=payload
        )
        
        if response.status_code == 202:
            return reference_id
        else:
            raise Exception(f'Transfer failed: {response.status_code}')
    
    def validate_account(self, msisdn: str) -> bool:
        """Check if account is active"""
        response = requests.get(
            f'{self.base_url}/collection/v1_0/accountholder/msisdn/{msisdn}/active',
            headers={
                'Authorization': f'Bearer {self.get_access_token()}',
                'X-Target-Environment': self.environment,
                'Ocp-Apim-Subscription-Key': self.subscription_key
            }
        )
        return response.status_code == 200

# Usage example
api = MTNMoMoAPI(
    subscription_key='your-subscription-key',
    api_user='your-api-user-uuid',
    api_key='your-api-key'
)

# Request payment
ref_id = api.request_to_pay(
    amount='100',
    currency='EUR',
    payer_msisdn='256772123456',
    external_id='ORDER123',
    payer_message='Payment for order #123'
)

# Check status
time.sleep(5)
status = api.get_transaction_status(ref_id)
print(f"Transaction status: {status['status']}")
```

### Node.js Integration

```javascript
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

class MTNMoMoAPI {
  constructor(subscriptionKey, apiUser, apiKey, environment = 'sandbox') {
    this.subscriptionKey = subscriptionKey;
    this.apiUser = apiUser;
    this.apiKey = apiKey;
    this.environment = environment;
    
    this.baseURL = environment === 'sandbox' 
      ? 'https://sandbox.momodeveloper.mtn.com'
      : 'https://proxy.momoapi.mtn.com';
    
    this.accessToken = null;
    this.tokenExpiresAt = 0;
  }
  
  async getAccessToken() {
    if (this.accessToken && Date.now() < this.tokenExpiresAt) {
      return this.accessToken;
    }
    
    const auth = Buffer.from(`${this.apiUser}:${this.apiKey}`).toString('base64');
    
    const response = await axios.post(
      `${this.baseURL}/collection/token/`,
      {},
      {
        headers: {
          'Authorization': `Basic ${auth}`,
          'Ocp-Apim-Subscription-Key': this.subscriptionKey
        }
      }
    );
    
    this.accessToken = response.data.access_token;
    this.tokenExpiresAt = Date.now() + (response.data.expires_in * 1000) - 60000;
    
    return this.accessToken;
  }
  
  async requestToPay(amount, currency, payerMsisdn, externalId, options = {}) {
    const referenceId = uuidv4();
    const token = await this.getAccessToken();
    
    const headers = {
      'Authorization': `Bearer ${token}`,
      'X-Reference-Id': referenceId,
      'X-Target-Environment': this.environment,
      'Ocp-Apim-Subscription-Key': this.subscriptionKey,
      'Content-Type': 'application/json'
    };
    
    if (options.callbackUrl) {
      headers['X-Callback-Url'] = options.callbackUrl;
    }
    
    const payload = {
      amount,
      currency,
      externalId,
      payer: {
        partyIdType: 'MSISDN',
        partyId: payerMsisdn
      },
      payerMessage: options.payerMessage || '',
      payeeNote: options.payeeNote || ''
    };
    
    await axios.post(
      `${this.baseURL}/collection/v1_0/requesttopay`,
      payload,
      { headers }
    );
    
    return referenceId;
  }
  
  async getTransactionStatus(referenceId) {
    const token = await this.getAccessToken();
    
    const response = await axios.get(
      `${this.baseURL}/collection/v1_0/requesttopay/${referenceId}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'X-Target-Environment': this.environment,
          'Ocp-Apim-Subscription-Key': this.subscriptionKey
        }
      }
    );
    
    return response.data;
  }
}

// Usage
const api = new MTNMoMoAPI(
  'subscription-key',
  'api-user-uuid',
  'api-key'
);

(async () => {
  const refId = await api.requestToPay(
    '100',
    'EUR',
    '256772123456',
    'ORDER123',
    { payerMessage: 'Payment for order #123' }
  );
  
  // Wait and check status
  setTimeout(async () => {
    const status = await api.getTransactionStatus(refId);
    console.log('Transaction status:', status.status);
  }, 5000);
})();
```

## Resources

- **Documentation:** https://momodeveloper.mtn.com/api-documentation
- **Sandbox Portal:** https://momodeveloper.mtn.com
- **Partner Portal:** Contact MTN for production access
- **Support:** developer@mtn.com

## Quick Reference

| Operation | Method | Endpoint |
|-----------|--------|----------|
| Create API User | POST | `/v1_0/apiuser` |
| Create API Key | POST | `/v1_0/apiuser/{id}/apikey` |
| Get Access Token | POST | `/collection/token/` |
| Request to Pay | POST | `/collection/v1_0/requesttopay` |
| Check Request Status | GET | `/collection/v1_0/requesttopay/{id}` |
| Transfer | POST | `/disbursement/v1_0/transfer` |
| Deposit V1 | POST | `/disbursement/v1_0/deposit` |
| Deposit V2 | POST | `/disbursement/v2_0/deposit` |
| Validate Account | GET | `/collection/v1_0/accountholder/{type}/{id}/active` |
| Get Balance | GET | `/collection/v1_0/account/balance` |
| Send Notification | POST | `/collection/v1_0/requesttopay/{id}/deliverynotification` |
