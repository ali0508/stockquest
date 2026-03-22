import { useState } from 'react';
import { Stock, Holding } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { TrendingUp, TrendingDown, Info } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { toast } from 'sonner';

interface MarketViewProps {
  stocks: Stock[];
  onBuy: (symbol: string, quantity: number) => { success: boolean; message: string };
  onSell: (symbol: string, quantity: number) => { success: boolean; message: string };
  cash: number;
  holdings: Holding[];
}

export function MarketView({ stocks, onBuy, onSell, cash, holdings }: MarketViewProps) {
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [actionType, setActionType] = useState<'buy' | 'sell'>('buy');

  const handleOpenDialog = (stock: Stock, action: 'buy' | 'sell') => {
    setSelectedStock(stock);
    setActionType(action);
    setQuantity(1);
  };

  const handleTransaction = () => {
    if (!selectedStock) return;

    const result = actionType === 'buy' 
      ? onBuy(selectedStock.symbol, quantity)
      : onSell(selectedStock.symbol, quantity);

    if (result.success) {
      toast.success(result.message);
      setSelectedStock(null);
    } else {
      toast.error(result.message);
    }
  };

  const getHoldingQuantity = (symbol: string) => {
    return holdings.find(h => h.symbol === symbol)?.quantity || 0;
  };

  const maxAffordable = selectedStock ? Math.floor(cash / selectedStock.price) : 0;
  const maxToSell = selectedStock ? getHoldingQuantity(selectedStock.symbol) : 0;

  return (
    <div className="space-y-3">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Live Market</CardTitle>
          <p className="text-xs text-gray-600">Prices update every 5 seconds</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {stocks.map(stock => {
              const holdingQty = getHoldingQuantity(stock.symbol);
              
              return (
                <div key={stock.symbol} className="border rounded-lg p-3">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm">{stock.symbol}</h3>
                        <Badge variant="outline" className="text-xs">{stock.sector}</Badge>
                      </div>
                      <p className="text-xs text-gray-600 line-clamp-2">{stock.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <div>
                      <div className="text-indigo-900 text-sm">${stock.price.toFixed(2)}</div>
                      <div className={`flex items-center gap-1 text-xs ${stock.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {stock.change >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                        {stock.change >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                      </div>
                      {holdingQty > 0 && (
                        <p className="text-xs text-indigo-600 mt-1">
                          Own {holdingQty}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleOpenDialog(stock, 'buy')}
                        className="bg-green-600 hover:bg-green-700 text-xs h-8"
                      >
                        Buy
                      </Button>
                      {holdingQty > 0 && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleOpenDialog(stock, 'sell')}
                          className="text-xs h-8"
                        >
                          Sell
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!selectedStock} onOpenChange={() => setSelectedStock(null)}>
        <DialogContent className="max-w-[340px]">
          <DialogHeader>
            <DialogTitle className="text-sm">
              {actionType === 'buy' ? 'Buy' : 'Sell'} {selectedStock?.symbol}
            </DialogTitle>
            <DialogDescription className="text-xs">
              {selectedStock?.name} - ${selectedStock?.price.toFixed(2)} per share
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <div>
              <label className="text-xs">Quantity</label>
              <Input
                type="number"
                min="1"
                max={actionType === 'buy' ? maxAffordable : maxToSell}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="text-sm"
              />
              <p className="text-xs text-gray-600 mt-1">
                {actionType === 'buy' 
                  ? `You can afford ${maxAffordable} shares`
                  : `You can sell ${maxToSell} shares`
                }
              </p>
            </div>

            <div className="bg-gray-50 p-3 rounded-lg text-xs">
              <div className="flex justify-between mb-1">
                <span>Price per share:</span>
                <span>${selectedStock?.price.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-1">
                <span>Quantity:</span>
                <span>{quantity}</span>
              </div>
              <div className="flex justify-between border-t pt-1">
                <span>Total:</span>
                <span className="text-indigo-900">
                  ${((selectedStock?.price || 0) * quantity).toFixed(2)}
                </span>
              </div>
            </div>

            <div className="bg-blue-50 p-2 rounded-lg flex gap-2">
              <Info className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-gray-700">
                {actionType === 'buy' ? (
                  <p>Consider the company's sector and recent performance.</p>
                ) : (
                  <p>Check if you're selling at a profit or loss.</p>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleTransaction}
                className={`text-xs ${actionType === 'buy' ? 'bg-green-600 hover:bg-green-700' : ''} flex-1`}
              >
                Confirm {actionType === 'buy' ? 'Purchase' : 'Sale'}
              </Button>
              <Button variant="outline" onClick={() => setSelectedStock(null)} className="text-xs">
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}