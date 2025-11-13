/**
 * Interactive Setup for eBay API MCP Server
 *
 * A beautiful CLI experience for configuring eBay API credentials and tokens.
 * Run: npm run setup
 */

/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable n/no-process-exit */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */

import prompts, { type PromptObject } from 'prompts';
import chalk from 'chalk';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { homedir, platform } from 'os';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PROJECT_ROOT = join(__dirname, '../..');

// ═══════════════════════════════════════════════════════════════════════════
// eBay Logo and Branding
// ═══════════════════════════════════════════════════════════════════════════

const EBAY_LOGO = `
${chalk.red('   ___')}${chalk.blue('____')}${chalk.yellow('__')}${chalk.green('___')}
${chalk.red('  / _ ')}${chalk.blue('/ __ ')}${chalk.yellow('\\')}${chalk.green('/ __ \\')}
${chalk.red(' /  __')}${chalk.blue('/ /_/ ')}${chalk.yellow('/')}${chalk.green(' /_/ /')}
${chalk.red(' \\___')}${chalk.blue('/_.___')}${chalk.yellow('/')}${chalk.green(' .___/')}
${chalk.gray('            /_/')}

${chalk.bold.cyan('eBay API MCP Server')}
${chalk.gray('━'.repeat(50))}
`;

const WELCOME_MESSAGE = `
${chalk.bold.white('Welcome to the Interactive Setup Wizard! 🚀')}

This wizard will help you configure your eBay API credentials
and set up authentication tokens for the MCP server.

${chalk.yellow('What you\'ll need:')}
  ${chalk.cyan('•')} eBay Client ID & Secret (from developer.ebay.com)
  ${chalk.cyan('•')} Redirect URI (RuName from eBay Developer Portal)
  ${chalk.cyan('•')} Optional: User access & refresh tokens

${chalk.gray('━'.repeat(50))}
`;

// ═══════════════════════════════════════════════════════════════════════════
// Helper Functions
// ═══════════════════════════════════════════════════════════════════════════

function displayLogo() {
  console.clear();
  console.log(EBAY_LOGO);
}

function displayWelcome() {
  displayLogo();
  console.log(WELCOME_MESSAGE);
}

function validateRequired(value: string): boolean | string {
  return value.trim().length > 0 || 'This field is required';
}

function validateToken(value: string): boolean | string {
  if (!value) return true; // Optional field
  if (!value.startsWith('v^1.1#')) {
    return 'Token should start with "v^1.1#"';
  }
  return true;
}

function loadExistingConfig(): Record<string, string> {
  const envPath = join(PROJECT_ROOT, '.env');
  const config: Record<string, string> = {};

  if (existsSync(envPath)) {
    const envContent = readFileSync(envPath, 'utf-8');
    const lines = envContent.split('\n');

    for (const line of lines) {
      if (line.trim() && !line.startsWith('#')) {
        const [key, ...valueParts] = line.split('=');
        const value = valueParts.join('=').trim();
        if (key && value && !value.includes('_here')) {
          config[key.trim()] = value;
        }
      }
    }
  }

  return config;
}

function saveConfig(config: Record<string, string>) {
  const envPath = join(PROJECT_ROOT, '.env');

  const envContent = `###############################################################################
# eBay API MCP Server - Environment Configuration
# Generated: ${new Date().toISOString()}
###############################################################################

# ═══════════════════════════════════════════════════════════════════════════
# REQUIRED: eBay API Credentials
# ═══════════════════════════════════════════════════════════════════════════

EBAY_CLIENT_ID=${config.EBAY_CLIENT_ID}
EBAY_CLIENT_SECRET=${config.EBAY_CLIENT_SECRET}

# Environment: "sandbox" (testing) or "production" (live eBay)
EBAY_ENVIRONMENT=${config.EBAY_ENVIRONMENT}

# Redirect URI (RuName): Required for user OAuth flow
EBAY_REDIRECT_URI=${config.EBAY_REDIRECT_URI}

# ═══════════════════════════════════════════════════════════════════════════
# OPTIONAL: User OAuth Tokens (Recommended for high rate limits)
# ═══════════════════════════════════════════════════════════════════════════
# Benefits: 10,000-50,000 requests/day vs 1,000/day with app tokens

${config.EBAY_USER_ACCESS_TOKEN ? `EBAY_USER_ACCESS_TOKEN=${config.EBAY_USER_ACCESS_TOKEN}` : '# EBAY_USER_ACCESS_TOKEN='}
${config.EBAY_USER_REFRESH_TOKEN ? `EBAY_USER_REFRESH_TOKEN=${config.EBAY_USER_REFRESH_TOKEN}` : '# EBAY_USER_REFRESH_TOKEN='}

# ═══════════════════════════════════════════════════════════════════════════
# OPTIONAL: App OAuth Token (Auto-generated if not provided)
# ═══════════════════════════════════════════════════════════════════════════

${config.EBAY_APP_ACCESS_TOKEN ? `EBAY_APP_ACCESS_TOKEN=${config.EBAY_APP_ACCESS_TOKEN}` : '# EBAY_APP_ACCESS_TOKEN='}
`;

  writeFileSync(envPath, envContent);
}

function getConfigPaths() {
  const home = homedir();
  const os = platform();
  const paths: Record<string, string> = {};

  if (os === 'darwin') {
    paths.claude = join(home, 'Library/Application Support/Claude/claude_desktop_config.json');
  } else if (os === 'win32') {
    paths.claude = join(home, 'AppData/Roaming/Claude/claude_desktop_config.json');
  } else {
    paths.claude = join(home, '.config/Claude/claude_desktop_config.json');
  }

  paths.gemini = join(home, '.config/gemini/config.json');
  paths.chatgpt = join(home, '.config/chatgpt/config.json');

  return paths;
}

function detectMCPClients() {
  const configPaths = getConfigPaths();
  const detected: string[] = [];

  for (const [name, path] of Object.entries(configPaths)) {
    if (existsSync(path) || existsSync(dirname(path))) {
      detected.push(name);
    }
  }

  return detected;
}

// ═══════════════════════════════════════════════════════════════════════════
// Setup Steps
// ═══════════════════════════════════════════════════════════════════════════

async function step1_Welcome(): Promise<boolean> {
  displayWelcome();

  const response = await prompts({
    type: 'confirm',
    name: 'ready',
    message: chalk.bold('Ready to begin?'),
    initial: true,
  });

  return response.ready;
}

async function step2_BasicCredentials(existingConfig: Record<string, string>) {
  displayLogo();
  console.log(chalk.bold.cyan('\n📝 Step 1: Basic eBay API Credentials\n'));
  console.log(chalk.gray('Get these from: https://developer.ebay.com/my/keys\n'));

  const questions: PromptObject[] = [
    {
      type: 'text' as const,
      name: 'EBAY_CLIENT_ID',
      message: chalk.bold('eBay Client ID:'),
      initial: existingConfig.EBAY_CLIENT_ID || '',
      validate: validateRequired,
    },
    {
      type: 'password' as const,
      name: 'EBAY_CLIENT_SECRET',
      message: chalk.bold('eBay Client Secret:'),
      initial: existingConfig.EBAY_CLIENT_SECRET || '',
      validate: validateRequired,
    },
    {
      type: 'select' as const,
      name: 'EBAY_ENVIRONMENT',
      message: chalk.bold('Environment:'),
      choices: [
        { title: chalk.yellow('🧪 Sandbox') + ' (Testing)', value: 'sandbox' },
        { title: chalk.green('🚀 Production') + ' (Live eBay)', value: 'production' },
      ],
      initial: existingConfig.EBAY_ENVIRONMENT === 'production' ? 1 : 0,
    },
    {
      type: 'text' as const,
      name: 'EBAY_REDIRECT_URI',
      message: chalk.bold('Redirect URI (RuName):'),
      initial: existingConfig.EBAY_REDIRECT_URI || '',
      validate: validateRequired,
    },
  ];

  return await prompts(questions);
}

async function step3_UserTokens(existingConfig: Record<string, string>) {
  displayLogo();
  console.log(chalk.bold.cyan('\n🔐 Step 2: User OAuth Tokens (Optional)\n'));
  console.log(chalk.gray('These provide higher rate limits (10k-50k requests/day)\n'));

  const hasTokens = await prompts({
    type: 'confirm',
    name: 'value',
    message: chalk.bold('Do you have user access & refresh tokens?'),
    initial: !!(existingConfig.EBAY_USER_ACCESS_TOKEN || existingConfig.EBAY_USER_REFRESH_TOKEN),
  });

  if (!hasTokens.value) {
    console.log(chalk.yellow('\n💡 Tip: Use the ebay_get_oauth_url tool later to generate these tokens\n'));
    return {};
  }

  const questions: PromptObject[] = [
    {
      type: 'text' as const,
      name: 'EBAY_USER_ACCESS_TOKEN',
      message: chalk.bold('User Access Token:'),
      initial: existingConfig.EBAY_USER_ACCESS_TOKEN || '',
      validate: validateToken,
    },
    {
      type: 'text' as const,
      name: 'EBAY_USER_REFRESH_TOKEN',
      message: chalk.bold('User Refresh Token:'),
      initial: existingConfig.EBAY_USER_REFRESH_TOKEN || '',
      validate: validateToken,
    },
  ];

  return await prompts(questions);
}

async function step4_AppToken(existingConfig: Record<string, string>) {
  displayLogo();
  console.log(chalk.bold.cyan('\n🎫 Step 3: App Access Token (Optional)\n'));
  console.log(chalk.gray('Leave blank to auto-generate using client credentials\n'));

  const hasToken = await prompts({
    type: 'confirm',
    name: 'value',
    message: chalk.bold('Do you have a pre-generated app access token?'),
    initial: !!existingConfig.EBAY_APP_ACCESS_TOKEN,
  });

  if (!hasToken.value) {
    console.log(chalk.gray('\n✓ Will auto-generate on server startup\n'));
    return {};
  }

  const questions: PromptObject[] = [
    {
      type: 'text' as const,
      name: 'EBAY_APP_ACCESS_TOKEN',
      message: chalk.bold('App Access Token:'),
      initial: existingConfig.EBAY_APP_ACCESS_TOKEN || '',
      validate: validateToken,
    },
  ];

  return await prompts(questions);
}

async function step5_Review(config: Record<string, string>) {
  displayLogo();
  console.log(chalk.bold.cyan('\n📋 Step 4: Review Configuration\n'));

  console.log(chalk.bold('Basic Credentials:'));
  console.log(`  ${chalk.gray('Client ID:')} ${chalk.white(config.EBAY_CLIENT_ID?.substring(0, 20) + '...')}`);
  console.log(`  ${chalk.gray('Client Secret:')} ${chalk.white('•'.repeat(20))}`);
  console.log(`  ${chalk.gray('Environment:')} ${config.EBAY_ENVIRONMENT === 'production' ? chalk.green('Production') : chalk.yellow('Sandbox')}`);
  console.log(`  ${chalk.gray('Redirect URI:')} ${chalk.white(config.EBAY_REDIRECT_URI || 'Not set')}`);

  console.log(chalk.bold('\nUser Tokens:'));
  console.log(`  ${chalk.gray('Access Token:')} ${config.EBAY_USER_ACCESS_TOKEN ? chalk.green('✓ Set') : chalk.gray('Not set')}`);
  console.log(`  ${chalk.gray('Refresh Token:')} ${config.EBAY_USER_REFRESH_TOKEN ? chalk.green('✓ Set') : chalk.gray('Not set')}`);

  console.log(chalk.bold('\nApp Token:'));
  console.log(`  ${chalk.gray('Access Token:')} ${config.EBAY_APP_ACCESS_TOKEN ? chalk.green('✓ Set') : chalk.gray('Will auto-generate')}`);

  console.log();

  const confirm = await prompts({
    type: 'confirm',
    name: 'value',
    message: chalk.bold('Save this configuration?'),
    initial: true,
  });

  return confirm.value;
}

async function step6_Finalize(config: Record<string, string>) {
  displayLogo();
  console.log(chalk.bold.cyan('\n💾 Saving Configuration...\n'));

  saveConfig(config);
  console.log(chalk.green('✓ Configuration saved to .env\n'));

  // Detect MCP clients
  const clients = detectMCPClients();

  if (clients.length > 0) {
    console.log(chalk.bold.cyan('🔍 Detected MCP Clients:\n'));
    clients.forEach(client => {
      console.log(`  ${chalk.green('✓')} ${client.charAt(0).toUpperCase() + client.slice(1)}`);
    });

    const runAutoSetup = await prompts({
      type: 'confirm',
      name: 'value',
      message: chalk.bold('Run auto-setup to configure MCP clients?'),
      initial: true,
    });

    if (runAutoSetup.value) {
      console.log(chalk.gray('\nRunning auto-setup...\n'));
      // We'll trigger auto-setup after this script completes
      return true;
    }
  }

  return false;
}

function displaySuccess(runAutoSetup: boolean) {
  displayLogo();
  console.log(chalk.bold.green('\n✨ Setup Complete! ✨\n'));

  console.log(chalk.bold.white('📋 Next Steps:\n'));

  if (runAutoSetup) {
    console.log(chalk.cyan('  1. MCP client configurations will be generated automatically'));
  } else {
    console.log(chalk.cyan('  1. Run: npm run auto-setup (to configure MCP clients)'));
  }

  console.log(chalk.cyan('  2. Build the project: npm run build'));
  console.log(chalk.cyan('  3. Restart your MCP clients (Claude Desktop, etc.)'));
  console.log(chalk.cyan('  4. Test with: "List my eBay inventory items"\n'));

  console.log(chalk.bold.white('📚 Resources:\n'));
  console.log(chalk.gray('  Documentation: https://github.com/YosefHayim/ebay-api-mcp-server'));
  console.log(chalk.gray('  Get OAuth URL: Use ebay_get_oauth_url tool'));
  console.log(chalk.gray('  eBay Developer: https://developer.ebay.com\n'));

  console.log(chalk.bold.cyan('🎉 Happy Coding!\n'));
}

// ═══════════════════════════════════════════════════════════════════════════
// Main Flow
// ═══════════════════════════════════════════════════════════════════════════

async function main() {
  try {
    // Load existing configuration
    const existingConfig = loadExistingConfig();
    const hasExisting = Object.keys(existingConfig).length > 0;

    if (hasExisting) {
      displayLogo();
      console.log(chalk.yellow('\n⚠️  Existing configuration detected\n'));
      const reconfigure = await prompts({
        type: 'confirm',
        name: 'value',
        message: chalk.bold('Do you want to reconfigure?'),
        initial: false,
      });

      if (!reconfigure.value) {
        console.log(chalk.gray('\nSetup cancelled. Existing configuration preserved.\n'));
        return;
      }
    }

    // Step 1: Welcome
    const ready = await step1_Welcome();
    if (!ready) {
      console.log(chalk.gray('\nSetup cancelled.\n'));
      return;
    }

    // Step 2: Basic credentials
    const basicConfig = await step2_BasicCredentials(existingConfig);
    if (!basicConfig.EBAY_CLIENT_ID) {
      console.log(chalk.red('\n❌ Setup cancelled.\n'));
      return;
    }

    // Step 3: User tokens
    const userTokens = await step3_UserTokens(existingConfig);

    // Step 4: App token
    const appToken = await step4_AppToken(existingConfig);

    // Combine all configuration
    const finalConfig = {
      ...basicConfig,
      ...userTokens,
      ...appToken,
    };

    // Step 5: Review
    const confirmed = await step5_Review(finalConfig);
    if (!confirmed) {
      console.log(chalk.yellow('\n⚠️  Configuration not saved. Setup cancelled.\n'));
      return;
    }

    // Step 6: Finalize
    const runAutoSetup = await step6_Finalize(finalConfig);

    // Display success
    displaySuccess(runAutoSetup);

    // Trigger auto-setup if requested
    if (runAutoSetup) {
      const { exec } = await import('child_process');
      exec('npm run auto-setup', (error, stdout, stderr) => {
        if (error) {
          console.error(chalk.red(`\n❌ Auto-setup failed: ${error.message}\n`));
          return;
        }
        if (stdout) console.log(stdout);
        if (stderr) console.error(stderr);
      });
    }

  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'User force closed the prompt') {
      console.log(chalk.gray('\n\nSetup cancelled by user.\n'));
      process.exit(0);
    }

    console.error(chalk.red('\n❌ Setup failed:'), error);
    process.exit(1);
  }
}

// Run the interactive setup
void main();
