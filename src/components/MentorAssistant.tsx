import { useState } from 'react';
import type { Transaction } from '../types';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { MessageCircle, X } from 'lucide-react';

interface MentorAssistantProps {
  userLevel: number;
  portfolioValue: number;
  recentTransactions: Transaction[];
}

export function MentorAssistant({ userLevel, portfolioValue, recentTransactions }: MentorAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);

  const getMentorMessage = () => {
    if (recentTransactions.length === 0) {
      return "Hey! I'm Alex, your mentor. Ready to make your first trade? Head to the Market tab!";
    }

    if (portfolioValue > 12000) {
      return "Great work! You're showing a profit. Remember to diversify your portfolio.";
    }

    if (portfolioValue < 9000) {
      return "Don't worry about short-term losses. Investing is a long-term game.";
    }

    if (recentTransactions.length < 5) {
      return "You're building experience! Try exploring different sectors.";
    }

    return "You're doing well! Keep analyzing trends and company performance.";
  };

  const getMentorTip = () => {
    const tips = [
      "💡 Look for stocks with consistent performance.",
      "📊 A balanced portfolio has stocks from multiple sectors.",
      "🎯 Your average price adjusts when you buy more shares.",
      "⚖️ Keep some cash reserves for future opportunities.",
      "📈 Check the overall trend before buying!",
    ];
    return tips[Math.floor(Math.random() * tips.length)];
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 rounded-full h-12 w-12 shadow-lg bg-indigo-600 hover:bg-indigo-700"
      >
        <MessageCircle className="h-5 w-5" />
      </Button>
    );
  }

  return (
    <Card className="m-4 shadow-xl">
      <div className="p-3">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm">
              🎓
            </div>
            <div>
              <p className="text-xs">Alex - Your Mentor</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(false)}
            className="h-6 w-6 p-0"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>

        <div className="space-y-2">
          <div className="bg-indigo-50 rounded-lg p-2">
            <p className="text-xs text-gray-700">{getMentorMessage()}</p>
          </div>

          <div className="bg-blue-50 rounded-lg p-2">
            <p className="text-xs text-gray-700">{getMentorTip()}</p>
          </div>

          <div className="pt-1 border-t">
            <p className="text-xs text-gray-600">
              Level {userLevel} • ${portfolioValue.toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}