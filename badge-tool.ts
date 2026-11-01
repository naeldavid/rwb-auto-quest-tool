#!/usr/bin/env tsx
/**
 * Discord Badge Tool CLI
 * 
 * A command-line tool for managing Discord profile badges.
 * Currently focuses on HypeSquad badges.
 * 
 * Usage:
 *   npx tsx badge-tool.ts --token YOUR_TOKEN --house 1
 *   npx tsx badge-tool.ts --info
 *   npx tsx badge-tool.ts --script 2
 */

import chalk from 'chalk';
import { BadgeManager, BadgeUtils } from './src/badge';
import * as readline from 'readline';

// Parse command line arguments
const args = process.argv.slice(2);
const flags: Record<string, string | boolean> = {};

for (let i = 0; i < args.length; i++) {
  const arg = args[i];
  if (arg.startsWith('--')) {
    const key = arg.slice(2);
    if (i + 1 < args.length && !args[i + 1].startsWith('--')) {
      flags[key] = args[i + 1];
      i++;
    } else {
      flags[key] = true;
    }
  }
}

// Create readline interface for interactive prompts
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function main() {
  console.log(chalk.cyan('\n=== Discord Badge Tool ===\n'));

  // Show badge information
  if (flags.info) {
    showBadgeInfo();
    return;
  }

  // Generate browser script
  if (flags.script) {
    const houseId = parseInt(flags.script as string);
    if ([1, 2, 3].includes(houseId)) {
      generateBrowserScript(houseId as 1 | 2 | 3);
    } else {
      console.log(chalk.red('Invalid house ID. Use 1, 2, or 3.'));
      console.log(chalk.yellow('1 = Bravery (Red)'));
      console.log(chalk.yellow('2 = Brilliance (Green)'));
      console.log(chalk.yellow('3 = Balance (Blue)'));
    }
    return;
  }

  // Interactive mode
  if (!flags.token) {
    await interactiveMode();
    return;
  }

  // Direct execution with token
  const token = flags.token as string;
  const houseId = flags.house ? parseInt(flags.house as string) as (1 | 2 | 3) : undefined;

  if (!houseId || ![1, 2, 3].includes(houseId)) {
    console.log(chalk.red('Please specify a valid house ID with --house flag'));
    console.log(chalk.yellow('--house 1 (Bravery)'));
    console.log(chalk.yellow('--house 2 (Brilliance)'));
    console.log(chalk.yellow('--house 3 (Balance)'));
    return;
  }

  await executeBadgeAdd(token, houseId);
}

function showBadgeInfo() {
  console.log(chalk.bold.white('\nDiscord Badge Information:\n'));
  
  const badgeInfo = BadgeUtils.getAllBadgeInfo();
  for (const [badgeName, info] of Object.entries(badgeInfo)) {
    const status = info.obtainable ? chalk.green('✓ Obtainable') : chalk.red('✗ Not Obtainable');
    console.log(chalk.bold.cyan(`${badgeName}`));
    console.log(`  ${chalk.white(info.description)}`);
    console.log(`  ${status}`);
    console.log(`  ${chalk.gray('Method:')} ${chalk.yellow(info.method)}`);
    console.log();
  }

  console.log(chalk.yellow('\nImportant Notes:'));
  console.log(chalk.gray('1. Using unofficial methods may violate Discord ToS'));
  console.log(chalk.gray('2. Account bans are possible (though rare)'));
  console.log(chalk.gray('3. Use at your own risk'));
}

function generateBrowserScript(houseId: 1 | 2 | 3) {
  console.log(chalk.cyan('\n=== Browser Script for HypeSquad Badge ===\n'));
  console.log(chalk.white('Instructions:'));
  console.log(chalk.gray('1. Open Discord in browser (discord.com/app)'));
  console.log(chalk.gray('2. Open Developer Console (Ctrl+Shift+J)'));
  console.log(chalk.gray('3. Paste the script below'));
  console.log(chalk.gray('4. Press Enter'));
  console.log(chalk.gray('5. Refresh Discord to see the badge\n'));
  
  console.log(chalk.green('Script:'));
  console.log(chalk.gray('```javascript'));
  console.log(BadgeManager.getBrowserScript(houseId));
  console.log(chalk.gray('```\n'));
  
  const houseNames = ['Bravery (Red)', 'Brilliance (Green)', 'Balance (Blue)'];
  console.log(chalk.yellow(`This will add: ${houseNames[houseId - 1]}`));
}

async function interactiveMode() {
  console.log(chalk.white('Select an option:'));
  console.log(chalk.cyan('1. View badge information'));
  console.log(chalk.cyan('2. Generate browser script for HypeSquad badge'));
  console.log(chalk.cyan('3. Check current badges (requires token)'));
  console.log(chalk.cyan('4. Exit\n'));

  const choice = await askQuestion(chalk.yellow('Enter choice (1-4): '));

  switch (choice) {
    case '1':
      showBadgeInfo();
      break;
    case '2':
      await selectHouseForScript();
      break;
    case '3':
      await checkBadgesInteractive();
      break;
    case '4':
      console.log(chalk.gray('Exiting...'));
      break;
    default:
      console.log(chalk.red('Invalid choice'));
  }
}

async function selectHouseForScript() {
  console.log(chalk.white('\nSelect HypeSquad house:'));
  console.log(chalk.red('1. Bravery (Red)'));
  console.log(chalk.green('2. Brilliance (Green)'));
  console.log(chalk.blue('3. Balance (Blue)\n'));

  const houseChoice = await askQuestion(chalk.yellow('Enter house number (1-3): '));
  const houseId = parseInt(houseChoice);

  if ([1, 2, 3].includes(houseId)) {
    generateBrowserScript(houseId as 1 | 2 | 3);
  } else {
    console.log(chalk.red('Invalid choice'));
  }
}

async function checkBadgesInteractive() {
  console.log(chalk.white('\nTo check your current badges:'));
  console.log(chalk.gray('1. You need your Discord token'));
  console.log(chalk.gray('2. This will make an API call to Discord'));
  console.log(chalk.gray('3. Your token is never stored or sent elsewhere\n'));

  const token = await askQuestion(chalk.yellow('Enter your Discord token (or press Enter to cancel): '));
  
  if (!token.trim()) {
    console.log(chalk.gray('Cancelled'));
    return;
  }

  try {
    const badgeManager = new BadgeManager(token);
    const badges = await badgeManager.getUserBadges();
    
    console.log(chalk.cyan('\n=== Your Current Badges ===\n'));
    
    if (badges.length === 0 || badges[0] === 'No badges found') {
      console.log(chalk.yellow('No badges found on your profile'));
    } else {
      badges.forEach((badge, index) => {
        console.log(chalk.green(`${index + 1}. ${badge}`));
      });
    }
    
    console.log();
  } catch (error) {
    console.log(chalk.red('Error fetching badges. The token might be invalid.'));
  }
}

async function executeBadgeAdd(token: string, houseId: 1 | 2 | 3) {
  console.log(chalk.yellow('\n⚠️  IMPORTANT WARNING ⚠️'));
  console.log(chalk.red('Using unofficial API methods may violate Discord Terms of Service.'));
  console.log(chalk.red('Account bans are possible (though rare for this action).'));
  console.log(chalk.red('Use at your own risk!\n'));

  const confirm = await askQuestion(chalk.yellow('Do you want to proceed? (yes/no): '));
  
  if (confirm.toLowerCase() !== 'yes') {
    console.log(chalk.gray('Operation cancelled'));
    return;
  }

  console.log(chalk.cyan('\nAttempting to add HypeSquad badge...'));
  
  try {
    const badgeManager = new BadgeManager(token);
    const success = await badgeManager.addHypeSquadBadge(houseId);
    
    if (success) {
      console.log(chalk.green('✅ Success!'));
      console.log(chalk.white('Refresh Discord to see your new badge.'));
    } else {
      console.log(chalk.red('❌ Failed to add badge'));
      console.log(chalk.yellow('Try the browser script method instead.'));
    }
  } catch (error) {
    console.log(chalk.red('Error:', error instanceof Error ? error.message : 'Unknown error'));
    console.log(chalk.yellow('The API method might not work. Try the browser script instead.'));
  }
}

function askQuestion(question: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
}

// Handle cleanup
process.on('SIGINT', () => {
  console.log(chalk.gray('\n\nExiting...'));
  rl.close();
  process.exit(0);
});

// Run main function
main().catch(console.error).finally(() => {
  rl.close();
});