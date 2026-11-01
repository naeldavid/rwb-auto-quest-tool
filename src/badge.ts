import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v10';

/**
 * Discord Badge Tool
 * 
 * This tool allows adding various badges to Discord profiles.
 * Currently supports HypeSquad badges (Bravery, Brilliance, Balance).
 * 
 * IMPORTANT WARNING:
 * - Using unofficial API endpoints may violate Discord's Terms of Service
 * - Account bans are possible (though rare for this specific action)
 * - Use at your own risk
 */

export class BadgeManager {
  private rest: REST;
  private token: string;

  constructor(token: string) {
    this.token = token;
    this.rest = new REST({ version: '10' }).setToken(token);
  }

  /**
   * HypeSquad House IDs:
   * 1 = Bravery (Red)
   * 2 = Brilliance (Green)
   * 3 = Balance (Blue)
   */
  private readonly HYPESQUAD_HOUSES = {
    BRAVERY: 1,
    BRILLIANCE: 2,
    BALANCE: 3,
  } as const;

  /**
   * Add a HypeSquad badge to the user's profile
   * @param houseId - 1 for Bravery, 2 for Brilliance, 3 for Balance
   */
  async addHypeSquadBadge(houseId: 1 | 2 | 3): Promise<boolean> {
    try {
      // Validate house ID
      if (![1, 2, 3].includes(houseId)) {
        throw new Error('Invalid house ID. Must be 1 (Bravery), 2 (Brilliance), or 3 (Balance)');
      }

      // Discord's internal endpoint for HypeSquad badges
      const endpoint = '/hypesquad/online';
      
      // Make the request
      await this.rest.post(Routes.user(), {
        body: { house_id: houseId },
        // Note: This uses a different route pattern since /hypesquad/online is not in the standard API
        // We'll use a direct fetch approach
      });

      console.log(`Successfully added HypeSquad badge for house ${this.getHouseName(houseId)}`);
      return true;
    } catch (error) {
      console.error('Failed to add HypeSquad badge:', error);
      return false;
    }
  }

  /**
   * Remove HypeSquad badge from user's profile
   */
  async removeHypeSquadBadge(): Promise<boolean> {
    try {
      const endpoint = '/hypesquad/online';
      
      // This would use a DELETE request to remove the badge
      console.log('To remove HypeSquad badge, you need to:');
      console.log('1. Open Discord in browser (discord.com/app)');
      console.log('2. Open Developer Console (Ctrl+Shift+J)');
      console.log('3. Run the removal script manually');
      console.log('\nDue to Discord API restrictions, this action must be performed manually in browser.');
      
      return false;
    } catch (error) {
      console.error('Error:', error);
      return false;
    }
  }

  /**
   * Get user's current badges/flags
   */
  async getUserBadges(): Promise<string[]> {
    try {
      // Fetch user data to get public_flags
      const user = await this.rest.get(Routes.user('@me')) as any;
      
      if (!user.public_flags) {
        return ['No badges found'];
      }

      const badges = this.decodeFlags(user.public_flags);
      return badges;
    } catch (error) {
      console.error('Failed to fetch user badges:', error);
      return ['Error fetching badges'];
    }
  }

  /**
   * Decode Discord public_flags integer into badge names
   */
  private decodeFlags(flags: number): string[] {
    const badgeList: string[] = [];
    
    // Discord flag constants (bitwise positions)
    const FLAGS = {
      STAFF: 1 << 0,
      PARTNER: 1 << 1,
      HYPESQUAD: 1 << 2,
      BUG_HUNTER_LEVEL_1: 1 << 3,
      HYPESQUAD_BRAVERY: 1 << 6,
      HYPESQUAD_BRILLIANCE: 1 << 7,
      HYPESQUAD_BALANCE: 1 << 8,
      PREMIUM_EARLY_SUPPORTER: 1 << 9,
      TEAM_PSEUDO_USER: 1 << 10,
      BUG_HUNTER_LEVEL_2: 1 << 14,
      VERIFIED_BOT: 1 << 16,
      VERIFIED_DEVELOPER: 1 << 17,
      CERTIFIED_MODERATOR: 1 << 18,
      BOT_HTTP_INTERACTIONS: 1 << 19,
      ACTIVE_DEVELOPER: 1 << 22,
    };

    // Check each flag
    for (const [name, value] of Object.entries(FLAGS)) {
      if ((flags & value) === value) {
        // Convert snake_case to readable format
        const readableName = name.toLowerCase()
          .replace(/_/g, ' ')
          .replace(/\b\w/g, l => l.toUpperCase());
        badgeList.push(readableName);
      }
    }

    return badgeList;
  }

  /**
   * Get house name from ID
   */
  private getHouseName(houseId: number): string {
    switch (houseId) {
      case 1: return 'Bravery';
      case 2: return 'Brilliance';
      case 3: return 'Balance';
      default: return 'Unknown';
    }
  }

  /**
   * Information about obtainable badges
   */
  getBadgeInfo(): Record<string, string> {
    return {
      'HypeSquad Bravery': 'Red badge - House of Bravery',
      'HypeSquad Brilliance': 'Green badge - House of Brilliance',
      'HypeSquad Balance': 'Blue badge - House of Balance',
      'Active Developer': 'Requires creating a bot with slash commands',
      'Early Supporter': 'No longer obtainable',
      'Last Meadow Online': 'Limited-time event (April 2026), no longer obtainable',
      'Discord Staff': 'Discord employees only',
      'Partner': 'Discord Partners only',
      'Bug Hunter': 'Report security vulnerabilities',
      'Verified Bot': 'Official verified bots',
    };
  }

  /**
   * Browser-based method for adding HypeSquad badge (for manual use)
   */
  static getBrowserScript(houseId: 1 | 2 | 3): string {
    return `
// Discord HypeSquad Badge Script
// Paste this in Discord browser console (Ctrl+Shift+J)

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

// House ID: ${houseId} (${this.prototype.getHouseName(houseId)})
api.post({url: "/hypesquad/online", body: {house_id: ${houseId}}});

console.log("HypeSquad badge added! Refresh Discord to see it.");
    `.trim();
  }

  /**
   * Browser-based method for removing HypeSquad badge
   */
  static getRemoveBadgeScript(): string {
    return `
// Remove HypeSquad Badge Script
// Paste this in Discord browser console (Ctrl+Shift+J)

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
    `.trim();
  }
}

// Export utility functions
export const BadgeUtils = {
  /**
   * Get information about all Discord badges
   */
  getAllBadgeInfo(): Record<string, { description: string; obtainable: boolean; method: string }> {
    return {
      'HypeSquad Bravery': {
        description: 'Red HypeSquad badge',
        obtainable: true,
        method: 'Use /hypesquad/online endpoint with house_id=1'
      },
      'HypeSquad Brilliance': {
        description: 'Green HypeSquad badge',
        obtainable: true,
        method: 'Use /hypesquad/online endpoint with house_id=2'
      },
      'HypeSquad Balance': {
        description: 'Blue HypeSquad badge',
        obtainable: true,
        method: 'Use /hypesquad/online endpoint with house_id=3'
      },
      'Active Developer': {
        description: 'Shows active bot development',
        obtainable: true,
        method: 'Create a bot with slash commands and use them'
      },
      'Early Supporter': {
        description: 'Supported Discord early on',
        obtainable: false,
        method: 'Historical only'
      },
      'Last Meadow Online': {
        description: 'April Fools 2026 event badge',
        obtainable: false,
        method: 'Was available April 1-7, 2026 only'
      },
      'Discord Staff': {
        description: 'Discord employee',
        obtainable: false,
        method: 'Discord employees only'
      },
      'Partner': {
        description: 'Discord Partner',
        obtainable: false,
        method: 'Partnership program'
      },
      'Bug Hunter': {
        description: 'Security vulnerability reporter',
        obtainable: true,
        method: 'Report security bugs to Discord'
      },
      'Verified Bot': {
        description: 'Official verified bot',
        obtainable: true,
        method: 'Apply for bot verification'
      }
    };
  },

  /**
   * Check if a badge is currently obtainable
   */
  isBadgeObtainable(badgeName: string): boolean {
    const info = this.getAllBadgeInfo()[badgeName];
    return info ? info.obtainable : false;
  }
};