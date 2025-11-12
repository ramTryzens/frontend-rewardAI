# MongoDB Atlas Backend API Setup

This guide explains the MongoDB Atlas integration and API endpoints for managing e-commerce platform configurations.

## Project Structure

```
gradient-cart-viewer/
├── config/
│   ├── database.js          # MongoDB connection handler
│   └── initializeDB.js      # Database initialization logic
├── models/
│   └── EcommerceDetail.js   # Mongoose schema for ecommerce_details
├── routes/
│   └── ecommerceDetails.js  # API routes (GET, PATCH, DELETE)
└── server.js                # Main Express server
```

## Setup Instructions

### 1. Install Dependencies

Dependencies are already installed via `package.json`:
- `mongoose` - MongoDB ODM for Node.js
- `express` - Web framework
- `cors` - Cross-origin resource sharing
- `dotenv` - Environment variable management

### 2. Configure MongoDB Atlas Credentials

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Add your MongoDB Atlas connection string to `.env`:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/your_database_name?retryWrites=true&w=majority
   ```

   **How to get your MongoDB URI:**
   - Log into [MongoDB Atlas](https://cloud.mongodb.com/)
   - Navigate to your cluster
   - Click "Connect" → "Connect your application"
   - Copy the connection string
   - Replace `<username>`, `<password>`, and `<database>` with your actual values

### 3. Start the Server

```bash
npm run dev
```

The server will:
1. Connect to MongoDB Atlas
2. Check if the `ecommerce_details` collection exists
3. If empty, insert the default configuration:
   ```json
   {
     "name": "BigCommerce",
     "api_version": "V3",
     "api_urls": {
       "cart": { "endpoint": "/cart", "method": "POST" },
       "customer": { "endpoint": "/customer", "method": "GET" }
     }
   }
   ```

## API Endpoints

### GET /api/ecommerce-details
Retrieve all e-commerce platform configurations.

**Response:**
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "BigCommerce",
      "api_version": "V3",
      "api_urls": {
        "cart": { "endpoint": "/cart", "method": "POST" },
        "customer": { "endpoint": "/customer", "method": "GET" }
      },
      "createdAt": "2025-01-10T12:00:00.000Z",
      "updatedAt": "2025-01-10T12:00:00.000Z"
    }
  ]
}
```

### PATCH /api/ecommerce-details/:id
Update a specific configuration by its MongoDB `_id`.

**Allowed Fields:**
- `name` (string)
- `api_version` (string)
- `api_urls` (object with endpoint/method pairs)

**Request Example:**
```bash
curl -X PATCH http://localhost:3001/api/ecommerce-details/507f1f77bcf86cd799439011 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Shopify",
    "api_version": "2024-01",
    "api_urls": {
      "orders": { "endpoint": "/admin/api/2024-01/orders.json", "method": "GET" },
      "products": { "endpoint": "/admin/api/2024-01/products.json", "method": "GET" }
    }
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Ecommerce detail updated successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Shopify",
    "api_version": "2024-01",
    "api_urls": { ... },
    "updatedAt": "2025-01-10T13:00:00.000Z"
  }
}
```

### DELETE /api/ecommerce-details/:id
Delete a specific configuration by its MongoDB `_id`.

**Request Example:**
```bash
curl -X DELETE http://localhost:3001/api/ecommerce-details/507f1f77bcf86cd799439011
```

**Response:**
```json
{
  "success": true,
  "message": "Ecommerce detail deleted successfully",
  "data": { ... }
}
```

## Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": "Error type",
  "message": "Detailed error message"
}
```

**Common Error Cases:**
- **400 Bad Request** - Invalid ID format, missing required fields, or validation errors
- **404 Not Found** - Document with specified ID doesn't exist
- **500 Internal Server Error** - Database connection issues or unexpected errors

## Data Validation

The API validates:
- MongoDB ObjectId format for all ID parameters
- Only allowed fields can be updated (prevents unwanted field modifications)
- `api_urls` structure requires `endpoint` and `method` for each entry
- HTTP methods must be: GET, POST, PUT, PATCH, or DELETE

## Health Check

Check server and database status:

```bash
curl http://localhost:3001/api/health
```

**Response:**
```json
{
  "status": "ok",
  "message": "Server is running",
  "mongodb": "connected"
}
```

## Graceful Shutdown

The server handles `SIGINT` and `SIGTERM` signals to:
1. Close MongoDB connection properly
2. Exit gracefully without data corruption

Press `Ctrl+C` to stop the server safely.

## Testing the API

### Using curl

```bash
# Get all configurations
curl http://localhost:3001/api/ecommerce-details

# Update a configuration
curl -X PATCH http://localhost:3001/api/ecommerce-details/{id} \
  -H "Content-Type: application/json" \
  -d '{"name": "Updated Name"}'

# Delete a configuration
curl -X DELETE http://localhost:3001/api/ecommerce-details/{id}
```

### Using Postman or Thunder Client

1. Import the base URL: `http://localhost:3001`
2. Test each endpoint with appropriate HTTP methods
3. Use the `_id` from GET response for PATCH/DELETE operations

## Notes

- All endpoints are **backend-to-backend** (no domain names in stored endpoints)
- The MongoDB `_id` field is used as the unique identifier
- Timestamps (`createdAt`, `updatedAt`) are automatically managed
- Collection name is explicitly set to `ecommerce_details`
- Validation prevents unwanted field updates during PATCH operations
