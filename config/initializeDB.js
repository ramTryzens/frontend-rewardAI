import EcommerceDetail from '../models/EcommerceDetail.js';

/**
 * Default ecommerce configuration
 * Used to initialize the database on first startup
 */
const DEFAULT_ECOMMERCE_CONFIG = {
  name: 'BigCommerce',
  api_version: 'V3',
  api_urls: {
    cart: {
      endpoint: '/cart',
      method: 'POST',
    },
    customer: {
      endpoint: '/customer',
      method: 'GET',
    },
  },
  enabled: true,
};

/**
 * Initialize the database with default data
 * Database initialization disabled - no default data will be inserted
 *
 * @returns {Promise<void>}
 */
export async function initializeDatabase() {
  try {
    console.log('ℹ️  Database initialization skipped - no default ecommerce configuration will be added');
    // No default data initialization - collections start empty
  } catch (error) {
    console.error('❌ Error initializing database:', error.message);
    throw error;
  }
}
