# API Usage Guide - Ecommerce Details

Complete guide for managing e-commerce platform configurations via API.

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
| GET | `/ecommerce-details` | Get all configurations |
| GET | `/ecommerce-details?enabled=true` | Get only enabled configurations |
| POST | `/ecommerce-details` | Create new configuration |
| PATCH | `/ecommerce-details/:id` | Update existing configuration |
| DELETE | `/ecommerce-details/:id` | Delete configuration |

---

## 1. GET All Ecommerce Details

Retrieve all e-commerce platform configurations.

### Request

```bash
curl http://localhost:3001/api/ecommerce-details
```

### Query Parameters (Optional)

| Parameter | Type | Description |
|-----------|------|-------------|
| `enabled` | boolean | Filter by enabled status (`true` or `false`) |

**Examples:**
```bash
# Get only enabled platforms
curl http://localhost:3001/api/ecommerce-details?enabled=true

# Get only disabled platforms
curl http://localhost:3001/api/ecommerce-details?enabled=false
```

### Response (200 OK)

```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "BigCommerce",
      "api_version": "V3",
      "api_urls": {
        "cart": {
          "endpoint": "/cart",
          "method": "POST"
        },
        "customer": {
          "endpoint": "/customer",
          "method": "GET"
        }
      },
      "enabled": true,
      "createdAt": "2025-01-12T10:00:00.000Z",
      "updatedAt": "2025-01-12T10:00:00.000Z"
    },
    {
      "_id": "507f1f77bcf86cd799439012",
      "name": "Shopify",
      "api_version": "2024-01",
      "api_urls": {
        "orders": {
          "endpoint": "/admin/api/2024-01/orders.json",
          "method": "GET"
        },
        "products": {
          "endpoint": "/admin/api/2024-01/products.json",
          "method": "GET"
        }
      },
      "enabled": false,
      "createdAt": "2025-01-12T11:00:00.000Z",
      "updatedAt": "2025-01-12T11:00:00.000Z"
    }
  ]
}
```

---

## 2. POST Create New Ecommerce Detail

Create a new e-commerce platform configuration.

### Request

```bash
curl -X POST http://localhost:3001/api/ecommerce-details \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Shopify",
    "api_version": "2024-01",
    "api_urls": {
      "orders": {
        "endpoint": "/admin/api/2024-01/orders.json",
        "method": "GET"
      },
      "products": {
        "endpoint": "/admin/api/2024-01/products.json",
        "method": "GET"
      }
    },
    "enabled": true
  }'
```

### Request Body

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `name` | string | ✅ Yes | - | Platform name (e.g., "Shopify", "WooCommerce") |
| `api_version` | string | ✅ Yes | - | API version (e.g., "V3", "2024-01") |
| `api_urls` | object | No | `{}` | Map of API endpoint configurations |
| `enabled` | boolean | No | `true` | Whether this platform is active |

**api_urls Structure:**
```json
{
  "endpoint_name": {
    "endpoint": "/path/to/endpoint",
    "method": "GET|POST|PUT|PATCH|DELETE"
  }
}
```

### Response (201 Created)

```json
{
  "success": true,
  "message": "Ecommerce detail created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "name": "Shopify",
    "api_version": "2024-01",
    "api_urls": {
      "orders": {
        "endpoint": "/admin/api/2024-01/orders.json",
        "method": "GET"
      },
      "products": {
        "endpoint": "/admin/api/2024-01/products.json",
        "method": "GET"
      }
    },
    "enabled": true,
    "createdAt": "2025-01-12T12:00:00.000Z",
    "updatedAt": "2025-01-12T12:00:00.000Z"
  }
}
```

### Error Responses

**400 Bad Request - Missing Required Fields**
```json
{
  "success": false,
  "error": "Missing required fields",
  "message": "Both \"name\" and \"api_version\" are required"
}
```

**400 Bad Request - Invalid api_urls Format**
```json
{
  "success": false,
  "error": "Invalid api_urls format",
  "message": "Each API URL entry must have 'endpoint' and 'method' properties. Issue with key: orders"
}
```

**400 Bad Request - Invalid HTTP Method**
```json
{
  "success": false,
  "error": "Invalid HTTP method",
  "message": "Method must be one of: GET, POST, PUT, PATCH, DELETE"
}
```

**409 Conflict - Duplicate Entry**
```json
{
  "success": false,
  "error": "Duplicate entry",
  "message": "An ecommerce detail with this name already exists"
}
```

---

## 3. PATCH Update Ecommerce Detail

Update an existing e-commerce platform configuration by its MongoDB `_id`.

### Request

```bash
curl -X PATCH http://localhost:3001/api/ecommerce-details/507f1f77bcf86cd799439011 \
  -H "Content-Type: application/json" \
  -d '{
    "enabled": false
  }'
```

### Request Body (All Optional)

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Platform name |
| `api_version` | string | API version |
| `api_urls` | object | API endpoint configurations |
| `enabled` | boolean | Enable/disable platform |

**Note:** Only the fields you include will be updated. Other fields remain unchanged.

### Examples

**Disable a platform:**
```bash
curl -X PATCH http://localhost:3001/api/ecommerce-details/507f1f77bcf86cd799439011 \
  -H "Content-Type: application/json" \
  -d '{"enabled": false}'
```

**Update API version:**
```bash
curl -X PATCH http://localhost:3001/api/ecommerce-details/507f1f77bcf86cd799439011 \
  -H "Content-Type: application/json" \
  -d '{"api_version": "V4"}'
```

**Add new API endpoint:**
```bash
curl -X PATCH http://localhost:3001/api/ecommerce-details/507f1f77bcf86cd799439011 \
  -H "Content-Type: application/json" \
  -d '{
    "api_urls": {
      "cart": {
        "endpoint": "/cart",
        "method": "POST"
      },
      "customer": {
        "endpoint": "/customer",
        "method": "GET"
      },
      "orders": {
        "endpoint": "/orders",
        "method": "GET"
      }
    }
  }'
```

### Response (200 OK)

```json
{
  "success": true,
  "message": "Ecommerce detail updated successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "BigCommerce",
    "api_version": "V3",
    "api_urls": {
      "cart": {
        "endpoint": "/cart",
        "method": "POST"
      },
      "customer": {
        "endpoint": "/customer",
        "method": "GET"
      }
    },
    "enabled": false,
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

**404 Not Found**
```json
{
  "success": false,
  "error": "Not found",
  "message": "Ecommerce detail with ID 507f1f77bcf86cd799439011 not found"
}
```

---

## 4. DELETE Ecommerce Detail

Delete an e-commerce platform configuration by its MongoDB `_id`.

### Request

```bash
curl -X DELETE http://localhost:3001/api/ecommerce-details/507f1f77bcf86cd799439011
```

### Response (200 OK)

```json
{
  "success": true,
  "message": "Ecommerce detail deleted successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "BigCommerce",
    "api_version": "V3",
    "api_urls": {
      "cart": {
        "endpoint": "/cart",
        "method": "POST"
      },
      "customer": {
        "endpoint": "/customer",
        "method": "GET"
      }
    },
    "enabled": true,
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
  "message": "Ecommerce detail with ID 507f1f77bcf86cd799439011 not found"
}
```

---

## Complete Workflow Example

### Step 1: Create a New Platform

```bash
curl -X POST http://localhost:3001/api/ecommerce-details \
  -H "Content-Type: application/json" \
  -d '{
    "name": "WooCommerce",
    "api_version": "v3",
    "api_urls": {
      "products": {
        "endpoint": "/wp-json/wc/v3/products",
        "method": "GET"
      },
      "orders": {
        "endpoint": "/wp-json/wc/v3/orders",
        "method": "GET"
      }
    },
    "enabled": true
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Ecommerce detail created successfully",
  "data": {
    "_id": "67890abcdef1234567890abc",
    "name": "WooCommerce",
    "api_version": "v3",
    "api_urls": { ... },
    "enabled": true,
    "createdAt": "2025-01-12T14:00:00.000Z",
    "updatedAt": "2025-01-12T14:00:00.000Z"
  }
}
```

### Step 2: Get All Platforms

```bash
curl http://localhost:3001/api/ecommerce-details
```

### Step 3: Disable the Platform

```bash
curl -X PATCH http://localhost:3001/api/ecommerce-details/67890abcdef1234567890abc \
  -H "Content-Type: application/json" \
  -d '{"enabled": false}'
```

### Step 4: Get Only Enabled Platforms

```bash
curl http://localhost:3001/api/ecommerce-details?enabled=true
```

### Step 5: Delete the Platform

```bash
curl -X DELETE http://localhost:3001/api/ecommerce-details/67890abcdef1234567890abc
```

---

## Using with JavaScript/TypeScript

### Fetch API (Browser/Node.js)

```javascript
// Create new ecommerce detail
async function createEcommerceDetail() {
  const response = await fetch('http://localhost:3001/api/ecommerce-details', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: 'Magento',
      api_version: '2.4',
      api_urls: {
        products: {
          endpoint: '/rest/V1/products',
          method: 'GET',
        },
        orders: {
          endpoint: '/rest/V1/orders',
          method: 'GET',
        },
      },
      enabled: true,
    }),
  });

  const data = await response.json();
  console.log(data);
}

// Get all enabled platforms
async function getEnabledPlatforms() {
  const response = await fetch(
    'http://localhost:3001/api/ecommerce-details?enabled=true'
  );
  const data = await response.json();
  console.log(data.data); // Array of enabled platforms
}

// Toggle enabled status
async function togglePlatform(id, enabled) {
  const response = await fetch(
    `http://localhost:3001/api/ecommerce-details/${id}`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ enabled }),
    }
  );

  const data = await response.json();
  return data.data;
}

// Delete platform
async function deletePlatform(id) {
  const response = await fetch(
    `http://localhost:3001/api/ecommerce-details/${id}`,
    {
      method: 'DELETE',
    }
  );

  return await response.json();
}
```

### Axios

```javascript
import axios from 'axios';

const API_BASE = 'http://localhost:3001/api';

// Create
const newPlatform = await axios.post(`${API_BASE}/ecommerce-details`, {
  name: 'PrestaShop',
  api_version: '1.7',
  api_urls: {
    products: { endpoint: '/api/products', method: 'GET' },
  },
  enabled: true,
});

// Get all
const allPlatforms = await axios.get(`${API_BASE}/ecommerce-details`);

// Get filtered
const enabledOnly = await axios.get(
  `${API_BASE}/ecommerce-details?enabled=true`
);

// Update
const updated = await axios.patch(
  `${API_BASE}/ecommerce-details/507f1f77bcf86cd799439011`,
  { enabled: false }
);

// Delete
const deleted = await axios.delete(
  `${API_BASE}/ecommerce-details/507f1f77bcf86cd799439011`
);
```

---

## Field Validation Rules

### name
- ✅ Required
- ✅ String
- ✅ Auto-trimmed (whitespace removed)

### api_version
- ✅ Required
- ✅ String
- ✅ Auto-trimmed

### api_urls
- ❌ Optional (defaults to `{}`)
- ✅ Must be an object/map
- ✅ Each entry must have:
  - `endpoint` (string)
  - `method` (one of: GET, POST, PUT, PATCH, DELETE)

### enabled
- ❌ Optional (defaults to `true`)
- ✅ Must be boolean (`true` or `false`)

---

## Common Use Cases

### 1. Managing Multiple Platforms

```bash
# Create multiple platforms
curl -X POST http://localhost:3001/api/ecommerce-details \
  -H "Content-Type: application/json" \
  -d '{"name": "Shopify", "api_version": "2024-01", "enabled": true}'

curl -X POST http://localhost:3001/api/ecommerce-details \
  -H "Content-Type: application/json" \
  -d '{"name": "WooCommerce", "api_version": "v3", "enabled": true}'

# Get only enabled platforms for active integrations
curl http://localhost:3001/api/ecommerce-details?enabled=true
```

### 2. Feature Flags

Use `enabled` field as a feature flag:

```javascript
// Frontend code
async function loadActivePlatforms() {
  const response = await fetch('/api/ecommerce-details?enabled=true');
  const { data } = await response.json();

  // Only show UI for enabled platforms
  data.forEach(platform => {
    renderPlatformCard(platform);
  });
}
```

### 3. A/B Testing

```bash
# Disable old version
curl -X PATCH http://localhost:3001/api/ecommerce-details/{old_id} \
  -H "Content-Type: application/json" \
  -d '{"enabled": false}'

# Enable new version
curl -X PATCH http://localhost:3001/api/ecommerce-details/{new_id} \
  -H "Content-Type: application/json" \
  -d '{"enabled": true}'
```

---

## Testing with Postman

1. Import this collection:
   - Base URL: `http://localhost:3001/api`
   - Create requests for GET, POST, PATCH, DELETE

2. Environment variables:
   - `BASE_URL`: `http://localhost:3001/api`
   - `PLATFORM_ID`: Copy from GET response

3. Test workflow:
   - POST → Create (save the returned `_id`)
   - GET → Verify creation
   - PATCH → Update `enabled` to `false`
   - GET with `?enabled=true` → Should not include disabled platform
   - DELETE → Remove platform

---

## Troubleshooting

### "Missing required fields"
- Ensure both `name` and `api_version` are in request body
- Check Content-Type header is `application/json`

### "Invalid ID format"
- MongoDB ObjectId must be 24 hex characters
- Copy the `_id` exactly from GET response

### "Method not allowed"
- Check you're using correct HTTP method (GET, POST, PATCH, DELETE)
- OPTIONS requests are handled automatically for CORS

### "MONGODB_URI is not defined"
- Add MongoDB connection string to `.env` file
- Restart the server after adding environment variables

---

## Next Steps

- Check `README_MONGODB_SETUP.md` for database setup
- Check `VERCEL_DEPLOYMENT.md` for production deployment
- Check `SECURITY.md` for security best practices
