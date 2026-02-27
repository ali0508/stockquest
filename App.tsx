import { useState, useEffect } from "react";
import { Dashboard } from "./components/Dashboard";
import { MarketView } from "./components/MarketView";
import { PortfolioView } from "./components/PortfolioView";
import { AchievementsView } from "./components/AchievementsView";
import { TutorialDialog } from "./components/TutorialDialog";
import { MentorAssistant } from "./components/MentorAssistant";
import { AchievementNotification } from "./components/AchievementNotification";
import {
  Stock,
  Portfolio,
  Achievement,
  Transaction,
} from "./types";
import {
  generateInitialStocks,
  updateStockPrices,
} from "./utils/market";
import { checkAchievements } from "./utils/achievements";

export default function App() {
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "market" | "portfolio" | "achievements"
  >("dashboard");
  const [stocks, setStocks] = useState<Stock[]>(
    generateInitialStocks(),
  );
  const [portfolio, setPortfolio] = useState<Portfolio>({
    cash: 10000,
    holdings: [],
    totalValue: 10000,
    totalGainLoss: 0,
  });
  const [transactions, setTransactions] = useState<
    Transaction[]
  >([]);
  const [achievements, setAchievements] = useState<
    Achievement[]
  >([]);
  const [showTutorial, setShowTutorial] = useState(true);
  const [userLevel, setUserLevel] = useState(1);
  const [experiencePoints, setExperiencePoints] = useState(0);
  const [newAchievement, setNewAchievement] =
    useState<Achievement | null>(null);

  // Simulate market updates every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setStocks((prevStocks) => updateStockPrices(prevStocks));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Update portfolio value when stocks change
  useEffect(() => {
    const holdingsValue = portfolio.holdings.reduce(
      (total, holding) => {
        const stock = stocks.find(
          (s) => s.symbol === holding.symbol,
        );
        return (
          total + (stock ? stock.price * holding.quantity : 0)
        );
      },
      0,
    );

    const totalValue = portfolio.cash + holdingsValue;
    const totalGainLoss = totalValue - 10000; // Initial capital

    setPortfolio((prev) => ({
      ...prev,
      totalValue,
      totalGainLoss,
    }));
  }, [stocks, portfolio.holdings, portfolio.cash]);

  const handleBuyStock = (symbol: string, quantity: number) => {
    const stock = stocks.find((s) => s.symbol === symbol);
    if (!stock) return;

    const totalCost = stock.price * quantity;
    if (totalCost > portfolio.cash) {
      return { success: false, message: "Insufficient funds!" };
    }

    const existingHolding = portfolio.holdings.find(
      (h) => h.symbol === symbol,
    );
    const newHoldings = existingHolding
      ? portfolio.holdings.map((h) =>
          h.symbol === symbol
            ? {
                ...h,
                quantity: h.quantity + quantity,
                averagePrice:
                  (h.averagePrice * h.quantity + totalCost) /
                  (h.quantity + quantity),
              }
            : h,
        )
      : [
          ...portfolio.holdings,
          { symbol, quantity, averagePrice: stock.price },
        ];

    setPortfolio((prev) => ({
      ...prev,
      cash: prev.cash - totalCost,
      holdings: newHoldings,
    }));

    const transaction: Transaction = {
      id: Date.now().toString(),
      type: "buy",
      symbol,
      quantity,
      price: stock.price,
      total: totalCost,
      timestamp: new Date(),
    };

    setTransactions((prev) => [transaction, ...prev]);
    addExperience(10);
    checkAchievements(
      transactions.concat(transaction),
      portfolio,
      achievements,
      setAchievements,
      setNewAchievement,
    );

    return {
      success: true,
      message: `Successfully bought ${quantity} shares of ${symbol}!`,
    };
  };

  const handleSellStock = (
    symbol: string,
    quantity: number,
  ) => {
    const stock = stocks.find((s) => s.symbol === symbol);
    const holding = portfolio.holdings.find(
      (h) => h.symbol === symbol,
    );

    if (!stock || !holding || holding.quantity < quantity) {
      return {
        success: false,
        message: "Insufficient shares to sell!",
      };
    }

    const totalRevenue = stock.price * quantity;
    const newHoldings =
      holding.quantity === quantity
        ? portfolio.holdings.filter((h) => h.symbol !== symbol)
        : portfolio.holdings.map((h) =>
            h.symbol === symbol
              ? { ...h, quantity: h.quantity - quantity }
              : h,
          );

    setPortfolio((prev) => ({
      ...prev,
      cash: prev.cash + totalRevenue,
      holdings: newHoldings,
    }));

    const transaction: Transaction = {
      id: Date.now().toString(),
      type: "sell",
      symbol,
      quantity,
      price: stock.price,
      total: totalRevenue,
      timestamp: new Date(),
    };

    setTransactions((prev) => [transaction, ...prev]);
    addExperience(15);
    checkAchievements(
      transactions.concat(transaction),
      portfolio,
      achievements,
      setAchievements,
      setNewAchievement,
    );

    return {
      success: true,
      message: `Successfully sold ${quantity} shares of ${symbol}!`,
    };
  };

  const addExperience = (points: number) => {
    const newExp = experiencePoints + points;
    const newLevel = Math.floor(newExp / 100) + 1;

    setExperiencePoints(newExp);
    if (newLevel > userLevel) {
      setUserLevel(newLevel);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-[390px] min-h-[844px] bg-white shadow-2xl rounded-3xl overflow-hidden relative">
        <TutorialDialog
          open={showTutorial}
          onOpenChange={setShowTutorial}
        />
        <AchievementNotification
          achievement={newAchievement}
          onClose={() => setNewAchievement(null)}
        />

        <div className="h-full overflow-y-auto">
          <header className="p-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h1 className="text-white">StockQuest</h1>
                <p className="text-sm text-indigo-100">
                  Learn investing
                </p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2">
                <p className="text-xs text-white/90">
                  Level {userLevel}
                </p>
                <div className="w-20 h-1.5 bg-white/30 rounded-full mt-1">
                  <div
                    className="h-full bg-white rounded-full transition-all"
                    style={{
                      width: `${experiencePoints % 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </header>

          <nav className="flex gap-1 p-2 bg-gray-50 border-b">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`flex-1 px-3 py-2 rounded-lg text-sm transition-colors ${
                activeTab === "dashboard"
                  ? "bg-indigo-600 text-white"
                  : "bg-white text-gray-700"
              }`}
            >
              Home
            </button>
            <button
              onClick={() => setActiveTab("market")}
              className={`flex-1 px-3 py-2 rounded-lg text-sm transition-colors ${
                activeTab === "market"
                  ? "bg-indigo-600 text-white"
                  : "bg-white text-gray-700"
              }`}
            >
              Market
            </button>
            <button
              onClick={() => setActiveTab("portfolio")}
              className={`flex-1 px-3 py-2 rounded-lg text-sm transition-colors ${
                activeTab === "portfolio"
                  ? "bg-indigo-600 text-white"
                  : "bg-white text-gray-700"
              }`}
            >
              Portfolio
            </button>
            <button
              onClick={() => setActiveTab("achievements")}
              className={`flex-1 px-3 py-2 rounded-lg text-sm transition-colors ${
                activeTab === "achievements"
                  ? "bg-indigo-600 text-white"
                  : "bg-white text-gray-700"
              }`}
            >
              Awards
            </button>
          </nav>

          <main className="p-4 pb-20">
            {activeTab === "dashboard" && (
              <Dashboard
                portfolio={portfolio}
                stocks={stocks}
                transactions={transactions}
                achievements={achievements}
              />
            )}
            {activeTab === "market" && (
              <MarketView
                stocks={stocks}
                onBuy={handleBuyStock}
                onSell={handleSellStock}
                cash={portfolio.cash}
                holdings={portfolio.holdings}
              />
            )}
            {activeTab === "portfolio" && (
              <PortfolioView
                portfolio={portfolio}
                stocks={stocks}
                transactions={transactions}
                onSell={handleSellStock}
              />
            )}
            {activeTab === "achievements" && (
              <AchievementsView
                achievements={achievements}
                userLevel={userLevel}
              />
            )}
          </main>

          <div className="fixed bottom-0 left-0 right-0 max-w-[390px] mx-auto">
            <MentorAssistant
              userLevel={userLevel}
              portfolioValue={portfolio.totalValue}
              recentTransactions={transactions.slice(0, 3)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}