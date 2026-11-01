# rwb's Auto-Quest Discord Tool

> **Disclaimer:** Selfbots are against Discord ToS. Use this at your own risk. I am not responsible for any bans.

Automated bot for completing Discord Quests with a clean CLI interface, live countdown feature, and **automatic Orb reward filtering**.

## Features

- **Clean CLI Interface:** Uses organized tables and ASCII art
- **Live Countdown:** Displays remaining quest time in real-time
- **Orb-Only Filter:** Automatically filters and completes only quests that reward Orbs
- **Multi-Account Support:** Easily switch between multiple Discord accounts
- **Smart Quest Detection:** Supports both legacy and v2 Discord quest API formats
- **Fast & Lightweight:** Built with TypeScript & modern Node.js

## Installation & Setup

> [!NOTE]
> **Requirements:**
>
> - **[Node.js](https://nodejs.org/) 18.0.0 or newer**
> - **[Git](https://git-scm.com/)**
> - **Windows users:** [WSL (Windows Subsystem for Linux)](https://learn.microsoft.com/en-us/windows/wsl/install) is required

## How to Install & Run

Follow these steps in your terminal (CMD/PowerShell/Bash):

### 1. Clone Repository

```bash
git clone https://github.com/lfathh/Auto-Quest-Discord.git
cd Auto-Quest-Discord
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Get Your Discord Token

> [!WARNING]
> **Never share your token with anyone!** Treat it like a password.

1. Open **Microsoft Edge** (or any Chromium browser)
1. Go to **[Discord Web](https://discord.com/app)**
1. Press **F12** to open Developer Tools
1. Go to the **Console** tab
1. Paste this script and press **Enter**:

```javascript
const iframe = document.createElement("iframe");
console.log(
  "Token: %c%s",
  "font-size:16px;",
  JSON.parse(
    document.body.appendChild(iframe).contentWindow.localStorage.token,
  ),
);
iframe.remove();
```

1. Copy the token that appears (without quotes)

### 4. Setup Tokens

Create a new file named `.env` in the bot folder, then add your Discord tokens:

```env
TOKEN-1=YOUR_FIRST_DISCORD_TOKEN_HERE
TOKEN-2=YOUR_SECOND_DISCORD_TOKEN_HERE
TOKEN-MAIN=ANOTHER_TOKEN_HERE
TOKEN-ALT=YET_ANOTHER_TOKEN_HERE
```

> [!TIP]
> **Add as many accounts as you want!** Just follow the format `TOKEN-NAME=your_token_here`. The bot will automatically detect all tokens and let you choose which one to use.

### 5. Run Script

```bash
npm start
```

## How It Works

1. **Automatically detects all tokens** in your `.env` file (any variable starting with `TOKEN-`)
1. **Prompts you to select** which account to use from the available options
1. **Fetches all available Discord quests** from the selected account
1. **Filters quests** to only include those that reward Orbs (skips decorations, tokens, etc.)
1. **Automatically enrolls** in filtered quests
1. **Completes quest tasks** by spoofing video watch time or game activity
1. **Live progress tracking** with real-time countdown timers

## Example Output

The bot will display:

- Total quests found vs. Orb quests filtered
- Live progress table with quest names, rewards, and countdown timers
- Final execution report showing success/failure for each quest

## Technical Details

- Supports **WATCH_VIDEO** and **WATCH_VIDEO_ON_MOBILE** quest types
- Supports **PLAY_ON_DESKTOP** quest types with heartbeat spoofing
- Handles both `task_config` (legacy) and `task_config_v2` (new) API formats
- Automatically skips completed or expired quests

## 🙏 Credits

> [discord.js](https://github.com/discordjs/discord.js)
>
> Original concept by [lfathh](https://github.com/lfathh)
>
> Modified by rwb
