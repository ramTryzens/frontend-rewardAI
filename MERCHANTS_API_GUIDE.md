# Merchants API Usage Guide

Complete guide for managing merchant configurations via API.

## Base URL

**Local Development:**
```
http://localhost:3001/api
```

**Production (Vercel):**
```
https://your-app.vercel.app/api
```

---

## Endpoints Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/merchants` | Get all merchants |
| POST | `/merchants` | Create new merchant |
| PATCH | `/merchants/:id` | Update existing merchant |
| DELETE | `/merchants/:id` | Delete merchant |

---

## Data Model

A **Merchant** represents a business entity with:
- **name**: Merchant business name
- **ecomDetails**: E-commerce platform connection details
  - `platform`: Name of the e-commerce platform (must exist in `ecommerce_details`)
  - `accessKey`: API access token/key for the platform
- **businessRules**: Key-value pairs of business rules (keys must exist in `rules`)

**Example:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "ACME Store",
  "ecomDetails": {
    "platform": "BigCommerce",
    "accessKey": "abc123xyz789token"
  },
  "businessRules": {
    "min_order_value": 50,
    "free_shipping_threshold": 100,
    "tax_enabled": true,
    "loyalty_program_enabled": false
  },
  "createdAt": "2025-01-12T10:00:00.000Z",
  "updatedAt": "2025-01-12T10:00:00.000Z"
}
```

---

## 1. GET All Merchants

Retrieve all merchant configurations.

### Request

```bash
curl http://localhost:3001/api/merchants
```

### Response (200 OK)

```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "ACME Store",
      "ecomDetails": {
        "platform": "BigCommerce",
        "accessKey": "abc123xyz789token"
      },
      "businessRules": {
        "min_order_value": 50,
        "free_shipping_threshold": 100,
        "tax_enabled": true
      },
      "createdAt": "2025-01-12T10:00:00.000Z",
      "updatedAt": "2025-01-12T10:00:00.000Z"
    },
    {
      "_id": "507f1f77bcf86cd799439012",
      "name": "Tech Gadgets Inc",
      "ecomDetails": {
        "platform": "Shopify",
        "accessKey": "shpat_xyz789abc123"
      },
      "businessRules": {
        "min_order_value": 25,
        "express_shipping_enabled": true,
        "gift_wrap_available": true
      },
      "createdAt": "2025-01-12T11:00:00.000Z",
      "updatedAt": "2025-01-12T11:00:00.000Z"
    }
  ]
}
```

### Error Response (500 Internal Server Error)

```json
{
  "success": false,
  "error": "Failed to fetch merchants",
  "message": "Database connection error"
}
```

---

## 2. POST Create New Merchant

Create a new merchant configuration with full validation.

### Request

```bash
curl -X POST http://localhost:3001/api/merchants \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Fashion Boutique",
    "ecomDetails": {
      "platform": "BigCommerce",
      "accessKey": "bc_token_xyz123"
    },
    "businessRules": {
      "min_order_value": 30,
      "free_shipping_threshold": 75,
      "tax_enabled": true,
      "gift_wrap_available": false
    }
  }'
```

### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | ✅ Yes | Merchant business name |
| `ecomDetails` | object | ✅ Yes | E-commerce platform details |
| `ecomDetails.platform` | string | ✅ Yes | Platform name (must exist in `ecommerce_details`) |
| `ecomDetails.accessKey` | string | ✅ Yes | API access key/token |
| `businessRules` | object | ✅ Yes | Business rule configurations (at least one required) |

**businessRules Structure:**
- Keys: Must exist in the `rules` collection (e.g., `min_order_value`, `tax_enabled`)
- Values: Must be `boolean` or `number` (if number, must be >= 0)

```json
{
  "rule_key_name": true,           // Boolean value
  "another_rule": 100,              // Number value (>= 0)
  "feature_enabled": false          // Boolean value
}
```

### Response (201 Created)

```json
{
  "success": true,
  "message": "Merchant created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439013",
    "name": "Fashion Boutique",
    "ecomDetails": {
      "platform": "BigCommerce",
      "accessKey": "bc_token_xyz123"
    },
    "businessRules": {
      "min_order_value": 30,
      "free_shipping_threshold": 75,
      "tax_enabled": true,
      "gift_wrap_available": false
    },
    "createdAt": "2025-01-12T12:00:00.000Z",
    "updatedAt": "2025-01-12T12:00:00.000Z"
  }
}
```

### Error Responses

**400 Bad Request - Missing Merchant Name**
```json
{
  "success": false,
  "error": "Missing required field",
  "message": "Merchant name is required"
}
```

**400 Bad Request - Missing ecomDetails**
```json
{
  "success": false,
  "error": "Missing required fields",
  "message": "ecomDetails.platform and ecomDetails.accessKey are required"
}
```

**400 Bad Request - Missing Business Rules**
```json
{
  "success": false,
  "error": "Missing required field",
  "message": "businessRules object is required"
}
```

**400 Bad Request - Invalid Platform**
```json
{
  "success": false,
  "error": "Invalid platform",
  "message": "Platform \"UnknownPlatform\" does not exist in ecommerce_details collection"
}
```

**400 Bad Request - Invalid Business Rule Keys**
```json
{
  "success": false,
  "error": "Invalid business rules",
  "message": "Invalid rule keys: invalid_rule, another_bad_rule. Valid keys are: min_order_value, free_shipping_threshold, tax_enabled, gift_wrap_available",
  "invalidKeys": ["invalid_rule", "another_bad_rule"]
}
```

**400 Bad Request - Invalid Business Rule Values**
```json
{
  "success": false,
  "error": "Invalid business rule values",
  "message": "Rule \"min_order_value\" has invalid value type. Expected boolean or number, got string; Rule \"discount_percent\" has negative value. Numbers must be >= 0"
}
```

**409 Conflict - Duplicate Merchant Name**
```json
{
  "success": false,
  "error": "Duplicate entry",
  "message": "A merchant with this name may already exist"
}
```

---

## 3. PATCH Update Merchant

Update an existing merchant configuration by its MongoDB `_id`.

### Request

```bash
curl -X PATCH http://localhost:3001/api/merchants/507f1f77bcf86cd799439011 \
  -H "Content-Type: application/json" \
  -d '{
    "businessRules": {
      "min_order_value": 60,
      "free_shipping_threshold": 120,
      "tax_enabled": true,
      "loyalty_program_enabled": true
    }
  }'
```

### Request Body (All Optional)

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Update merchant name |
| `ecomDetails` | object | Update platform details |
| `ecomDetails.platform` | string | Update platform (must exist in `ecommerce_details`) |
| `ecomDetails.accessKey` | string | Update access key |
| `businessRules` | object | Update business rules (replaces entire object) |

**Note:** When updating `ecomDetails`, you can provide just `platform` or just `accessKey`, and the other field will be preserved from existing data.

### Examples

**Update merchant name:**
```bash
curl -X PATCH http://localhost:3001/api/merchants/507f1f77bcf86cd799439011 \
  -H "Content-Type: application/json" \
  -d '{"name": "ACME Mega Store"}'
```

**Update only platform:**
```bash
curl -X PATCH http://localhost:3001/api/merchants/507f1f77bcf86cd799439011 \
  -H "Content-Type: application/json" \
  -d '{
    "ecomDetails": {
      "platform": "Shopify"
    }
  }'
```

**Update only access key:**
```bash
curl -X PATCH http://localhost:3001/api/merchants/507f1f77bcf86cd799439011 \
  -H "Content-Type: application/json" \
  -d '{
    "ecomDetails": {
      "accessKey": "new_token_abc123"
    }
  }'
```

**Update business rules:**
```bash
curl -X PATCH http://localhost:3001/api/merchants/507f1f77bcf86cd799439011 \
  -H "Content-Type: application/json" \
  -d '{
    "businessRules": {
      "min_order_value": 100,
      "vip_customer_discount": 15,
      "express_shipping_enabled": true
    }
  }'
```

### Response (200 OK)

```json
{
  "success": true,
  "message": "Merchant updated successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "ACME Store",
    "ecomDetails": {
      "platform": "BigCommerce",
      "accessKey": "abc123xyz789token"
    },
    "businessRules": {
      "min_order_value": 60,
      "free_shipping_threshold": 120,
      "tax_enabled": true,
      "loyalty_program_enabled": true
    },
    "createdAt": "2025-01-12T10:00:00.000Z",
    "updatedAt": "2025-01-12T13:00:00.000Z"
  }
}
```

### Error Responses

**400 Bad Request - Invalid ID**
```json
{
  "success": false,
  "error": "Invalid ID format",
  "message": "The provided ID is not a valid MongoDB ObjectId"
}
```

**400 Bad Request - No Fields to Update**
```json
{
  "success": false,
  "error": "No valid fields to update",
  "message": "Provide at least one field to update: name, ecomDetails, or businessRules"
}
```

**404 Not Found**
```json
{
  "success": false,
  "error": "Not found",
  "message": "Merchant with ID 507f1f77bcf86cd799439011 not found"
}
```

**400 Bad Request - Invalid Platform** (when updating platform)
```json
{
  "success": false,
  "error": "Invalid platform",
  "message": "Platform \"InvalidPlatform\" does not exist in ecommerce_details collection"
}
```

---

## 4. DELETE Merchant

Delete a merchant configuration by its MongoDB `_id`.

### Request

```bash
curl -X DELETE http://localhost:3001/api/merchants/507f1f77bcf86cd799439011
```

### Response (200 OK)

```json
{
  "success": true,
  "message": "Merchant deleted successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "ACME Store",
    "ecomDetails": {
      "platform": "BigCommerce",
      "accessKey": "abc123xyz789token"
    },
    "businessRules": {
      "min_order_value": 50,
      "free_shipping_threshold": 100,
      "tax_enabled": true
    },
    "createdAt": "2025-01-12T10:00:00.000Z",
    "updatedAt": "2025-01-12T10:00:00.000Z"
  }
}
```

### Error Responses

**400 Bad Request - Invalid ID**
```json
{
  "success": false,
  "error": "Invalid ID format",
  "message": "The provided ID is not a valid MongoDB ObjectId"
}
```

**404 Not Found**
```json
{
  "success": false,
  "error": "Not found",
  "message": "Merchant with ID 507f1f77bcf86cd799439011 not found"
}
```

---

## Complete Workflow Example

### Step 1: Check Available Platforms

First, verify which platforms are available:

```bash
curl http://localhost:3001/api/ecommerce-details?enabled=true
```

Response shows available platforms like "BigCommerce", "Shopify", etc.

### Step 2: Check Available Business Rules

Get valid business rule keys:

```bash
curl http://localhost:3001/api/rules
```

Response shows available rules like "min_order_value", "tax_enabled", etc.

### Step 3: Create a Merchant

```bash
curl -X POST http://localhost:3001/api/merchants \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Outdoor Gear Co",
    "ecomDetails": {
      "platform": "BigCommerce",
      "accessKey": "bc_live_token_xyz123"
    },
    "businessRules": {
      "min_order_value": 40,
      "free_shipping_threshold": 100,
      "tax_enabled": true,
      "gift_wrap_available": true,
      "loyalty_program_enabled": false
    }
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Merchant created successfully",
  "data": {
    "_id": "67890abcdef1234567890abc",
    "name": "Outdoor Gear Co",
    ...
  }
}
```

### Step 4: Get All Merchants

```bash
curl http://localhost:3001/api/merchants
```

### Step 5: Update Business Rules

```bash
curl -X PATCH http://localhost:3001/api/merchants/67890abcdef1234567890abc \
  -H "Content-Type: application/json" \
  -d '{
    "businessRules": {
      "min_order_value": 50,
      "free_shipping_threshold": 150,
      "tax_enabled": true,
      "gift_wrap_available": true,
      "loyalty_program_enabled": true,
      "express_shipping_enabled": true
    }
  }'
```

### Step 6: Change Platform

```bash
curl -X PATCH http://localhost:3001/api/merchants/67890abcdef1234567890abc \
  -H "Content-Type: application/json" \
  -d '{
    "ecomDetails": {
      "platform": "Shopify",
      "accessKey": "shpat_new_token_123"
    }
  }'
```

### Step 7: Delete the Merchant

```bash
curl -X DELETE http://localhost:3001/api/merchants/67890abcdef1234567890abc
```

---

## Using with JavaScript/TypeScript

### Fetch API (Browser/Node.js)

```javascript
const API_BASE = 'http://localhost:3001/api';

// Create new merchant
async function createMerchant(merchantData) {
  const response = await fetch(`${API_BASE}/merchants`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(merchantData),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Failed to create merchant');
  }

  return result.data;
}

// Usage
try {
  const newMerchant = await createMerchant({
    name: 'Sports Equipment Store',
    ecomDetails: {
      platform: 'BigCommerce',
      accessKey: 'bc_token_abc123',
    },
    businessRules: {
      min_order_value: 35,
      free_shipping_threshold: 80,
      tax_enabled: true,
    },
  });
  console.log('Created merchant:', newMerchant);
} catch (error) {
  console.error('Error:', error.message);
}

// Get all merchants
async function getAllMerchants() {
  const response = await fetch(`${API_BASE}/merchants`);
  const result = await response.json();
  return result.data;
}

// Update merchant
async function updateMerchant(id, updates) {
  const response = await fetch(`${API_BASE}/merchants/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updates),
  });

  return await response.json();
}

// Update business rules only
async function updateBusinessRules(merchantId, newRules) {
  return updateMerchant(merchantId, {
    businessRules: newRules,
  });
}

// Delete merchant
async function deleteMerchant(id) {
  const response = await fetch(`${API_BASE}/merchants/${id}`, {
    method: 'DELETE',
  });

  return await response.json();
}
```

### Axios

```javascript
import axios from 'axios';

const API_BASE = 'http://localhost:3001/api';

// Create merchant
const newMerchant = await axios.post(`${API_BASE}/merchants`, {
  name: 'Electronics Hub',
  ecomDetails: {
    platform: 'Shopify',
    accessKey: 'shpat_xyz789',
  },
  businessRules: {
    min_order_value: 25,
    express_shipping_enabled: true,
    warranty_available: true,
  },
});

// Get all merchants
const allMerchants = await axios.get(`${API_BASE}/merchants`);
console.log(allMerchants.data.data); // Array of merchants

// Update specific fields
const updated = await axios.patch(
  `${API_BASE}/merchants/507f1f77bcf86cd799439011`,
  {
    name: 'Electronics Hub Pro',
    businessRules: {
      min_order_value: 30,
      express_shipping_enabled: true,
      warranty_available: true,
      installation_service: true,
    },
  }
);

// Delete merchant
await axios.delete(`${API_BASE}/merchants/507f1f77bcf86cd799439011`);
```

### Error Handling Example

```javascript
async function createMerchantWithValidation(merchantData) {
  try {
    const response = await fetch(`${API_BASE}/merchants`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(merchantData),
    });

    const result = await response.json();

    if (!response.ok) {
      // Handle specific error cases
      if (response.status === 400) {
        if (result.error === 'Invalid platform') {
          console.error('Platform does not exist. Please create it first.');
        } else if (result.error === 'Invalid business rules') {
          console.error('Invalid rules:', result.invalidKeys);
          console.error('Valid rules are available at /api/rules');
        }
      } else if (response.status === 409) {
        console.error('Merchant with this name already exists');
      }

      throw new Error(result.message);
    }

    return result.data;
  } catch (error) {
    console.error('Failed to create merchant:', error.message);
    throw error;
  }
}
```

---

## Field Validation Rules

### name
- ✅ Required
- ✅ String
- ✅ Auto-trimmed (whitespace removed)

### ecomDetails.platform
- ✅ Required
- ✅ String
- ✅ Auto-trimmed
- ✅ **Must exist** in `ecommerce_details` collection

### ecomDetails.accessKey
- ✅ Required
- ✅ String
- ✅ Auto-trimmed
- ✅ Used for API authentication with the platform

### businessRules
- ✅ Required
- ✅ Must be an object (key-value pairs)
- ✅ At least one rule required
- ✅ **Keys must exist** in `rules` collection
- ✅ **Values** must be:
  - Boolean (`true` or `false`), OR
  - Number (must be >= 0)

---

## Common Use Cases

### 1. Multi-Merchant Management

```bash
# Create multiple merchants on different platforms
curl -X POST http://localhost:3001/api/merchants \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Fashion Store A",
    "ecomDetails": {"platform": "Shopify", "accessKey": "key1"},
    "businessRules": {"min_order_value": 30, "tax_enabled": true}
  }'

curl -X POST http://localhost:3001/api/merchants \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Fashion Store B",
    "ecomDetails": {"platform": "BigCommerce", "accessKey": "key2"},
    "businessRules": {"min_order_value": 50, "tax_enabled": true}
  }'

# Get all merchants
curl http://localhost:3001/api/merchants
```

### 2. Business Rule Configuration

```javascript
// Enable/disable features for a merchant
async function toggleFeature(merchantId, ruleName, enabled) {
  const merchant = await fetch(`${API_BASE}/merchants`)
    .then(r => r.json())
    .then(result => result.data.find(m => m._id === merchantId));

  const updatedRules = {
    ...merchant.businessRules,
    [ruleName]: enabled,
  };

  return updateMerchant(merchantId, { businessRules: updatedRules });
}

// Toggle loyalty program
await toggleFeature('507f1f77bcf86cd799439011', 'loyalty_program_enabled', true);
```

### 3. Platform Migration

```bash
# Step 1: Update platform
curl -X PATCH http://localhost:3001/api/merchants/507f1f77bcf86cd799439011 \
  -H "Content-Type: application/json" \
  -d '{
    "ecomDetails": {
      "platform": "Shopify",
      "accessKey": "shpat_migration_token_xyz"
    }
  }'

# Step 2: Verify update
curl http://localhost:3001/api/merchants/507f1f77bcf86cd799439011
```

---

## Validation Flow

When creating or updating a merchant, the following validations occur in order:

1. **Required Field Check**: Ensures `name`, `ecomDetails.platform`, `ecomDetails.accessKey`, and `businessRules` are present
2. **Platform Validation**: Verifies the platform exists in `ecommerce_details` collection
3. **Business Rule Key Validation**: Checks that all rule keys exist in `rules` collection
4. **Business Rule Value Validation**: Ensures values are boolean or non-negative numbers
5. **Database Save**: Saves the merchant to the database

Any validation failure returns a 400 Bad Request with details about the issue.

---

## Integration with Other APIs

### Workflow: Create Platform → Create Rules → Create Merchant

```bash
# 1. Create a new platform
curl -X POST http://localhost:3001/api/ecommerce-details \
  -H "Content-Type: application/json" \
  -d '{
    "name": "CustomPlatform",
    "api_version": "v1",
    "enabled": true
  }'

# 2. Create business rules
curl -X POST http://localhost:3001/api/rules \
  -H "Content-Type: application/json" \
  -d '{
    "key": "custom_feature_enabled",
    "value": true,
    "description": "Enable custom feature"
  }'

# 3. Create merchant using the new platform and rule
curl -X POST http://localhost:3001/api/merchants \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My Store",
    "ecomDetails": {
      "platform": "CustomPlatform",
      "accessKey": "custom_key_123"
    },
    "businessRules": {
      "custom_feature_enabled": true
    }
  }'
```

---

## Testing with Postman

### Import Collection

1. **Base URL**: `http://localhost:3001/api`
2. **Environment Variables**:
   - `BASE_URL`: `http://localhost:3001/api`
   - `MERCHANT_ID`: Copy from GET response

### Test Workflow

1. **GET** `/ecommerce-details` → Note available platforms
2. **GET** `/rules` → Note available business rules
3. **POST** `/merchants` → Create merchant (save `_id`)
4. **GET** `/merchants` → Verify creation
5. **PATCH** `/merchants/:id` → Update business rules
6. **GET** `/merchants/:id` (via GET all and filter) → Verify update
7. **DELETE** `/merchants/:id` → Remove merchant
8. **GET** `/merchants` → Verify deletion

---

## Troubleshooting

### "Merchant name is required"
- Ensure `name` field is in request body
- Check Content-Type header is `application/json`

### "Platform does not exist in ecommerce_details collection"
- List available platforms: `GET /api/ecommerce-details`
- Create the platform first if needed: `POST /api/ecommerce-details`
- Verify spelling matches exactly (case-sensitive)

### "Invalid rule keys"
- List available rules: `GET /api/rules`
- Create missing rules first: `POST /api/rules`
- Check for typos in rule key names

### "Invalid business rule values"
- Ensure values are boolean (`true`/`false`) or numbers
- Numbers must be >= 0 (no negative values)
- Avoid using strings for numeric values

### "Invalid ID format"
- MongoDB ObjectId must be 24 hex characters
- Copy the `_id` exactly from GET response
- Don't use custom IDs or other identifiers

---

## Related Documentation

- **E-commerce Platforms**: See `API_USAGE_GUIDE.md`
- **Business Rules**: See `RULES_API_GUIDE.md`
- **MongoDB Setup**: See `README_MONGODB_SETUP.md`
- **Security**: See `SECURITY.md`
- **Deployment**: See `VERCEL_DEPLOYMENT.md`
