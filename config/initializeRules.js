import RuleEntry from '../models/RuleEntry.js';

/**
 * Default rule entries
 * Used to initialize the RuleEntriesTable on first startup
 */
const DEFAULT_RULES = [
  {
    id: 1,
    key: 'ALLOW_CART_DISC',
    enabled: true,
  },
  {
    id: 2,
    key: 'MAX_CART_DISC_OFF_%',
    enabled: false,
  },
  {
    id: 3,
    key: 'ALLOW_CART_BIDDING',
    enabled: false,
  },
];

/**
 * Initialize the RuleEntriesTable with default data
 * Database initialization disabled - no default rules will be inserted
 *
 * @returns {Promise<void>}
 */
export async function initializeRules() {
  try {
    console.log('ℹ️  Rules initialization skipped - no default business rules will be added');
    // No default data initialization - collections start empty
  } catch (error) {
    console.error('❌ Error initializing RuleEntriesTable:', error.message);
    throw error;
  }
}
