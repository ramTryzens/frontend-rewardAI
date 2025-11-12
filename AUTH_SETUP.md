# Authentication & User Management Setup

Complete authentication system with Clerk and MongoDB for merchant management.

## Overview

This system implements a complete authentication flow with:
- **Clerk** for authentication (sign-in/sign-up)
- **MongoDB Atlas** for user data storage
- **Role-based access control** (Admin vs Merchant)
- **Approval workflow** for new merchant accounts

## Database Schema

### User Model (`server/models/User.js`)

```javascript
{
  clerkUserId: String (unique),
  email: String (unique),
  firstName: String,
  lastName: String,
  imageUrl: String,
  isAdmin: Boolean (default: false),
  isApproved: Boolean (default: false),
  merchantDetails: {
    businessName: String,
    businessType: String,
    phoneNumber: String,
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String
    }
  },
  lastLogin: Date,
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

## Setup Instructions

### 1. Environment Variables

Update your `.env` file with the following:

```env
# Clerk Authentication
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here

# MongoDB Atlas
MONGODB_URI=your_mongodb_atlas_connection_string_here
```

### 2. Get Clerk Credentials

1. Go to https://clerk.com and create an account
2. Create a new application
3. Copy the **Publishable Key** to `VITE_CLERK_PUBLISHABLE_KEY`
4. Configure authentication methods (email/password, Google, etc.)

### 3. Set up MongoDB Atlas

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Create a database user
4. Whitelist your IP address (or use 0.0.0.0/0 for development)
5. Get the connection string and add it to `MONGODB_URI`

### 4. Create First Admin User

After setting up, you need to create your first admin user manually in MongoDB:

```javascript
// In MongoDB Compass or Atlas UI, insert this document:
{
  "clerkUserId": "user_XXXXX", // Get this from Clerk after signing up
  "email": "admin@example.com",
  "firstName": "Admin",
  "lastName": "User",
  "isAdmin": true,
  "isApproved": true,
  "createdAt": new Date(),
  "updatedAt": new Date()
}
```

## User Flows

### New Merchant Registration

1. User clicks **Sign Up** on home page
2. Completes Clerk sign-up form
3. Redirected to `/dashboard`
4. System syncs user data to MongoDB
5. Shows "Pending Approval" message
6. Admin must approve before access is granted

### Admin Approval Process

1. Admin signs in at `/sign-in`
2. Redirected to `/admin` dashboard
3. Sees list of all merchants with status
4. Clicks **Approve** to grant access
5. Merchant can now access the system

### Approved Merchant Flow

1. Merchant signs in
2. System checks `isApproved` status
3. Redirected to `/merchant-onboarding`
4. Fills out business details
5. Proceeds to `/select-cart`
6. Can now use the cart system

## Routes

### Public Routes
- `/` - Home page with sign in/up buttons
- `/sign-in` - Clerk sign-in page
- `/sign-up` - Clerk sign-up page

### Protected Routes (Requires Authentication)
- `/dashboard` - Initial landing after login (routes based on user type)
- `/merchant-onboarding` - Business details form (approved merchants only)
- `/select-cart` - Cart selection page
- `/cart/:id` - Cart details with AI offers
- `/admin` - Admin dashboard for user management (admins only)

## API Endpoints

### User Management (`/api/users`)

```javascript
POST /api/users/sync
// Sync Clerk user to MongoDB
Body: { clerkUserId, email, firstName, lastName, imageUrl }

GET /api/users/:clerkUserId
// Get user by Clerk ID

GET /api/users
// Get all users (Admin only)

PATCH /api/users/:userId/approve
// Update user approval status
Body: { isApproved: boolean }

PATCH /api/users/:clerkUserId/merchant-details
// Update merchant business details
Body: { merchantDetails: {...} }
```

## File Structure

```
├── src/
│   ├── pages/
│   │   ├── SignIn.tsx          # Clerk sign-in page
│   │   ├── SignUp.tsx          # Clerk sign-up page
│   │   ├── Dashboard.tsx       # Routes users based on role/status
│   │   ├── MerchantOnboarding.tsx  # Business details form
│   │   ├── Admin.tsx           # Admin panel for user management
│   │   └── Home.tsx            # Updated with auth buttons
│   ├── App.tsx                 # Routes with Clerk protection
│   └── main.tsx                # Clerk provider setup
├── server/
│   ├── db/
│   │   └── connection.js       # MongoDB connection
│   ├── models/
│   │   └── User.js             # User schema
│   └── routes/
│       └── userRoutes.js       # User API endpoints
└── server.js                   # Express server with routes

```

## Security Features

1. **Authentication**: Handled by Clerk with secure token management
2. **Protected Routes**: All sensitive routes require authentication
3. **Role-based Access**: Admin-only routes and merchant-only routes
4. **Approval Workflow**: New users must be approved by admin
5. **MongoDB Security**: Connection via secure MongoDB Atlas

## Customization

### Make a User Admin

In MongoDB, update any user document:

```javascript
db.users.updateOne(
  { email: "user@example.com" },
  { $set: { isAdmin: true, isApproved: true } }
)
```

### Modify Approval Workflow

Edit `server/routes/userRoutes.js` to implement:
- Auto-approval for specific domains
- Email notifications
- Custom approval logic

## Development

```bash
# Start backend server
npm run dev

# Start frontend (in another terminal)
npm run dev:frontend
```

## Troubleshooting

### "Missing Clerk Publishable Key"
- Ensure `VITE_CLERK_PUBLISHABLE_KEY` is set in `.env`
- Restart the dev server after adding env variables

### "Failed to connect to MongoDB"
- Check `MONGODB_URI` is correct
- Verify IP whitelist in MongoDB Atlas
- Check database user credentials

### Users Stuck on "Pending Approval"
- Admin must approve in `/admin` dashboard
- Or manually update `isApproved: true` in MongoDB

### Admin Can't Access Admin Panel
- Ensure user has `isAdmin: true` in MongoDB
- Check user is logged in with correct account

## Next Steps

- [ ] Add email notifications for approval
- [ ] Implement audit logging
- [ ] Add user profile management
- [ ] Create merchant analytics dashboard
- [ ] Add API rate limiting
