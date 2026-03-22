import { Achievement, Transaction, Portfolio } from '../types';

const achievementTemplates: Omit<Achievement, 'unlocked' | 'unlockedAt' | 'progress'>[] = [
  {
    id: 'first_trade',
    title: 'First Trade',
    description: 'Complete your first stock transaction',
    icon: '🎯',
    target: 1,
  },
  {
    id: 'diversified',
    title: 'Diversified Investor',
    description: 'Own stocks from 3 different sectors',
    icon: '🌈',
    target: 3,
  },
  {
    id: 'trader_10',
    title: 'Active Trader',
    description: 'Complete 10 transactions',
    icon: '📈',
    target: 10,
  },
  {
    id: 'profit_1000',
    title: 'First Thousand',
    description: 'Achieve $1,000 in total gains',
    icon: '💰',
    target: 1000,
  },
  {
    id: 'portfolio_15k',
    title: 'Growing Wealth',
    description: 'Reach a portfolio value of $15,000',
    icon: '🏆',
    target: 15000,
  },
  {
    id: 'buy_the_dip',
    title: 'Buy the Dip',
    description: 'Purchase a stock that is down more than 2%',
    icon: '🎢',
    target: 1,
  },
];

export const checkAchievements = (
  transactions: Transaction[],
  portfolio: Portfolio,
  currentAchievements: Achievement[],
  setAchievements: React.Dispatch<React.SetStateAction<Achievement[]>>,
  onNewAchievement?: (achievement: Achievement) => void
) => {
  const newAchievements: Achievement[] = achievementTemplates.map(template => {
    let progress = 0;
    let unlocked = false;

    // Check if it was already unlocked
    const existing = currentAchievements.find(a => a.id === template.id);
    const wasUnlocked = existing?.unlocked || false;

    switch (template.id) {
      case 'first_trade':
        progress = Math.min(transactions.length, 1);
        unlocked = transactions.length >= 1;
        break;
      
      case 'diversified':
        const uniqueSectors = new Set(
          portfolio.holdings.map(h => {
            // Would need to map holdings to sectors - simplified for now
            return h.symbol;
          })
        );
        progress = Math.min(uniqueSectors.size, 3);
        unlocked = uniqueSectors.size >= 3;
        break;
      
      case 'trader_10':
        progress = Math.min(transactions.length, 10);
        unlocked = transactions.length >= 10;
        break;
      
      case 'profit_1000':
        progress = Math.min(portfolio.totalGainLoss, 1000);
        unlocked = portfolio.totalGainLoss >= 1000;
        break;
      
      case 'portfolio_15k':
        progress = Math.min(portfolio.totalValue, 15000);
        unlocked = portfolio.totalValue >= 15000;
        break;
      
      case 'buy_the_dip':
        // Check if any buy transaction was for a stock down more than 2%
        // Simplified implementation
        progress = 0;
        unlocked = false;
        break;
    }

    const achievement = {
      ...template,
      progress,
      unlocked,
      unlockedAt: unlocked ? (existing?.unlockedAt || new Date()) : undefined,
    };

    // Trigger notification for newly unlocked achievements
    if (unlocked && !wasUnlocked && onNewAchievement) {
      onNewAchievement(achievement);
    }

    return achievement;
  });

  setAchievements(newAchievements);
};