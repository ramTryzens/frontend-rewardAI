# Rules API - Complete Guide

Full CRUD API documentation for managing business rules in the `RuleEntriesTable` collection.

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

## Collection Structure

### RuleEntriesTable Schema

```javascript
{
  _id: ObjectId,           // MongoDB unique identifier (auto-generated)
  id: Number,              // Numeric business logic ID (unique, required)
  key: String,             // Rule key name (uppercase, required)
  enabled: Boolean,        // Rule status (default: true)
  createdAt: Date,         // Auto-generated timestamp
  updatedAt: Date          // Auto-updated timestamp
}
```

### Default Rules

On first startup, these rules are automatically created:

```json
[
  { "id": 1, "key": "ALLOW_CART_DISC", "enabled": true },
  { "id": 2, "key": "MAX_CART_DISC_OFF_%", "enabled": false },
  { "id": 3, "key": "ALLOW_CART_BIDDING", "enabled": false }
]
```

---

## Endpoints Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/rules` | Get all rules |
| GET | `/rules?enabled=true` | Get only enabled rules |
| POST | `/rules` | Create new rule |
| PATCH | `/rules/:id` | Update rule by numeric ID |
| DELETE | `/rules/:id` | Delete rule by numeric ID |

---

## 1. GET All Rules

Retrieve all business rules.

### Request

```bash
curl http://localhost:3001/api/rules
```

### Query Parameters (Optional)

| Parameter | Type | Description |
|-----------|------|-------------|
| `enabled` | boolean | Filter by enabled status (`true` or `false`) |

**Examples:**
```bash
# Get all rules
curl http://localhost:3001/api/rules

# Get only enabled rules
curl http://localhost:3001/api/rules?enabled=true

# Get only disabled rules
curl http://localhost:3001/api/rules?enabled=false
```

### Response (200 OK)

```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "_id": "67890abcdef1234567890abc",
      "id": 1,
      "key": "ALLOW_CART_DISC",
      "enabled": true,
      "createdAt": "2025-01-12T10:00:00.000Z",
      "updatedAt": "2025-01-12T10:00:00.000Z"
    },
    {
      "_id": "67890abcdef1234567890abd",
      "id": 2,
      "key": "MAX_CART_DISC_OFF_%",
      "enabled": false,
      "createdAt": "2025-01-12T10:00:00.000Z",
      "updatedAt": "2025-01-12T10:00:00.000Z"
    },
    {
      "_id": "67890abcdef1234567890abe",
      "id": 3,
      "key": "ALLOW_CART_BIDDING",
      "enabled": false,
      "createdAt": "2025-01-12T10:00:00.000Z",
      "updatedAt": "2025-01-12T10:00:00.000Z"
    }
  ]
}
```

---

## 2. POST Create New Rule

Create a new business rule.

### Request

```bash
curl -X POST http://localhost:3001/api/rules \
  -H "Content-Type: application/json" \
  -d '{
    "id": 4,
    "key": "ALLOW_FREE_SHIPPING",
    "enabled": true
  }'
```

### Request Body

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `id` | number | ✅ Yes | - | Numeric ID (must be unique integer) |
| `key` | string | ✅ Yes | - | Rule key (will be uppercased) |
| `enabled` | boolean | No | `true` | Whether rule is active |

**Important Notes:**
- `id` must be a unique integer
- `key` is automatically converted to uppercase
- MongoDB `_id` is auto-generated (not editable)

### Response (201 Created)

```json
{
  "success": true,
  "message": "Rule created successfully",
  "data": {
    "_id": "67890abcdef1234567890abf",
    "id": 4,
    "key": "ALLOW_FREE_SHIPPING",
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
  "message": "Both \"id\" (numeric) and \"key\" are required"
}
```

**400 Bad Request - Invalid ID Format**
```json
{
  "success": false,
  "error": "Invalid id format",
  "message": "The \"id\" field must be an integer"
}
```

**409 Conflict - Duplicate ID**
```json
{
  "success": false,
  "error": "Duplicate entry",
  "message": "A rule with id 4 already exists"
}
```

---

## 3. PATCH Update Rule

Update an existing rule by its **numeric `id`** (not MongoDB `_id`).

### Request

```bash
curl -X PATCH http://localhost:3001/api/rules/1 \
  -H "Content-Type: application/json" \
  -d '{
    "enabled": false
  }'
```

### URL Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | number | Numeric ID of the rule |

### Request Body (All Optional)

| Field | Type | Description |
|-------|------|-------------|
| `key` | string | Update rule key |
| `enabled` | boolean | Enable/disable rule |

**Note:** Only the fields you include will be updated. The `id` field cannot be changed.

### Examples

**Disable a rule:**
```bash
curl -X PATCH http://localhost:3001/api/rules/2 \
  -H "Content-Type: application/json" \
  -d '{"enabled": false}'
```

**Update rule key:**
```bash
curl -X PATCH http://localhost:3001/api/rules/2 \
  -H "Content-Type: application/json" \
  -d '{"key": "MAX_DISCOUNT_PERCENTAGE"}'
```

**Update both fields:**
```bash
curl -X PATCH http://localhost:3001/api/rules/3 \
  -H "Content-Type: application/json" \
  -d '{
    "key": "ENABLE_CART_BIDDING",
    "enabled": true
  }'
```

### Response (200 OK)

```json
{
  "success": true,
  "message": "Rule updated successfully",
  "data": {
    "_id": "67890abcdef1234567890abc",
    "id": 1,
    "key": "ALLOW_CART_DISC",
    "enabled": false,
    "createdAt": "2025-01-12T10:00:00.000Z",
    "updatedAt": "2025-01-12T13:00:00.000Z"
  }
}
```

### Error Responses

**400 Bad Request - Invalid ID Format**
```json
{
  "success": false,
  "error": "Invalid ID format",
  "message": "The provided ID must be a numeric value"
}
```

**400 Bad Request - No Valid Fields**
```json
{
  "success": false,
  "error": "No valid fields to update",
  "message": "Allowed fields are: key, enabled"
}
```

**404 Not Found**
```json
{
  "success": false,
  "error": "Not found",
  "message": "Rule with id 99 not found"
}
```

---

## 4. DELETE Rule

Delete a rule by its **numeric `id`** (not MongoDB `_id`).

### Request

```bash
curl -X DELETE http://localhost:3001/api/rules/4
```

### URL Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | number | Numeric ID of the rule |

### Response (200 OK)

```json
{
  "success": true,
  "message": "Rule deleted successfully",
  "data": {
    "_id": "67890abcdef1234567890abf",
    "id": 4,
    "key": "ALLOW_FREE_SHIPPING",
    "enabled": true,
    "createdAt": "2025-01-12T12:00:00.000Z",
    "updatedAt": "2025-01-12T12:00:00.000Z"
  }
}
```

### Error Responses

**400 Bad Request - Invalid ID Format**
```json
{
  "success": false,
  "error": "Invalid ID format",
  "message": "The provided ID must be a numeric value"
}
```

**404 Not Found**
```json
{
  "success": false,
  "error": "Not found",
  "message": "Rule with id 4 not found"
}
```

---

## Complete Workflow Example

### Step 1: Get All Rules

```bash
curl http://localhost:3001/api/rules
```

**Response:**
```json
{
  "success": true,
  "count": 3,
  "data": [
    { "id": 1, "key": "ALLOW_CART_DISC", "enabled": true },
    { "id": 2, "key": "MAX_CART_DISC_OFF_%", "enabled": false },
    { "id": 3, "key": "ALLOW_CART_BIDDING", "enabled": false }
  ]
}
```

### Step 2: Create New Rule

```bash
curl -X POST http://localhost:3001/api/rules \
  -H "Content-Type: application/json" \
  -d '{
    "id": 4,
    "key": "ENABLE_LOYALTY_POINTS",
    "enabled": true
  }'
```

### Step 3: Enable a Disabled Rule

```bash
curl -X PATCH http://localhost:3001/api/rules/2 \
  -H "Content-Type: application/json" \
  -d '{"enabled": true}'
```

### Step 4: Get Only Enabled Rules

```bash
curl http://localhost:3001/api/rules?enabled=true
```

**Response:**
```json
{
  "success": true,
  "count": 3,
  "data": [
    { "id": 1, "key": "ALLOW_CART_DISC", "enabled": true },
    { "id": 2, "key": "MAX_CART_DISC_OFF_%", "enabled": true },
    { "id": 4, "key": "ENABLE_LOYALTY_POINTS", "enabled": true }
  ]
}
```

### Step 5: Delete a Rule

```bash
curl -X DELETE http://localhost:3001/api/rules/4
```

---

## Using with JavaScript/TypeScript

### Fetch API

```javascript
const API_BASE = 'http://localhost:3001/api';

// Get all rules
async function getAllRules() {
  const response = await fetch(`${API_BASE}/rules`);
  const data = await response.json();
  return data.data; // Array of rules
}

// Get only enabled rules
async function getEnabledRules() {
  const response = await fetch(`${API_BASE}/rules?enabled=true`);
  const data = await response.json();
  return data.data;
}

// Create new rule
async function createRule(id, key, enabled = true) {
  const response = await fetch(`${API_BASE}/rules`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, key, enabled }),
  });
  return await response.json();
}

// Toggle rule (enable/disable)
async function toggleRule(id, enabled) {
  const response = await fetch(`${API_BASE}/rules/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ enabled }),
  });
  return await response.json();
}

// Update rule key
async function updateRuleKey(id, newKey) {
  const response = await fetch(`${API_BASE}/rules/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ key: newKey }),
  });
  return await response.json();
}

// Delete rule
async function deleteRule(id) {
  const response = await fetch(`${API_BASE}/rules/${id}`, {
    method: 'DELETE',
  });
  return await response.json();
}

// Usage examples
const rules = await getAllRules();
console.log(rules);

await createRule(5, 'ALLOW_BULK_DISCOUNT', true);
await toggleRule(2, true);
await deleteRule(5);
```

### Axios

```javascript
import axios from 'axios';

const API_BASE = 'http://localhost:3001/api/rules';

// Get all rules
const allRules = await axios.get(API_BASE);

// Get enabled only
const enabledRules = await axios.get(`${API_BASE}?enabled=true`);

// Create
const newRule = await axios.post(API_BASE, {
  id: 6,
  key: 'ENABLE_GIFT_WRAPPING',
  enabled: true,
});

// Update
const updated = await axios.patch(`${API_BASE}/1`, {
  enabled: false,
});

// Delete
const deleted = await axios.delete(`${API_BASE}/6`);
```

---

## React Hook Example

```typescript
import { useState, useEffect } from 'react';

interface Rule {
  _id: string;
  id: number;
  key: string;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

function useRules() {
  const [rules, setRules] = useState<Rule[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRules();
  }, []);

  async function fetchRules() {
    try {
      const response = await fetch('/api/rules');
      const data = await response.json();
      setRules(data.data);
    } catch (error) {
      console.error('Failed to fetch rules:', error);
    } finally {
      setLoading(false);
    }
  }

  async function toggleRule(id: number, enabled: boolean) {
    await fetch(`/api/rules/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ enabled }),
    });
    await fetchRules(); // Refresh
  }

  async function createRule(id: number, key: string, enabled: boolean) {
    await fetch('/api/rules', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, key, enabled }),
    });
    await fetchRules();
  }

  async function deleteRule(id: number) {
    await fetch(`/api/rules/${id}`, { method: 'DELETE' });
    await fetchRules();
  }

  return { rules, loading, toggleRule, createRule, deleteRule };
}

// Usage in component
function RulesManager() {
  const { rules, loading, toggleRule } = useRules();

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {rules.map((rule) => (
        <div key={rule.id}>
          <span>{rule.key}</span>
          <button onClick={() => toggleRule(rule.id, !rule.enabled)}>
            {rule.enabled ? 'Disable' : 'Enable'}
          </button>
        </div>
      ))}
    </div>
  );
}
```

---

## Field Validation Rules

### id
- ✅ Required
- ✅ Must be an integer
- ✅ Must be unique
- ❌ Cannot be updated after creation

### key
- ✅ Required
- ✅ String
- ✅ Auto-uppercased
- ✅ Auto-trimmed (whitespace removed)

### enabled
- ❌ Optional (defaults to `true`)
- ✅ Must be boolean (`true` or `false`)

---

## Common Use Cases

### 1. Feature Flags

```javascript
// Check if feature is enabled
async function isFeatureEnabled(featureKey) {
  const response = await fetch(`/api/rules?enabled=true`);
  const { data } = await response.json();
  return data.some(rule => rule.key === featureKey);
}

// Usage
if (await isFeatureEnabled('ALLOW_CART_DISC')) {
  showDiscountOptions();
}
```

### 2. Configuration Management

```javascript
// Get all active rules for app configuration
async function getActiveConfig() {
  const response = await fetch('/api/rules?enabled=true');
  const { data } = await response.json();

  const config = {};
  data.forEach(rule => {
    config[rule.key] = rule.enabled;
  });

  return config;
}

// Usage
const config = await getActiveConfig();
if (config.ALLOW_CART_BIDDING) {
  enableBiddingFeature();
}
```

### 3. Admin Panel

```javascript
// Admin dashboard to manage all rules
async function loadAdminPanel() {
  const rules = await fetch('/api/rules').then(r => r.json());

  rules.data.forEach(rule => {
    renderRuleToggle(rule.id, rule.key, rule.enabled);
  });
}
```

---

## Key Differences from Ecommerce Details

| Feature | Ecommerce Details | Rules API |
|---------|------------------|-----------|
| Identifier | MongoDB `_id` | Numeric `id` |
| Update by | `_id` (24-char hex) | `id` (integer) |
| Delete by | `_id` (24-char hex) | `id` (integer) |
| Key field | `name` (mixed case) | `key` (uppercase) |
| Complex data | `api_urls` object | None (simple KV) |

---

## Troubleshooting

### "Missing required fields"
- Ensure both `id` (number) and `key` (string) are in request body
- Check Content-Type header is `application/json`

### "Invalid id format"
- The `id` must be a number (integer)
- Use `1`, not `"1"` (numeric, not string)

### "Duplicate entry"
- Each `id` must be unique
- Choose a different numeric ID
- Query existing rules first to find available IDs

### "Rule with id X not found"
- The rule doesn't exist in the database
- Use GET `/api/rules` to see all available IDs
- Ensure you're using the numeric `id`, not MongoDB `_id`

---

## Testing with Postman

### Collection Setup

1. **Base URL:** `http://localhost:3001/api/rules`

2. **Environment Variables:**
   - `BASE_URL`: `http://localhost:3001/api`
   - `RULE_ID`: `1` (copy from GET response)

3. **Test Requests:**

   **GET All Rules**
   - Method: GET
   - URL: `{{BASE_URL}}/rules`

   **GET Enabled Only**
   - Method: GET
   - URL: `{{BASE_URL}}/rules?enabled=true`

   **POST Create Rule**
   - Method: POST
   - URL: `{{BASE_URL}}/rules`
   - Body (JSON):
     ```json
     {
       "id": 10,
       "key": "TEST_RULE",
       "enabled": true
     }
     ```

   **PATCH Update Rule**
   - Method: PATCH
   - URL: `{{BASE_URL}}/rules/{{RULE_ID}}`
   - Body (JSON):
     ```json
     {
       "enabled": false
     }
     ```

   **DELETE Rule**
   - Method: DELETE
   - URL: `{{BASE_URL}}/rules/{{RULE_ID}}`

---

## Next Steps

- Check `README_MONGODB_SETUP.md` for database configuration
- Check `VERCEL_DEPLOYMENT.md` for production deployment
- Check `API_USAGE_GUIDE.md` for ecommerce details API

---

## Summary

The Rules API provides a simple, numeric ID-based CRUD interface for managing business rules. Key features:

- ✅ Numeric ID for business logic (separate from MongoDB `_id`)
- ✅ Auto-initialization with default rules on startup
- ✅ Full CRUD operations (GET, POST, PATCH, DELETE)
- ✅ Filter by enabled status
- ✅ Automatic key uppercasing
- ✅ Works both locally (Express) and on Vercel (serverless)
- ✅ Clean, consistent error handling
