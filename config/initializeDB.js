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
 * Checks if ecommerce_details collection exists and has data
 * If empty, inserts the default configuration
 *
 * @returns {Promise<void>}
 */
export async function initializeDatabase() {
  try {
    console.log('🔍 Checking ecommerce_details collection...');

    // Check if any documents exist in the collection
    const count = await EcommerceDetail.countDocuments();

    if (count === 0) {
      console.log('📝 Collection is empty. Inserting default configuration...');

      const defaultConfig = new EcommerceDetail(DEFAULT_ECOMMERCE_CONFIG);
      await defaultConfig.save();

      console.log('✅ Default ecommerce configuration inserted successfully');
      console.log(`   - Name: ${DEFAULT_ECOMMERCE_CONFIG.name}`);
      console.log(`   - API Version: ${DEFAULT_ECOMMERCE_CONFIG.api_version}`);
      console.log(`   - Endpoints: ${Object.keys(DEFAULT_ECOMMERCE_CONFIG.api_urls).join(', ')}`);
    } else {
      console.log(`✅ ecommerce_details collection already exists with ${count} document(s)`);
    }
  } catch (error) {
    console.error('❌ Error initializing database:', error.message);
    throw error;
  }
}
