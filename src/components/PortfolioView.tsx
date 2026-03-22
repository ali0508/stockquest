import type { Portfolio, Stock, Transaction } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface PortfolioViewProps {
  portfolio: Portfolio;
  stocks: Stock[];
  transactions: Transaction[];
  onSell: (symbol: string, quantity: number) => { success: boolean; message: string };
}

export function PortfolioView({ portfolio, stocks, transactions }: PortfolioViewProps) {
  const getStockInfo = (symbol: string) => {
    return stocks.find(s => s.symbol === symbol);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Your Holdings</CardTitle>
        </CardHeader>
        <CardContent>
          {portfolio.holdings.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 text-sm mb-2">No stocks yet</p>
              <p className="text-xs text-gray-600">Visit Market to start!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {portfolio.holdings.map(holding => {
                const stock = getStockInfo(holding.symbol);
                if (!stock) return null;

                const currentValue = stock.price * holding.quantity;
                const costBasis = holding.averagePrice * holding.quantity;
                const gainLoss = currentValue - costBasis;
                const gainLossPercent = (gainLoss / costBasis) * 100;

                return (
                  <div key={holding.symbol} className="border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm">{stock.symbol}</h3>
                      <div className="text-right">
                        <p className="text-xs text-indigo-900">${currentValue.toFixed(2)}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <p className="text-gray-600">Shares</p>
                        <p>{holding.quantity}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Avg. Price</p>
                        <p>${holding.averagePrice.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Current</p>
                        <p>${stock.price.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Gain/Loss</p>
                        <p className={gainLoss >= 0 ? 'text-green-600' : 'text-red-600'}>
                          {gainLoss >= 0 ? '+' : ''}${gainLoss.toFixed(2)}
                        </p>
                      </div>
                    </div>

                    <div className={`mt-2 flex items-center gap-1 text-xs ${gainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {gainLoss >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                      <span>
                        {gainLoss >= 0 ? '+' : ''}{gainLossPercent.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <p className="text-center text-gray-500 py-4 text-xs">No transactions yet</p>
          ) : (
            <div className="space-y-2">
              {transactions.map(transaction => (
                <div key={transaction.id} className="flex items-center justify-between border-b pb-2 last:border-0">
                  <div className="flex items-center gap-2">
                    <div className={`px-2 py-0.5 rounded text-xs ${
                      transaction.type === 'buy' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {transaction.type.toUpperCase()}
                    </div>
                    <div>
                      <p className="text-xs">{transaction.symbol}</p>
                      <p className="text-xs text-gray-600">
                        {transaction.quantity} @ ${transaction.price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs">${transaction.total.toFixed(2)}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(transaction.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
