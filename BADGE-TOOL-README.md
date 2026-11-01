# Discord Badge Tool

A tool for managing Discord profile badges, focusing on HypeSquad badges (Bravery, Brilliance, Balance).

## ⚠️ Important Warnings

- **Using unofficial API methods may violate Discord's Terms of Service**
- **Account bans are possible** (though rare for HypeSquad badge actions)
- **Use at your own risk**
- **This tool is for educational purposes only**

## Supported Badges

### Currently Obtainable:
- **HypeSquad Bravery** (Red badge) - House ID: 1
- **HypeSquad Brilliance** (Green badge) - House ID: 2  
- **HypeSquad Balance** (Blue badge) - House ID: 3

### Not Currently Obtainable:
- **Last Meadow Online** - Limited-time event (April 1-7, 2026)
- **Early Supporter** - Historical only
- **Discord Staff** - Employees only
- **Partner** - Partnership program

### Other Obtainable Badges (different methods):
- **Active Developer** - Create a bot with slash commands
- **Bug Hunter** - Report security vulnerabilities
- **Verified Bot** - Apply for bot verification

## Installation

```bash
cd /path/to/rwb-quest-tool
npm install
```

## Usage

### 1. Interactive Mode (Recommended)
```bash
npx tsx badge-tool.ts
```

This will show a menu with options:
- View badge information
- Generate browser script
- Check current badges
- Exit

### 2. Generate Browser Script (Safest Method)
```bash
# Generate script for Bravery (Red)
npx tsx badge-tool.ts --script 1

# Generate script for Brilliance (Green)  
npx tsx badge-tool.ts --script 2

# Generate script for Balance (Blue)
npx tsx badge-tool.ts --script 3
```

Then:
1. Open Discord in browser (`discord.com/app`)
2. Open Developer Console (`Ctrl+Shift+J` on Windows/Linux, `Cmd+Option+J` on Mac)
3. Paste the generated script
4. Press Enter
5. Refresh Discord to see the badge

### 3. View Badge Information
```bash
npx tsx badge-tool.ts --info
```

### 4. Direct API Method (Riskier)
```bash
npx tsx badge-tool.ts --token YOUR_TOKEN --house 1
```

## How It Works

### Browser Script Method
The browser script method works by:
1. Accessing Discord's internal webpack modules
2. Finding the HTTP utility functions
3. Calling the internal `/hypesquad/online` endpoint
4. Setting your house ID (1, 2, or 3)

This is the same method that was previously available in Discord's settings before they removed the HypeSquad quiz in September 2025.

### API Method
The API method attempts to use Discord's REST API directly, but note:
- The `/hypesquad/online` endpoint is not part of the official public API
- This method may not work if Discord changes their internal endpoints
- The browser method is more reliable

## Removing a Badge

To remove a HypeSquad badge, use the browser script method:

```javascript
// Remove HypeSquad Badge Script
let wreq = webpackChunkdiscord_app.push([[Symbol()],{},r=>r]);
webpackChunkdiscord_app.pop();
const chunks = Object.entries(wreq.m);
const findChunkByCode = (...codes) => {
    for (let i = 0; i < chunks.length; i++) {
        const [id,func] = chunks[i];
        const chunkCode = func.toString();
        if (codes.every(code=>chunkCode.includes(code))) return wreq(id);
    }
};

const api = Object.values(findChunkByCode("HTTPUtils")).find(e=>e?.get);

api.delete({url: "/hypesquad/online"});

console.log("HypeSquad badge removed! Refresh Discord.");
```

## Code Structure

- `src/badge.ts` - Core BadgeManager class and utilities
- `badge-tool.ts` - CLI interface
- `BADGE-TOOL-README.md` - This documentation

### Key Classes

#### `BadgeManager`
- `addHypeSquadBadge(houseId)` - Attempt to add badge via API
- `getUserBadges()` - Check current badges
- `getBadgeInfo()` - Get information about badges

#### `BadgeUtils`
- `getAllBadgeInfo()` - Comprehensive badge information
- `isBadgeObtainable(badgeName)` - Check if badge can be obtained

## Notes on Other Badges

### Active Developer Badge
To get the Active Developer badge:
1. Create a Discord application at `https://discord.com/developers/applications`
2. Add a bot to your application
3. Create slash commands
4. Have users use your slash commands
5. Wait 24 hours and check `https://discord.com/developers/active-developer`

### Last Meadow Online
This was an April Fools event in 2026 that ran from April 1-7. The badge showed which level you reached in the game. It is no longer obtainable.

## Troubleshooting

### Browser Script Not Working
1. Make sure you're on the web version of Discord (`discord.com/app`)
2. Fully reload the page (`Ctrl+F5`)
3. Try logging out and back in
4. The script may need updating if Discord changes their internals

### API Method Failing
The API method is less reliable. Use the browser script method instead.

### Badge Not Appearing
1. Refresh Discord completely
2. Log out and back in
3. Wait a few minutes and check again

## Legal Disclaimer

This tool is provided for educational purposes only. The author is not responsible for any account actions taken by Discord. Use of this tool may violate Discord's Terms of Service. You accept all risks when using this tool.

## License

MIT License - Free to use, modify, and share.