#!/usr/bin/env node
/**
 * Interactive Setup for eBay API MCP Server
 *
 * A beautiful CLI experience for configuring eBay API credentials and tokens.
 *
 * Usage:
 *   npx ebay-mcp-server --help          Show help
 *   npx ebay-mcp-server --generate-env  Generate .env file only
 *   npx ebay-mcp-server --reset-env     Reset and regenerate .env file
 *   npm run setup                        Interactive setup wizard
 */

/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable n/no-process-exit */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import prompts from 'prompts';
import chalk from 'chalk';
import { readFileSync, writeFileSync, existsSync, copyFileSync, unlinkSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { detectLLMClients, configureLLMClient, type LLMClient } from '../utils/llm-client-detector.js';
import { validateSetup, displayRecommendations } from '../utils/setup-validator.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PROJECT_ROOT = join(__dirname, '../..');

// ═══════════════════════════════════════════════════════════════════════════
// CLI Arguments
// ═══════════════════════════════════════════════════════════════════════════

interface CLIArgs {
  help: boolean;
  generateEnv: boolean;
  resetEnv: boolean;
}

function parseArgs(): CLIArgs {
  const args = process.argv.slice(2);
  return {
    help: args.includes('--help') || args.includes('-h'),
    generateEnv: args.includes('--generate-env'),
    resetEnv: args.includes('--reset-env'),
  };
}

function showHelp() {
  console.log(chalk.bold.cyan('\n📖 eBay API MCP Server Setup Help\n'));
  console.log(chalk.white('Usage:'));
  console.log(chalk.gray('  npx ebay-mcp-server [options]\n'));
  console.log(chalk.white('Options:'));
  console.log(chalk.yellow('  --help, -h          ') + chalk.gray('Show this help message'));
  console.log(chalk.yellow('  --generate-env      ') + chalk.gray('Generate .env file from template'));
  console.log(chalk.yellow('  --reset-env         ') + chalk.gray('Reset and regenerate .env file'));
  console.log(chalk.yellow('  (no options)        ') + chalk.gray('Run interactive setup wizard\n'));
  console.log(chalk.white('Examples:'));
  console.log(chalk.gray('  npm run setup                    # Interactive wizard'));
  console.log(chalk.gray('  npx ebay-mcp-server --help       # Show help'));
  console.log(chalk.gray('  npx ebay-mcp-server --reset-env  # Reset configuration\n'));
  console.log(chalk.white('Learn more:'));
  console.log(chalk.blue('  https://github.com/YosefHayim/ebay-api-mcp-server#readme\n'));
}

// ═══════════════════════════════════════════════════════════════════════════
// eBay Logo and Branding
// ═══════════════════════════════════════════════════════════════════════════

// Helper function to create clickable links in terminal
function createClickableLink(text: string, url: string): string {
  return `\x1b]8;;${url}\x1b\\${text}\x1b]8;;\x1b\\`;
}

const EBAY_LOGO = `
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║     ███████╗██████╗  █████╗ ██╗   ██╗                     ║
║     ██╔════╝██╔══██╗██╔══██╗╚██╗ ██╔╝                     ║
║     █████╗  ██████╔╝███████║ ╚████╔╝                      ║
║     ██╔══╝  ██╔══██╗██╔══██║  ╚██╔╝                       ║
║     ███████╗██████╔╝██║  ██║   ██║                        ║
║     ╚══════╝╚═════╝ ╚═╝  ╚═╝   ╚═╝                        ║
║                                                            ║
║              🔌 API MCP Server Setup 🚀                    ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
`;

const CREATOR_CREDIT = `
   ╔═══════════════════════════════════════════════════════╗
   ║  Creator: ${chalk.cyan('YosefHayim')}                                 ║
   ║  ${createClickableLink(chalk.blue.underline('linkedin.com/in/yosef-hayim-sabag'), 'https://www.linkedin.com/in/yosef-hayim-sabag/')}      ║
   ╚═══════════════════════════════════════════════════════╝
`;

const OAUTH_SETUP_INFO = `
${chalk.bold.yellow('⚠️  IMPORTANT: OAuth Setup Requirements')}

${chalk.bold.white('This is a local MCP server, eBay OAuth only works with HTTPS.')}

${chalk.bold.cyan('Two Setup Options:')}

  ${chalk.green('1. For API Testing Only (Recommended for Beginners)')}
     ${chalk.gray('   • No OAuth needed! Just ask the LLM about schemas and endpoints')}
     ${chalk.gray('   • Perfect for understanding how to structure API requests')}
     ${chalk.gray('   • Limited to read-only operations')}

  ${chalk.yellow('2. Full API Access (Requires OAuth - One-Time Setup)')}
     ${chalk.gray('   • First time: Manual OAuth URL decode required')}
     ${chalk.gray('   • Get your refresh token once, use forever')}
     ${chalk.gray('   • After setup: Everything is automated')}
     ${chalk.gray('   • Full read/write access to eBay APIs')}

${chalk.bold.magenta('📝 Quick Steps for OAuth:')}
  ${chalk.white('1.')} Run this setup to save your Client ID & Secret
  ${chalk.white('2.')} Use ${chalk.cyan('ebay_get_oauth_url')} tool to get OAuth URL
  ${chalk.white('3.')} Visit URL, authorize, copy callback URL
  ${chalk.white('4.')} Manually decode the callback URL once to get tokens
  ${chalk.white('5.')} Save refresh token - ${chalk.green('done! Everything else is automatic')}

${chalk.gray('━'.repeat(70))}
`;

const WELCOME_MESSAGE = `
${chalk.bold.white('Welcome to the Setup Wizard! 🚀')}

${chalk.bold.cyan('What You Need:')}
  ${chalk.gray('•')} eBay Client ID & Secret (from developer.ebay.com)
  ${chalk.gray('•')} Redirect URI (RuName from eBay Developer Portal)
  ${chalk.gray('•')} Optional: User tokens for higher rate limits

${chalk.bold.green('✨ Features:')}
  ${chalk.gray('•')} Auto-detect & configure LLM clients (Claude, Cline, Continue)
  ${chalk.gray('•')} Validate configuration with automated tests
  ${chalk.gray('•')} Smart defaults and validation

${chalk.gray('━'.repeat(70))}
`;

// ═══════════════════════════════════════════════════════════════════════════
// Helper Functions
// ═══════════════════════════════════════════════════════════════════════════

function displayLogo() {
  console.clear();
  console.log(EBAY_LOGO);
  console.log(CREATOR_CREDIT);
}

function displayWelcome() {
  displayLogo();
  console.log(OAUTH_SETUP_INFO);
  console.log(WELCOME_MESSAGE);
}

function validateRequired(value: string): boolean | string {
  return value.trim().length > 0 || 'This field is required';
}

function validateToken(value: string): boolean | string {
  if (!value) return true; // Optional field

  // Strip surrounding quotes if present (user might paste with quotes)
  const cleanValue = value.trim().replace(/^["']|["']$/g, '');

  if (!cleanValue.startsWith('v^1.1#')) {
    return 'Token should start with "v^1.1#" (quotes will be automatically removed)';
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

function generateEnvFile(config: Record<string, string>): void {
  const envPath = join(PROJECT_ROOT, '.env');

  const content = `# eBay API MCP Server Configuration
# Generated on ${new Date().toISOString()}

# ═══════════════════════════════════════════════════════════════════
# eBay App Credentials (Required)
# ═══════════════════════════════════════════════════════════════════
EBAY_CLIENT_ID=${config.EBAY_CLIENT_ID || 'your_client_id_here'}
EBAY_CLIENT_SECRET=${config.EBAY_CLIENT_SECRET || 'your_client_secret_here'}
EBAY_REDIRECT_URI=${config.EBAY_REDIRECT_URI || 'your_redirect_uri_here'}

# ═══════════════════════════════════════════════════════════════════
# Environment (sandbox or production)
# ═══════════════════════════════════════════════════════════════════
EBAY_ENVIRONMENT=${config.EBAY_ENVIRONMENT || 'sandbox'}

# ═══════════════════════════════════════════════════════════════════
# User Tokens (Optional - for user-specific API calls)
# ═══════════════════════════════════════════════════════════════════
# Get this token by:
# 1. Use ebay_get_oauth_url tool to generate authorization URL
# 2. Visit the URL and authorize
# 3. Decode the callback URL to extract tokens
# 4. Add your refresh token below
EBAY_USER_REFRESH_TOKEN=${config.EBAY_USER_REFRESH_TOKEN || ''}

# ═══════════════════════════════════════════════════════════════════
# Logging (Optional)
# ═══════════════════════════════════════════════════════════════════
LOG_LEVEL=${config.LOG_LEVEL || 'info'}
`;

  writeFileSync(envPath, content, 'utf-8');
  console.log(chalk.green(`✓ Configuration saved to ${envPath}`));
}

// ═══════════════════════════════════════════════════════════════════════════
// LLM Client Detection and Configuration
// ═══════════════════════════════════════════════════════════════════════════

async function detectAndConfigureLLMClients(): Promise<void> {
  console.log(chalk.bold.cyan('\n🔍 Detecting LLM Clients...\n'));

  const clients = detectLLMClients();
  const detectedClients = clients.filter((c) => c.detected);

  if (detectedClients.length === 0) {
    console.log(chalk.yellow('⚠️  No LLM clients detected on this system.\n'));
    console.log(chalk.gray('   Supported clients: Claude Desktop, Cline (VSCode), Continue.dev'));
    console.log(chalk.gray('   You can manually configure your MCP client later.\n'));
    return;
  }

  console.log(chalk.green(`Found ${detectedClients.length} LLM client(s):\n`));
  for (const client of detectedClients) {
    const status = client.configExists ? chalk.yellow('[Configured]') : chalk.gray('[Not Configured]');
    console.log(`  ${chalk.cyan('•')} ${client.displayName} ${status}`);
  }

  console.log('');

  const response = await prompts({
    type: 'multiselect',
    name: 'selectedClients',
    message: 'Which LLM clients would you like to configure?',
    choices: detectedClients.map((client) => ({
      title: client.displayName,
      value: client.name,
      selected: !client.configExists, // Auto-select unconfigured clients
    })),
    hint: 'Space to select, Enter to confirm',
  });

  if (!response.selectedClients || response.selectedClients.length === 0) {
    console.log(chalk.gray('\n  Skipping LLM client configuration.\n'));
    return;
  }

  console.log(chalk.bold.cyan('\n⚙️  Configuring LLM Clients...\n'));

  for (const clientName of response.selectedClients) {
    const client = detectedClients.find((c) => c.name === clientName);
    if (!client) continue;

    const success = configureLLMClient(clientName, PROJECT_ROOT);

    if (success) {
      console.log(chalk.green(`  ✓ ${client.displayName} configured successfully`));
      console.log(chalk.gray(`    Config: ${client.configPath}\n`));
    } else {
      console.log(chalk.red(`  ✗ Failed to configure ${client.displayName}`));
      console.log(chalk.yellow(`    Please configure manually at: ${client.configPath}\n`));
    }
  }

  console.log(chalk.bold.green('✨ LLM client configuration complete!'));
  console.log(chalk.gray('   Remember to restart your LLM client for changes to take effect.\n'));
}

// ═══════════════════════════════════════════════════════════════════════════
// Main Setup Flow
// ═══════════════════════════════════════════════════════════════════════════

async function runInteractiveSetup() {
  displayWelcome();

  // Load existing configuration
  const existingConfig = loadExistingConfig();
  const hasExisting = Object.keys(existingConfig).length > 0;

  if (hasExisting) {
    console.log(chalk.cyan('ℹ️  Found existing configuration.\n'));
  }

  // Collect configuration
  const config = await prompts([
    {
      type: 'text',
      name: 'EBAY_CLIENT_ID',
      message: 'eBay Client ID:',
      initial: existingConfig.EBAY_CLIENT_ID || '',
      validate: validateRequired,
    },
    {
      type: 'text',
      name: 'EBAY_CLIENT_SECRET',
      message: 'eBay Client Secret:',
      initial: existingConfig.EBAY_CLIENT_SECRET || '',
      validate: validateRequired,
    },
    {
      type: 'text',
      name: 'EBAY_REDIRECT_URI',
      message: 'eBay Redirect URI (RuName):',
      initial: existingConfig.EBAY_REDIRECT_URI || '',
      validate: validateRequired,
    },
    {
      type: 'select',
      name: 'EBAY_ENVIRONMENT',
      message: 'Environment:',
      choices: [
        { title: 'Sandbox (Development)', value: 'sandbox' },
        { title: 'Production (Live)', value: 'production' },
      ],
      initial: existingConfig.EBAY_ENVIRONMENT === 'production' ? 1 : 0,
    },
    {
      type: 'text',
      name: 'EBAY_USER_REFRESH_TOKEN',
      message: 'User Refresh Token (optional):',
      initial: existingConfig.EBAY_USER_REFRESH_TOKEN || '',
      validate: validateToken,
      format: (value: string) => {
        // Auto-strip quotes if user pastes token with quotes
        return value.trim().replace(/^["']|["']$/g, '');
      },
    },
  ]);

  // Check if user cancelled
  if (!config.EBAY_CLIENT_ID) {
    console.log(chalk.yellow('\n⚠️  Setup cancelled.\n'));
    process.exit(0);
  }

  // Review configuration
  console.log(chalk.bold.cyan('\n📋 Configuration Review:\n'));
  console.log(`  ${chalk.gray('Client ID:')} ${config.EBAY_CLIENT_ID}`);
  console.log(`  ${chalk.gray('Client Secret:')} ${'*'.repeat(config.EBAY_CLIENT_SECRET.length)}`);
  console.log(`  ${chalk.gray('Redirect URI:')} ${config.EBAY_REDIRECT_URI}`);
  console.log(`  ${chalk.gray('Environment:')} ${config.EBAY_ENVIRONMENT}`);
  console.log(`  ${chalk.gray('User Token:')} ${config.EBAY_USER_REFRESH_TOKEN ? '✓ Configured' : '✗ Not set'}\n`);

  const confirmation = await prompts({
    type: 'confirm',
    name: 'confirm',
    message: 'Save this configuration?',
    initial: true,
  });

  if (!confirmation.confirm) {
    console.log(chalk.yellow('\n⚠️  Configuration not saved.\n'));
    process.exit(0);
  }

  // Generate .env file
  generateEnvFile(config);

  // Detect and configure LLM clients
  await detectAndConfigureLLMClients();

  // Run validation tests
  console.log(chalk.bold.cyan('🧪 Running Configuration Validation...\n'));
  const summary = await validateSetup(PROJECT_ROOT);

  // Display recommendations
  displayRecommendations(summary);

  console.log(chalk.bold.green('✅ Setup complete!\n'));
  console.log(chalk.gray('Next steps:'));
  console.log(chalk.gray('  1. Restart your LLM client (Claude Desktop, Cline, etc.)'));
  console.log(chalk.gray('  2. The eBay MCP server should now be available'));
  console.log(chalk.gray('  3. Try using tools like: ebay_get_user, ebay_get_oauth_url\n'));
}

async function generateEnvOnly(reset: boolean) {
  const envPath = join(PROJECT_ROOT, '.env');

  if (reset && existsSync(envPath)) {
    console.log(chalk.yellow('⚠️  Resetting existing .env file...\n'));
    unlinkSync(envPath);
  } else if (existsSync(envPath) && !reset) {
    console.log(chalk.yellow('⚠️  .env file already exists. Use --reset-env to overwrite.\n'));
    process.exit(0);
  }

  console.log(chalk.cyan('📄 Generating .env template...\n'));
  generateEnvFile({});
  console.log(chalk.green('\n✅ .env template generated!'));
  console.log(chalk.gray('\nEdit the .env file with your eBay credentials, then run:'));
  console.log(chalk.cyan('  npm run setup\n'));
}

// ═══════════════════════════════════════════════════════════════════════════
// Main Entry Point
// ═══════════════════════════════════════════════════════════════════════════

async function main() {
  const args = parseArgs();

  if (args.help) {
    showHelp();
    process.exit(0);
  }

  if (args.generateEnv || args.resetEnv) {
    await generateEnvOnly(args.resetEnv);
    process.exit(0);
  }

  // Run interactive setup
  await runInteractiveSetup();
}

// Handle Ctrl+C gracefully
process.on('SIGINT', () => {
  console.log(chalk.yellow('\n\n⚠️  Setup interrupted by user.\n'));
  process.exit(0);
});

// Run main
main().catch((error) => {
  console.error(chalk.red('\n❌ Setup failed:'), error);
  process.exit(1);
});
