/**
 * Manual Tool Testing Script
 *
 * This script tests all eBay MCP tools as a new developer would,
 * identifying bugs and issues along the way.
 */

import { EbaySellerApi } from './src/api/index.js';
import { getEbayConfig } from './src/config/environment.js';
import { executeTool } from './src/tools/index.js';

interface TestResult {
  toolName: string;
  status: 'PASS' | 'FAIL' | 'SKIP';
  message: string;
  error?: string;
  response?: unknown;
}

const results: TestResult[] = [];

function logResult(result: TestResult): void {
  const emoji = result.status === 'PASS' ? '✅' : result.status === 'FAIL' ? '❌' : '⏭️';
  console.log(`\n${emoji} ${result.toolName}: ${result.status}`);
  console.log(`   ${result.message}`);
  if (result.error) {
    console.log(`   Error: ${result.error}`);
  }
  if (result.response) {
    console.log(`   Response: ${JSON.stringify(result.response, null, 2).substring(0, 200)}...`);
  }
  results.push(result);
}

async function testTool(
  api: EbaySellerApi,
  toolName: string,
  args: Record<string, unknown>,
  description: string
): Promise<TestResult> {
  try {
    console.log(`\n🧪 Testing: ${toolName}`);
    console.log(`   Args: ${JSON.stringify(args, null, 2)}`);

    const result = await executeTool(api, toolName, args);

    return {
      toolName,
      status: 'PASS',
      message: description,
      response: result,
    };
  } catch (error) {
    return {
      toolName,
      status: 'FAIL',
      message: description,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

async function runTests(): Promise<void> {
  console.log('\n═══════════════════════════════════════════════════════');
  console.log('  eBay MCP Tool Manual Testing');
  console.log('═══════════════════════════════════════════════════════\n');
  console.log('Initializing eBay API client...');

  const config = getEbayConfig();
  const api = new EbaySellerApi(config);
  await api.initialize();

  console.log('✅ API client initialized\n');
  console.log('Environment:', process.env.EBAY_ENVIRONMENT || 'NOT SET');
  console.log('Client ID:', process.env.EBAY_CLIENT_ID ? '***' + process.env.EBAY_CLIENT_ID.slice(-4) : 'NOT SET');
  console.log('Redirect URI:', process.env.EBAY_REDIRECT_URI || 'NOT SET');

  // ====================================================================
  // TEST 1: Token Management Tools
  // ====================================================================
  console.log('\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('  TEST CATEGORY 1: Token Management');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // Test 1.1: Get OAuth URL (no parameters)
  let result = await testTool(
    api,
    'ebay_get_oauth_url',
    {},
    'Generate OAuth URL with default parameters'
  );
  logResult(result);

  // Test 1.2: Get OAuth URL (with custom redirect URI)
  result = await testTool(
    api,
    'ebay_get_oauth_url',
    { redirectUri: 'Yosef_Hayim_Sabag-YosefHayi-eBayAP-nbhthpckx' },
    'Generate OAuth URL with custom redirect URI'
  );
  logResult(result);

  // Test 1.3: Get OAuth URL (with custom scopes)
  result = await testTool(
    api,
    'ebay_get_oauth_url',
    {
      scopes: ['https://api.ebay.com/oauth/api_scope/sell.inventory'],
    },
    'Generate OAuth URL with custom scopes'
  );
  logResult(result);

  // Test 1.4: Get token status
  result = await testTool(
    api,
    'ebay_get_token_status',
    {},
    'Check current token status'
  );
  logResult(result);

  // Test 1.5: Display credentials
  result = await testTool(
    api,
    'ebay_display_credentials',
    {},
    'Display all credentials and token information'
  );
  logResult(result);

  // Test 1.6: Convert date to timestamp
  result = await testTool(
    api,
    'ebay_convert_date_to_timestamp',
    { dateInput: '2025-12-31T23:59:59Z' },
    'Convert ISO date to timestamp'
  );
  logResult(result);

  // Test 1.7: Validate token expiry
  result = await testTool(
    api,
    'ebay_validate_token_expiry',
    {
      accessTokenExpiry: Date.now() + 7200000, // 2 hours from now
      refreshTokenExpiry: Date.now() + 15552000000, // ~6 months from now
    },
    'Validate token expiry times'
  );
  logResult(result);

  // Test 1.8: Set user tokens with expiry (should fail without valid tokens)
  result = await testTool(
    api,
    'ebay_set_user_tokens_with_expiry',
    {
      accessToken: 'v^1.1#invalid_test_token',
      refreshToken: 'v^1.1#invalid_refresh_token',
      accessTokenExpiry: Date.now() + 7200000,
      refreshTokenExpiry: Date.now() + 15552000000,
    },
    'Set user tokens with expiry (expected to store but not validate until used)'
  );
  logResult(result);

  // Test 1.9: Refresh access token (should fail without valid refresh token)
  result = await testTool(
    api,
    'ebay_refresh_access_token',
    {},
    'Refresh access token (should fail without valid refresh token)'
  );
  logResult(result);

  // ====================================================================
  // TEST 2: Inventory Management Tools
  // ====================================================================
  console.log('\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('  TEST CATEGORY 2: Inventory Management');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // Test 2.1: Get inventory items
  result = await testTool(
    api,
    'ebay_get_inventory_items',
    { limit: 5 },
    'Get first 5 inventory items'
  );
  logResult(result);

  // Test 2.2: Get inventory item (should fail - no SKU)
  result = await testTool(
    api,
    'ebay_get_inventory_item',
    { sku: 'TEST-SKU-12345' },
    'Get specific inventory item by SKU'
  );
  logResult(result);

  // Test 2.3: Get offers
  result = await testTool(
    api,
    'ebay_get_offers',
    { limit: 5 },
    'Get first 5 offers'
  );
  logResult(result);

  // ====================================================================
  // TEST 3: Order Fulfillment Tools
  // ====================================================================
  console.log('\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('  TEST CATEGORY 3: Order Fulfillment');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // Test 3.1: Get orders
  result = await testTool(
    api,
    'ebay_get_orders',
    { limit: 5 },
    'Get first 5 orders'
  );
  logResult(result);

  // Test 3.2: Get payment dispute summaries
  result = await testTool(
    api,
    'ebay_get_payment_dispute_summaries',
    {},
    'Get payment dispute summaries'
  );
  logResult(result);

  // ====================================================================
  // TEST 4: Account Management Tools
  // ====================================================================
  console.log('\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('  TEST CATEGORY 4: Account Management');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // Test 4.1: Get fulfillment policies
  result = await testTool(
    api,
    'ebay_get_fulfillment_policies',
    { marketplace_id: 'EBAY_US' },
    'Get fulfillment policies for US marketplace'
  );
  logResult(result);

  // Test 4.2: Get payment policies
  result = await testTool(
    api,
    'ebay_get_payment_policies',
    { marketplace_id: 'EBAY_US' },
    'Get payment policies for US marketplace'
  );
  logResult(result);

  // Test 4.3: Get return policies
  result = await testTool(
    api,
    'ebay_get_return_policies',
    { marketplace_id: 'EBAY_US' },
    'Get return policies for US marketplace'
  );
  logResult(result);

  // ====================================================================
  // TEST 5: Marketing Tools
  // ====================================================================
  console.log('\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('  TEST CATEGORY 5: Marketing');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // Test 5.1: Get campaigns
  result = await testTool(
    api,
    'ebay_get_campaigns',
    {},
    'Get marketing campaigns'
  );
  logResult(result);

  // Test 5.2: Get item promotions
  result = await testTool(
    api,
    'ebay_get_item_promotions',
    { marketplace_id: 'EBAY_US' },
    'Get item promotions for US marketplace'
  );
  logResult(result);

  // ====================================================================
  // TEST 6: Analytics Tools
  // ====================================================================
  console.log('\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('  TEST CATEGORY 6: Analytics');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // Test 6.1: Get seller standards profiles
  result = await testTool(
    api,
    'ebay_find_seller_standards_profiles',
    {},
    'Find seller standards profiles'
  );
  logResult(result);

  // ====================================================================
  // SUMMARY
  // ====================================================================
  console.log('\n\n═══════════════════════════════════════════════════════');
  console.log('  TEST SUMMARY');
  console.log('═══════════════════════════════════════════════════════\n');

  const passed = results.filter((r) => r.status === 'PASS').length;
  const failed = results.filter((r) => r.status === 'FAIL').length;
  const skipped = results.filter((r) => r.status === 'SKIP').length;

  console.log(`Total Tests: ${results.length}`);
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`⏭️  Skipped: ${skipped}`);

  console.log('\n\nDetailed Results:');
  console.log('─────────────────────────────────────────────────────\n');

  results.forEach((r, i) => {
    const emoji = r.status === 'PASS' ? '✅' : r.status === 'FAIL' ? '❌' : '⏭️';
    console.log(`${i + 1}. ${emoji} ${r.toolName}`);
    console.log(`   ${r.message}`);
    if (r.error) {
      console.log(`   ❌ Error: ${r.error}`);
    }
  });

  console.log('\n═══════════════════════════════════════════════════════\n');
}

// Run the tests
runTests().catch((error) => {
  console.error('Fatal error running tests:', error);
  process.exit(1);
});
