import express from 'express';
import User from '../models/User.js';

const router = express.Router();

// Create or update user from Clerk webhook
router.post('/sync', async (req, res) => {
  try {
    const { clerkUserId, email, firstName, lastName, imageUrl } = req.body;

    let user = await User.findOne({ clerkUserId });

    if (user) {
      // Update existing user
      user.email = email;
      user.firstName = firstName;
      user.lastName = lastName;
      user.imageUrl = imageUrl;
      user.lastLogin = new Date();
      await user.save();
    } else {
      // Create new user
      user = await User.create({
        clerkUserId,
        email,
        firstName,
        lastName,
        imageUrl,
        isAdmin: false,
        isApproved: false,
        lastLogin: new Date(),
      });
    }

    res.json({ success: true, user });
  } catch (error) {
    console.error('Error syncing user:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get user by Clerk ID
router.get('/:clerkUserId', async (req, res) => {
  try {
    const user = await User.findOne({ clerkUserId: req.params.clerkUserId });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error getting user:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get all users (Admin only)
router.get('/', async (req, res) => {
  try {
    const users = await User.find({}).sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    console.error('Error getting users:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update user approval status (Admin only)
router.patch('/:userId/approve', async (req, res) => {
  try {
    const { isApproved } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { isApproved },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ success: true, user });
  } catch (error) {
    console.error('Error updating user approval:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update user merchant details
router.patch('/:clerkUserId/merchant-details', async (req, res) => {
  try {
    const { merchantDetails } = req.body;

    const user = await User.findOneAndUpdate(
      { clerkUserId: req.params.clerkUserId },
      { merchantDetails },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ success: true, user });
  } catch (error) {
    console.error('Error updating merchant details:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
