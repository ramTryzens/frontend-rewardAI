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
 * Checks if collection exists and has data
 * If empty, inserts the default rules
 *
 * @returns {Promise<void>}
 */
export async function initializeRules() {
  try {
    console.log('🔍 Checking RuleEntriesTable collection...');

    // Check if any documents exist in the collection
    const count = await RuleEntry.countDocuments();

    if (count === 0) {
      console.log('📝 RuleEntriesTable is empty. Inserting default rules...');

      // Insert all default rules
      await RuleEntry.insertMany(DEFAULT_RULES);

      console.log('✅ Default rules inserted successfully');
      console.log(`   - Inserted ${DEFAULT_RULES.length} rules:`);
      DEFAULT_RULES.forEach((rule) => {
        console.log(`     • ID ${rule.id}: ${rule.key} (${rule.enabled ? 'enabled' : 'disabled'})`);
      });
    } else {
      console.log(`✅ RuleEntriesTable already exists with ${count} rule(s)`);
    }
  } catch (error) {
    console.error('❌ Error initializing RuleEntriesTable:', error.message);
    throw error;
  }
}
