import mongoose from 'mongoose';

/**
 * MongoDB Atlas Connection Manager
 * Handles connection to MongoDB Atlas cluster
 */
class DatabaseConnection {
  constructor() {
    this.isConnected = false;
  }

  /**
   * Connect to MongoDB Atlas
   * @returns {Promise<void>}
   */
  async connect() {
    if (this.isConnected) {
      console.log('📦 Already connected to MongoDB');
      return;
    }

    const MONGODB_URI = process.env.MONGODB_URI;

    if (!MONGODB_URI) {
      throw new Error(
        '❌ MONGODB_URI is not defined in environment variables. ' +
        'Please add it to your .env file.'
      );
    }

    try {
      await mongoose.connect(MONGODB_URI, {
        // Mongoose 6+ doesn't need these options, but keeping for compatibility
        // useNewUrlParser: true,
        // useUnifiedTopology: true,
      });

      this.isConnected = true;
      console.log('✅ Successfully connected to MongoDB Atlas');

      // Handle connection events
      mongoose.connection.on('error', (err) => {
        console.error('❌ MongoDB connection error:', err);
        this.isConnected = false;
      });

      mongoose.connection.on('disconnected', () => {
        console.warn('⚠️  MongoDB disconnected');
        this.isConnected = false;
      });

    } catch (error) {
      console.error('❌ Failed to connect to MongoDB:', error.message);
      throw error;
    }
  }

  /**
   * Disconnect from MongoDB
   * @returns {Promise<void>}
   */
  async disconnect() {
    if (!this.isConnected) {
      return;
    }

    try {
      await mongoose.disconnect();
      this.isConnected = false;
      console.log('👋 Disconnected from MongoDB');
    } catch (error) {
      console.error('❌ Error disconnecting from MongoDB:', error);
      throw error;
    }
  }

  /**
   * Get connection status
   * @returns {boolean}
   */
  getConnectionStatus() {
    return this.isConnected;
  }
}

// Export singleton instance
const dbConnection = new DatabaseConnection();
export default dbConnection;
