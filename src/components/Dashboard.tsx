import type { Portfolio, Stock, Transaction, Achievement } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { TrendingUp, TrendingDown, DollarSign, Activity, Award } from 'lucide-react';

interface DashboardProps {
  portfolio: Portfolio;
  stocks: Stock[];
  transactions: Transaction[];
  achievements: Achievement[];
}

export function Dashboard({ portfolio, stocks, transactions, achievements }: DashboardProps) {
  const unlockedAchievements = achievements.filter(a => a.unlocked).length;
  const portfolioChangePercent = ((portfolio.totalValue - 10000) / 10000) * 100;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 pt-3 px-3">
            <CardTitle className="text-xs">Total Value</CardTitle>
            <DollarSign className="h-3 w-3 text-muted-foreground" />
          </CardHeader>
          <CardContent className="px-3 pb-3">
            <div className="text-indigo-900">${portfolio.totalValue.toFixed(2)}</div>
            <p className={`text-xs ${portfolioChangePercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {portfolioChangePercent >= 0 ? '+' : ''}{portfolioChangePercent.toFixed(2)}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 pt-3 px-3">
            <CardTitle className="text-xs">Cash</CardTitle>
            <Activity className="h-3 w-3 text-muted-foreground" />
          </CardHeader>
          <CardContent className="px-3 pb-3">
            <div className="text-indigo-900">${portfolio.cash.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Available
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 pt-3 px-3">
            <CardTitle className="text-xs">Gain/Loss</CardTitle>
            {portfolio.totalGainLoss >= 0 ? (
              <TrendingUp className="h-3 w-3 text-green-600" />
            ) : (
              <TrendingDown className="h-3 w-3 text-red-600" />
            )}
          </CardHeader>
          <CardContent className="px-3 pb-3">
            <div className={`text-indigo-900`}>
              ${Math.abs(portfolio.totalGainLoss).toFixed(2)}
            </div>
            <p className={`text-xs ${portfolio.totalGainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {portfolio.totalGainLoss >= 0 ? 'Profit' : 'Loss'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 pt-3 px-3">
            <CardTitle className="text-xs">Awards</CardTitle>
            <Award className="h-3 w-3 text-muted-foreground" />
          </CardHeader>
          <CardContent className="px-3 pb-3">
            <div className="text-indigo-900">{unlockedAchievements}/{achievements.length}</div>
            <p className="text-xs text-muted-foreground">
              Unlocked
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Market Overview</CardTitle>
        </CardHeader>
        <CardContent className="px-3 pb-3">
          <div className="space-y-2">
            {stocks.slice(0, 4).map(stock => (
              <div key={stock.symbol} className="flex items-center justify-between text-sm">
                <div>
                  <p className="text-xs">{stock.symbol}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs">${stock.price.toFixed(2)}</p>
                  <p className={`text-xs ${stock.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {stock.change >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent className="px-3 pb-3">
          {transactions.length === 0 ? (
            <p className="text-gray-500 text-center py-4 text-sm">No transactions yet</p>
          ) : (
            <div className="space-y-2">
              {transactions.slice(0, 3).map(transaction => (
                <div key={transaction.id} className="flex items-center justify-between text-sm">
                  <div>
                    <p className={`text-xs ${transaction.type === 'buy' ? 'text-green-600' : 'text-red-600'}`}>
                      {transaction.type.toUpperCase()} {transaction.symbol}
                    </p>
                    <p className="text-xs text-gray-600">
                      {transaction.quantity} shares
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs">${transaction.total.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Investment Tips</CardTitle>
        </CardHeader>
        <CardContent className="px-3 pb-3">
          <div className="space-y-2">
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-xs"><strong>�� Diversification</strong></p>
              <p className="text-xs text-gray-700 mt-1">
                Spread investments across different sectors to reduce risk.
              </p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <p className="text-xs"><strong>📊 Long-term Thinking</strong></p>
              <p className="text-xs text-gray-700 mt-1">
                Markets fluctuate, but historically trend upward over time.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
