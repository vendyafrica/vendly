---
name: momo-api
description: Build applications that integrate with MTN Mobile Money (MoMo) APIs for payments, disbursements, remittances, and financial services in Africa. Use when implementing mobile money payments, sending money to users, checking account balances, validating accounts, or any financial transaction using MTN MoMo platform.
---

# MTN MoMo API Integration Skill

This skill helps you build robust, production-ready integrations with MTN Mobile Money (MoMo) APIs.

## When to Use This Skill

Trigger this skill when the user wants to:
- Accept mobile money payments from customers (Collections)
- Send money to customers or businesses (Disbursements)
- Process international remittances
- Validate MoMo account holders
- Check account balances
- Create invoices payable via MoMo
- Implement cash in/cash out functionality
- Integrate any MTN Mobile Money financial service

## Core Concepts

### 1. API Products

MTN MoMo has three main API products, each requiring separate subscription keys:

- **Collection**: Receive payments from customers (C2B, B2B collections)
- **Disbursement**: Send money to customers/businesses (salary, winnings, refunds)
- **Remittance**: International money transfers with enhanced KYC

### 2. Environments

- **Sandbox**: Testing environment using EUR currency and test MSISDNs
- **Production**: Live environment using local currencies and real phone numbers

### 3. Authentication Flow

All MoMo APIs use a two-step authentication process:

```
1. Create API User + API Key (one-time setup)
   ↓
2. Generate Access Token (expires in 3600 seconds)
   ↓
3. Use Access Token for API calls
```

## Implementation Patterns

### Pattern 1: Initial Setup (Sandbox)

```python
import requests
import uuid

# Step 1: Generate API User and API Key
def setup_api_user(subscription_key, base_url):
    """One-time setup to create API user and generate API key"""
    
    # Generate UUID for API user
    api_user = str(uuid.uuid4())
    
    # Create API user
    headers = {
        'X-Reference-Id': api_user,
        'Content-Type': 'application/json',
        'Ocp-Apim-Subscription-Key': subscription_key
    }
    
    body = {
        'providerCallbackHost': 'your-callback-host.com'  # Optional
    }
    
    response = requests.post(
        f'{base_url}/v1_0/apiuser',
        json=body,
        headers=headers
    )
    
    if response.status_code == 201:
        # Create API Key
        key_response = requests.post(
            f'{base_url}/v1_0/apiuser/{api_user}/apikey',
            headers={'Ocp-Apim-Subscription-Key': subscription_key}
        )
        
        if key_response.status_code == 201:
            api_key = key_response.json()['apiKey']
            return {
                'api_user': api_user,
                'api_key': api_key
            }
    
    raise Exception(f"Setup failed: {response.text}")

# Usage
credentials = setup_api_user(
    subscription_key='your-collection-subscription-key',
    base_url='https://sandbox.momodeveloper.mtn.com'
)

print(f"API User: {credentials['api_user']}")
print(f"API Key: {credentials['api_key']}")
```

### Pattern 2: Get Access Token

```python
import requests
import base64

def get_access_token(api_user, api_key, subscription_key, base_url, product='collection'):
    """Generate access token (valid for 3600 seconds)"""
    
    # Create Basic Auth credentials
    credentials = f"{api_user}:{api_key}"
    encoded_credentials = base64.b64encode(credentials.encode()).decode()
    
    headers = {
        'Authorization': f'Basic {encoded_credentials}',
        'Ocp-Apim-Subscription-Key': subscription_key
    }
    
    response = requests.post(
        f'{base_url}/{product}/token/',
        headers=headers
    )
    
    if response.status_code == 200:
        data = response.json()
        return data['access_token']
    
    raise Exception(f"Token generation failed: {response.text}")

# Usage
access_token = get_access_token(
    api_user='your-api-user-uuid',
    api_key='your-api-key',
    subscription_key='your-collection-subscription-key',
    base_url='https://sandbox.momodeveloper.mtn.com',
    product='collection'
)
```

### Pattern 3: Request Payment (Collection)

```python
import requests
import uuid

def request_payment(access_token, subscription_key, base_url, 
                   amount, msisdn, external_id=None):
    """Request payment from a customer"""
    
    reference_id = str(uuid.uuid4())
    
    headers = {
        'Authorization': f'Bearer {access_token}',
        'X-Reference-Id': reference_id,
        'X-Target-Environment': 'sandbox',  # or 'production'
        'Content-Type': 'application/json',
        'Ocp-Apim-Subscription-Key': subscription_key,
        'X-Callback-Url': 'https://your-webhook.com/callback'  # Optional
    }
    
    body = {
        'amount': str(amount),
        'currency': 'EUR',  # Use local currency in production
        'externalId': external_id or str(uuid.uuid4()),
        'payer': {
            'partyIdType': 'MSISDN',
            'partyId': msisdn
        },
        'payerMessage': 'Payment request',
        'payeeNote': 'Payment for services'
    }
    
    response = requests.post(
        f'{base_url}/collection/v1_0/requesttopay',
        json=body,
        headers=headers
    )
    
    if response.status_code == 202:
        return {
            'reference_id': reference_id,
            'status': 'pending'
        }
    
    raise Exception(f"Payment request failed: {response.text}")

# Usage
payment = request_payment(
    access_token=access_token,
    subscription_key='your-collection-subscription-key',
    base_url='https://sandbox.momodeveloper.mtn.com',
    amount=1000,
    msisdn='56733123453'  # Test number for sandbox
)

print(f"Payment Reference ID: {payment['reference_id']}")
```

### Pattern 4: Check Payment Status

```python
def check_payment_status(access_token, subscription_key, base_url, reference_id):
    """Check status of a payment request"""
    
    headers = {
        'Authorization': f'Bearer {access_token}',
        'X-Target-Environment': 'sandbox',
        'Ocp-Apim-Subscription-Key': subscription_key
    }
    
    response = requests.get(
        f'{base_url}/collection/v1_0/requesttopay/{reference_id}',
        headers=headers
    )
    
    if response.status_code == 200:
        return response.json()
    
    raise Exception(f"Status check failed: {response.text}")

# Usage
status = check_payment_status(
    access_token=access_token,
    subscription_key='your-collection-subscription-key',
    base_url='https://sandbox.momodeveloper.mtn.com',
    reference_id=payment['reference_id']
)

print(f"Status: {status.get('status')}")
```

### Pattern 5: Send Money (Disbursement/Transfer)

```python
def send_money(access_token, subscription_key, base_url, 
               amount, msisdn, external_id=None):
    """Send money to a customer (disbursement)"""
    
    reference_id = str(uuid.uuid4())
    
    headers = {
        'Authorization': f'Bearer {access_token}',
        'X-Reference-Id': reference_id,
        'X-Target-Environment': 'sandbox',
        'Content-Type': 'application/json',
        'Ocp-Apim-Subscription-Key': subscription_key,
        'X-Callback-Url': 'https://your-webhook.com/callback'
    }
    
    body = {
        'amount': str(amount),
        'currency': 'EUR',
        'externalId': external_id or str(uuid.uuid4()),
        'payee': {
            'partyIdType': 'MSISDN',
            'partyId': msisdn
        },
        'payerMessage': 'Payment sent',
        'payeeNote': 'You received a payment'
    }
    
    response = requests.post(
        f'{base_url}/disbursement/v1_0/transfer',
        json=body,
        headers=headers
    )
    
    if response.status_code == 202:
        return {
            'reference_id': reference_id,
            'status': 'pending'
        }
    
    raise Exception(f"Transfer failed: {response.text}")
```

### Pattern 6: Account Validation

```python
def validate_account(access_token, subscription_key, base_url, msisdn):
    """Check if an MSISDN has an active MoMo account"""
    
    headers = {
        'Authorization': f'Bearer {access_token}',
        'X-Target-Environment': 'sandbox',
        'Ocp-Apim-Subscription-Key': subscription_key
    }
    
    response = requests.get(
        f'{base_url}/disbursement/v1_0/accountholder/msisdn/{msisdn}/active',
        headers=headers
    )
    
    if response.status_code == 200:
        return response.json()['result']  # True or False
    
    return False

def get_account_holder_info(access_token, subscription_key, base_url, msisdn):
    """Get basic account holder information"""
    
    headers = {
        'Authorization': f'Bearer {access_token}',
        'X-Target-Environment': 'sandbox',
        'Ocp-Apim-Subscription-Key': subscription_key
    }
    
    response = requests.get(
        f'{base_url}/disbursement/v1_0/accountholder/msisdn/{msisdn}/basicuserinfo',
        headers=headers
    )
    
    if response.status_code == 200:
        return response.json()
    
    raise Exception(f"Failed to get user info: {response.text}")

# Usage
is_active = validate_account(access_token, subscription_key, base_url, '56733123453')
if is_active:
    user_info = get_account_holder_info(access_token, subscription_key, base_url, '56733123453')
    print(f"Name: {user_info.get('name')}")
```

### Pattern 7: Complete Integration Class

```python
import requests
import uuid
import base64
from typing import Dict, Optional
from datetime import datetime, timedelta

class MoMoAPI:
    """Complete MTN MoMo API integration"""
    
    def __init__(self, subscription_key: str, api_user: str, api_key: str,
                 environment: str = 'sandbox', product: str = 'collection'):
        self.subscription_key = subscription_key
        self.api_user = api_user
        self.api_key = api_key
        self.environment = environment
        self.product = product
        
        if environment == 'sandbox':
            self.base_url = 'https://sandbox.momodeveloper.mtn.com'
        else:
            self.base_url = 'https://momodeveloper.mtn.com'
        
        self.access_token = None
        self.token_expiry = None
    
    def _ensure_token(self):
        """Ensure we have a valid access token"""
        if not self.access_token or datetime.now() >= self.token_expiry:
            self._refresh_token()
    
    def _refresh_token(self):
        """Get a new access token"""
        credentials = f"{self.api_user}:{self.api_key}"
        encoded = base64.b64encode(credentials.encode()).decode()
        
        headers = {
            'Authorization': f'Basic {encoded}',
            'Ocp-Apim-Subscription-Key': self.subscription_key
        }
        
        response = requests.post(
            f'{self.base_url}/{self.product}/token/',
            headers=headers
        )
        
        if response.status_code == 200:
            data = response.json()
            self.access_token = data['access_token']
            # Set expiry 5 minutes before actual expiry for safety
            self.token_expiry = datetime.now() + timedelta(seconds=data['expires_in'] - 300)
        else:
            raise Exception(f"Token refresh failed: {response.text}")
    
    def request_payment(self, amount: float, msisdn: str, 
                       external_id: Optional[str] = None,
                       payer_message: str = "Payment request",
                       payee_note: str = "Payment") -> Dict:
        """Request payment from customer"""
        self._ensure_token()
        
        reference_id = str(uuid.uuid4())
        
        headers = {
            'Authorization': f'Bearer {self.access_token}',
            'X-Reference-Id': reference_id,
            'X-Target-Environment': self.environment,
            'Content-Type': 'application/json',
            'Ocp-Apim-Subscription-Key': self.subscription_key
        }
        
        body = {
            'amount': str(amount),
            'currency': 'EUR' if self.environment == 'sandbox' else 'UGX',
            'externalId': external_id or str(uuid.uuid4()),
            'payer': {
                'partyIdType': 'MSISDN',
                'partyId': msisdn
            },
            'payerMessage': payer_message,
            'payeeNote': payee_note
        }
        
        response = requests.post(
            f'{self.base_url}/collection/v1_0/requesttopay',
            json=body,
            headers=headers
        )
        
        if response.status_code == 202:
            return {'reference_id': reference_id, 'status': 'pending'}
        
        raise Exception(f"Payment request failed: {response.status_code} - {response.text}")
    
    def check_payment_status(self, reference_id: str) -> Dict:
        """Check payment status"""
        self._ensure_token()
        
        headers = {
            'Authorization': f'Bearer {self.access_token}',
            'X-Target-Environment': self.environment,
            'Ocp-Apim-Subscription-Key': self.subscription_key
        }
        
        response = requests.get(
            f'{self.base_url}/collection/v1_0/requesttopay/{reference_id}',
            headers=headers
        )
        
        if response.status_code == 200:
            return response.json()
        
        raise Exception(f"Status check failed: {response.status_code} - {response.text}")
    
    def send_money(self, amount: float, msisdn: str,
                   external_id: Optional[str] = None,
                   payer_message: str = "Transfer",
                   payee_note: str = "You received money") -> Dict:
        """Send money to customer (requires disbursement subscription)"""
        self._ensure_token()
        
        reference_id = str(uuid.uuid4())
        
        headers = {
            'Authorization': f'Bearer {self.access_token}',
            'X-Reference-Id': reference_id,
            'X-Target-Environment': self.environment,
            'Content-Type': 'application/json',
            'Ocp-Apim-Subscription-Key': self.subscription_key
        }
        
        body = {
            'amount': str(amount),
            'currency': 'EUR' if self.environment == 'sandbox' else 'UGX',
            'externalId': external_id or str(uuid.uuid4()),
            'payee': {
                'partyIdType': 'MSISDN',
                'partyId': msisdn
            },
            'payerMessage': payer_message,
            'payeeNote': payee_note
        }
        
        response = requests.post(
            f'{self.base_url}/disbursement/v1_0/transfer',
            json=body,
            headers=headers
        )
        
        if response.status_code == 202:
            return {'reference_id': reference_id, 'status': 'pending'}
        
        raise Exception(f"Transfer failed: {response.status_code} - {response.text}")
    
    def validate_account(self, msisdn: str) -> bool:
        """Check if MSISDN has active MoMo account"""
        self._ensure_token()
        
        headers = {
            'Authorization': f'Bearer {self.access_token}',
            'X-Target-Environment': self.environment,
            'Ocp-Apim-Subscription-Key': self.subscription_key
        }
        
        response = requests.get(
            f'{self.base_url}/disbursement/v1_0/accountholder/msisdn/{msisdn}/active',
            headers=headers
        )
        
        if response.status_code == 200:
            return response.json().get('result', False)
        
        return False
    
    def get_balance(self) -> Dict:
        """Get account balance"""
        self._ensure_token()
        
        headers = {
            'Authorization': f'Bearer {self.access_token}',
            'X-Target-Environment': self.environment,
            'Ocp-Apim-Subscription-Key': self.subscription_key
        }
        
        response = requests.get(
            f'{self.base_url}/collection/v1_0/account/balance',
            headers=headers
        )
        
        if response.status_code == 200:
            return response.json()
        
        raise Exception(f"Balance check failed: {response.status_code} - {response.text}")

# Usage example
momo = MoMoAPI(
    subscription_key='your-subscription-key',
    api_user='your-api-user-uuid',
    api_key='your-api-key',
    environment='sandbox',
    product='collection'
)

# Request payment
payment = momo.request_payment(amount=1000, msisdn='56733123453')
print(f"Payment initiated: {payment['reference_id']}")

# Check status
import time
time.sleep(5)  # Wait for processing
status = momo.check_payment_status(payment['reference_id'])
print(f"Payment status: {status.get('status')}")
```

## Sandbox Testing

### Test MSISDN Numbers

In sandbox, use these test numbers to simulate different response scenarios:

| MSISDN | Expected Response |
|--------|------------------|
| 46733123450 | Failed |
| 46733123451 | Rejected |
| 46733123452 | Timeout |
| 56733123453 | Success |
| 46733123454 | Pending |

**Important**: For production, MSISDNs must include the country code (e.g., `256701234567` for Uganda).

### Sandbox Limitations

- Currency is always `EUR` in sandbox (use local currency in production)
- No actual money is transferred
- Callbacks may not work reliably
- Some features may behave differently

## Critical Best Practices

### 1. Security

**NEVER hardcode credentials**:
```python
# ❌ BAD
api_key = "your-secret-key-here"

# ✅ GOOD
import os
api_key = os.environ.get('MOMO_API_KEY')
```

**Store credentials securely**:
- Use environment variables
- Use secrets management services (AWS Secrets Manager, Azure Key Vault)
- Never commit credentials to version control

### 2. Token Management

**Cache access tokens** (they last 3600 seconds):
```python
class TokenManager:
    def __init__(self):
        self.token = None
        self.expiry = None
    
    def get_token(self):
        if not self.token or datetime.now() >= self.expiry:
            self.token = self._fetch_new_token()
            self.expiry = datetime.now() + timedelta(seconds=3500)
        return self.token
```

### 3. Error Handling

**Always handle API errors gracefully**:
```python
try:
    payment = momo.request_payment(amount=1000, msisdn='56733123453')
except requests.exceptions.Timeout:
    # Handle timeout
    print("Request timeout - retry")
except requests.exceptions.ConnectionError:
    # Handle network error
    print("Network error - check connection")
except Exception as e:
    # Handle MoMo API errors
    print(f"Payment failed: {str(e)}")
```

### 4. Idempotency

**Use unique reference IDs**:
```python
# Always generate unique UUID for each transaction
reference_id = str(uuid.uuid4())
```

**Store reference IDs** for reconciliation and tracking.

### 5. Webhook Handling

**Implement webhooks for async notifications**:
```python
from flask import Flask, request

app = Flask(__name__)

@app.route('/momo/callback', methods=['POST'])
def momo_callback():
    data = request.json
    reference_id = request.headers.get('X-Reference-Id')
    
    # Process callback
    # Update transaction status in database
    
    return '', 200
```

**Secure your webhooks**:
- Use HTTPS only
- Validate callback source
- Verify reference IDs match your records

### 6. Phone Number Formatting

**Always validate and format MSISDNs**:
```python
def format_msisdn(phone: str, country_code: str = '256') -> str:
    """Format phone number for MoMo API"""
    # Remove spaces, dashes, plus signs
    phone = phone.replace(' ', '').replace('-', '').replace('+', '')
    
    # Remove leading zero if present
    if phone.startswith('0'):
        phone = phone[1:]
    
    # Add country code if not present
    if not phone.startswith(country_code):
        phone = country_code + phone
    
    return phone

# Usage
msisdn = format_msisdn('0701234567', '256')  # Returns: 256701234567
```

### 7. Amount Handling

**Always use strings for amounts** (avoid floating point issues):
```python
# ❌ BAD
amount = 1000.50

# ✅ GOOD
amount = "1000.50"
```

### 8. Status Checking Pattern

**Implement polling with exponential backoff**:
```python
import time

def wait_for_payment_completion(momo, reference_id, max_attempts=10):
    """Poll payment status with exponential backoff"""
    attempt = 0
    delay = 2  # Start with 2 seconds
    
    while attempt < max_attempts:
        try:
            status = momo.check_payment_status(reference_id)
            
            if status.get('status') in ['SUCCESSFUL', 'FAILED']:
                return status
            
            # Wait before next attempt
            time.sleep(delay)
            delay = min(delay * 1.5, 30)  # Max 30 seconds
            attempt += 1
            
        except Exception as e:
            print(f"Status check error: {e}")
            time.sleep(delay)
            attempt += 1
    
    raise TimeoutError("Payment status check timed out")
```

## Common Workflows

### Workflow 1: E-commerce Checkout

```python
def process_checkout(cart_total, customer_phone):
    """Process e-commerce checkout with MoMo"""
    
    # 1. Validate account
    if not momo.validate_account(customer_phone):
        return {'error': 'Invalid MoMo account'}
    
    # 2. Request payment
    try:
        payment = momo.request_payment(
            amount=cart_total,
            msisdn=customer_phone,
            external_id=f"ORDER-{uuid.uuid4()}",
            payer_message="Payment for order",
            payee_note="Thank you for your purchase"
        )
    except Exception as e:
        return {'error': f'Payment request failed: {str(e)}'}
    
    # 3. Wait for completion
    try:
        result = wait_for_payment_completion(momo, payment['reference_id'])
        
        if result.get('status') == 'SUCCESSFUL':
            # Process order
            return {'success': True, 'reference': payment['reference_id']}
        else:
            return {'error': 'Payment failed', 'status': result.get('status')}
            
    except TimeoutError:
        return {'error': 'Payment timeout'}
```

### Workflow 2: Salary Disbursement

```python
def pay_salaries(employees):
    """Batch salary payments"""
    results = []
    
    for employee in employees:
        try:
            # Validate account
            if not momo.validate_account(employee['phone']):
                results.append({
                    'employee_id': employee['id'],
                    'status': 'failed',
                    'error': 'Invalid account'
                })
                continue
            
            # Send money
            transfer = momo.send_money(
                amount=employee['salary'],
                msisdn=employee['phone'],
                external_id=f"SALARY-{employee['id']}-{datetime.now().strftime('%Y%m')}",
                payer_message=f"Salary for {datetime.now().strftime('%B %Y')}",
                payee_note="Salary payment"
            )
            
            results.append({
                'employee_id': employee['id'],
                'status': 'pending',
                'reference': transfer['reference_id']
            })
            
        except Exception as e:
            results.append({
                'employee_id': employee['id'],
                'status': 'failed',
                'error': str(e)
            })
    
    return results
```

### Workflow 3: Invoice Payment

```python
def create_payable_invoice(amount, customer_phone, description):
    """Create invoice payable via MoMo"""
    
    reference_id = str(uuid.uuid4())
    
    headers = {
        'Authorization': f'Bearer {access_token}',
        'X-Reference-Id': reference_id,
        'X-Target-Environment': 'sandbox',
        'Content-Type': 'application/json',
        'Ocp-Apim-Subscription-Key': subscription_key
    }
    
    body = {
        'externalId': f"INV-{uuid.uuid4()}",
        'amount': str(amount),
        'currency': 'EUR',
        'validityDuration': '86400',  # 24 hours in seconds
        'intendedPayer': {
            'partyIdType': 'MSISDN',
            'partyId': customer_phone
        },
        'payee': {
            'partyIdType': 'MSISDN',
            'partyId': 'your-merchant-number'
        },
        'description': description
    }
    
    response = requests.post(
        f'{base_url}/collection/v2_0/invoice',
        json=body,
        headers=headers
    )
    
    if response.status_code == 202:
        return {
            'invoice_id': reference_id,
            'message': 'Customer will receive SMS with invoice details'
        }
    
    raise Exception(f"Invoice creation failed: {response.text}")
```

## Environment-Specific Considerations

### Sandbox → Production Checklist

- [ ] Update `base_url` to production endpoint
- [ ] Change `X-Target-Environment` from `sandbox` to production country code
- [ ] Update currency from `EUR` to local currency (e.g., `UGX` for Uganda)
- [ ] Use production subscription keys
- [ ] Generate new production API user and API key
- [ ] Update MSISDN format to include country codes
- [ ] Test with small amounts first
- [ ] Implement proper logging and monitoring
- [ ] Set up webhook endpoints with HTTPS
- [ ] Configure proper error alerting

### Currency Codes by Country

| Country | Currency Code |
|---------|---------------|
| Uganda | UGX |
| Ghana | GHS |
| Cameroon | XAF |
| Côte d'Ivoire | XOF |
| Zambia | ZMW |
| South Africa | ZAR |

## Error Handling Reference

### Common HTTP Status Codes

| Status | Meaning | Action |
|--------|---------|--------|
| 200 | Success | Process response |
| 201 | Created | Resource created successfully |
| 202 | Accepted | Request accepted, processing async |
| 400 | Bad Request | Check request parameters |
| 401 | Unauthorized | Check access token |
| 404 | Not Found | Check reference ID or endpoint |
| 409 | Conflict | Duplicate transaction ID |
| 500 | Server Error | Retry with exponential backoff |

### Transaction Status Values

| Status | Meaning | Next Action |
|--------|---------|-------------|
| PENDING | Processing | Continue polling |
| SUCCESSFUL | Completed | Process fulfillment |
| FAILED | Failed | Handle failure, maybe refund |
| TIMEOUT | Timed out | Check status, possibly retry |
| REJECTED | Rejected | Handle rejection |

## Node.js/Express Example

```javascript
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

class MoMoAPI {
    constructor(subscriptionKey, apiUser, apiKey, environment = 'sandbox') {
        this.subscriptionKey = subscriptionKey;
        this.apiUser = apiUser;
        this.apiKey = apiKey;
        this.environment = environment;
        this.baseUrl = environment === 'sandbox' 
            ? 'https://sandbox.momodeveloper.mtn.com'
            : 'https://momodeveloper.mtn.com';
        this.accessToken = null;
        this.tokenExpiry = null;
    }

    async ensureToken() {
        if (!this.accessToken || new Date() >= this.tokenExpiry) {
            await this.refreshToken();
        }
    }

    async refreshToken() {
        const credentials = Buffer.from(`${this.apiUser}:${this.apiKey}`).toString('base64');
        
        const response = await axios.post(
            `${this.baseUrl}/collection/token/`,
            {},
            {
                headers: {
                    'Authorization': `Basic ${credentials}`,
                    'Ocp-Apim-Subscription-Key': this.subscriptionKey
                }
            }
        );

        this.accessToken = response.data.access_token;
        // Set expiry 5 minutes before actual expiry
        this.tokenExpiry = new Date(Date.now() + (response.data.expires_in - 300) * 1000);
    }

    async requestPayment(amount, msisdn, externalId = null) {
        await this.ensureToken();

        const referenceId = uuidv4();
        
        const response = await axios.post(
            `${this.baseUrl}/collection/v1_0/requesttopay`,
            {
                amount: amount.toString(),
                currency: this.environment === 'sandbox' ? 'EUR' : 'UGX',
                externalId: externalId || uuidv4(),
                payer: {
                    partyIdType: 'MSISDN',
                    partyId: msisdn
                },
                payerMessage: 'Payment request',
                payeeNote: 'Payment'
            },
            {
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`,
                    'X-Reference-Id': referenceId,
                    'X-Target-Environment': this.environment,
                    'Content-Type': 'application/json',
                    'Ocp-Apim-Subscription-Key': this.subscriptionKey
                }
            }
        );

        return { referenceId, status: 'pending' };
    }

    async checkPaymentStatus(referenceId) {
        await this.ensureToken();

        const response = await axios.get(
            `${this.baseUrl}/collection/v1_0/requesttopay/${referenceId}`,
            {
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`,
                    'X-Target-Environment': this.environment,
                    'Ocp-Apim-Subscription-Key': this.subscriptionKey
                }
            }
        );

        return response.data;
    }
}

// Express endpoint example
const express = require('express');
const app = express();
app.use(express.json());

const momo = new MoMoAPI(
    process.env.MOMO_SUBSCRIPTION_KEY,
    process.env.MOMO_API_USER,
    process.env.MOMO_API_KEY,
    'sandbox'
);

app.post('/api/pay', async (req, res) => {
    try {
        const { amount, phone } = req.body;
        
        const payment = await momo.requestPayment(amount, phone);
        
        res.json({
            success: true,
            referenceId: payment.referenceId
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

app.get('/api/payment/:id', async (req, res) => {
    try {
        const status = await momo.checkPaymentStatus(req.params.id);
        res.json(status);
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

app.listen(3000, () => console.log('Server running on port 3000'));
```

## Testing Strategy

### Unit Tests

```python
import unittest
from unittest.mock import Mock, patch

class TestMoMoAPI(unittest.TestCase):
    def setUp(self):
        self.momo = MoMoAPI(
            subscription_key='test-key',
            api_user='test-user',
            api_key='test-api-key',
            environment='sandbox'
        )
    
    @patch('requests.post')
    def test_request_payment_success(self, mock_post):
        mock_post.return_value.status_code = 202
        
        result = self.momo.request_payment(
            amount=1000,
            msisdn='56733123453'
        )
        
        self.assertIn('reference_id', result)
        self.assertEqual(result['status'], 'pending')
    
    @patch('requests.get')
    def test_validate_account_active(self, mock_get):
        mock_get.return_value.status_code = 200
        mock_get.return_value.json.return_value = {'result': True}
        
        result = self.momo.validate_account('56733123453')
        
        self.assertTrue(result)
```

## Production Monitoring

### Key Metrics to Track

1. **Success Rate**: Percentage of successful transactions
2. **Average Response Time**: API response latency
3. **Token Refresh Rate**: How often tokens are being refreshed
4. **Error Rate by Type**: 4xx vs 5xx errors
5. **Transaction Volume**: Requests per minute/hour
6. **Callback Delivery Rate**: Webhook success rate

### Logging Best Practices

```python
import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

logger = logging.getLogger('momo_api')

def request_payment_with_logging(momo, amount, msisdn):
    logger.info(f"Initiating payment: amount={amount}, msisdn={msisdn[:5]}****")
    
    try:
        payment = momo.request_payment(amount, msisdn)
        logger.info(f"Payment request successful: ref={payment['reference_id']}")
        return payment
    except Exception as e:
        logger.error(f"Payment request failed: {str(e)}")
        raise
```

## Quick Reference

### Required Headers

| Header | Purpose | Example |
|--------|---------|---------|
| `Authorization` | Access token | `Bearer eyJ0eXAi...` |
| `X-Reference-Id` | Unique transaction ID | UUID v4 |
| `X-Target-Environment` | Environment | `sandbox` or production code |
| `Content-Type` | Request format | `application/json` |
| `Ocp-Apim-Subscription-Key` | Subscription key | From your profile |
| `X-Callback-Url` | Webhook URL (optional) | `https://your-site.com/callback` |

### Party ID Types

- `MSISDN`: Mobile phone number
- `ALIAS`: Merchant ID for business payments
- `EMAIL`: Email address (limited support)

### Useful Links

- Developer Portal: https://momodeveloper.mtn.com
- API Documentation: https://momodeveloper.mtn.com/api-documentation
- Postman Collection: Available in developer portal
- Community: MoMo Dev Community on MTN website

## Troubleshooting

### "Invalid credentials" / 401 Error
- Check API user and API key are correct
- Ensure access token hasn't expired
- Verify subscription key matches the product (collection vs disbursement)

### "Resource not found" / 404 Error
- Check reference ID is correct
- Ensure transaction has been processed
- Verify endpoint URL is correct

### "Duplicate transaction" / 409 Error
- Generate new UUID for X-Reference-Id
- Don't reuse reference IDs

### Timeout Issues
- Implement retry logic with exponential backoff
- Use webhooks instead of polling for production
- Check network connectivity

### Callback Not Received
- Ensure webhook URL is HTTPS
- Check firewall settings
- Verify URL is publicly accessible
- Test with webhook.site for debugging

---

Remember: Always start with sandbox, test thoroughly, and move to production only after comprehensive testing!