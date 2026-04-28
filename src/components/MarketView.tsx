import { useState } from 'react';
import type { Stock, Holding } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { toast } from 'sonner';
import { analyzeTradeQuality } from '../utils/alphavantage';
import type { StockQuote } from '../utils/alphavantage';

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
  const [filter, setFilter] = useState<'all' | 'stock' | 'etf'>('all');

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

  const getHoldingQuantity = (symbol: string) => holdings.find(h => h.symbol === symbol)?.quantity || 0;
  const maxAffordable = selectedStock ? Math.floor(cash / selectedStock.price) : 0;
  const maxToSell = selectedStock ? getHoldingQuantity(selectedStock.symbol) : 0;

  const tradeAnalysis = selectedStock
    ? analyzeTradeQuality({ symbol: selectedStock.symbol, price: selectedStock.price, change: selectedStock.change, changePercent: selectedStock.changePercent, timestamp: new Date().toISOString() } as StockQuote)
    : null;

  const filteredStocks = stocks.filter(s => filter === 'all' || s.type === filter);

  const recommendationStyle: Record<string, string> = {
    BUY: 'bg-green-50 border-green-200 text-green-800',
    SELL: 'bg-red-50 border-red-200 text-red-800',
    HOLD: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  };
  const recommendationIcon: Record<string, string> = { BUY: '📈', SELL: '📉', HOLD: '⏸️' };

  return (
    <div className="space-y-3">
      <div className="flex gap-1">
        {(['all', 'stock', 'etf'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-colors ${filter === f ? 'bg-indigo-600 text-white' : 'bg-white border text-gray-600'}`}>
            {f === 'all' ? 'All' : f === 'etf' ? 'Index ETFs' : 'Stocks'}
          </button>
        ))}
      </div>

      {(filter === 'all' || filter === 'etf') && (
        <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-3">
          <p className="text-xs font-semibold text-indigo-800 mb-1">📦 What is an Index ETF?</p>
          <p className="text-xs text-indigo-700">ETFs track a basket of stocks instead of one company. Less risky, great for beginners — instant diversification.</p>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Live Market</CardTitle>
          <p className="text-xs text-gray-500">Prices refresh every 15 seconds via Alpha Vantage</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredStocks.map(stock => {
              const holdingQty = getHoldingQuantity(stock.symbol);
              const isETF = stock.type === 'etf';
              return (
                <div key={stock.symbol} className={`border rounded-lg p-3 ${isETF ? 'border-indigo-200 bg-indigo-50/30' : ''}`}>
                  <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                    <h3 className="text-sm font-semibold">{stock.symbol}</h3>
                    <Badge variant="outline" className={`text-xs ${isETF ? 'border-indigo-400 text-indigo-700' : ''}`}>
                      {isETF ? '📦 ETF' : '🏢 Stock'}
                    </Badge>
                    <Badge variant="outline" className="text-xs">{stock.sector}</Badge>
                  </div>
                  <p className="text-xs text-gray-500">{stock.name}</p>
                  <p className="text-xs text-gray-600 line-clamp-2 mt-0.5">{stock.description}</p>
                  <div className="flex items-center justify-between mt-2">
                    <div>
                      <div className="text-indigo-900 text-sm font-medium">${stock.price.toFixed(2)}</div>
                      <div className={`flex items-center gap-1 text-xs ${stock.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {stock.change >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                        {stock.change >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                      </div>
                      {holdingQty > 0 && <p className="text-xs text-indigo-600 mt-1">Own {holdingQty}</p>}
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => handleOpenDialog(stock, 'buy')} className="bg-green-600 hover:bg-green-700 text-xs h-8">Buy</Button>
                      {holdingQty > 0 && <Button size="sm" variant="outline" onClick={() => handleOpenDialog(stock, 'sell')} className="text-xs h-8">Sell</Button>}
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
              {selectedStock?.type === 'etf' && <span className="ml-2 text-xs text-indigo-600">📦 ETF</span>}
            </DialogTitle>
            <DialogDescription className="text-xs">{selectedStock?.name} — ${selectedStock?.price.toFixed(2)} per share</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            {tradeAnalysis && (
              <div className={`border rounded-lg p-3 text-xs ${recommendationStyle[tradeAnalysis.recommendation]}`}>
                <p className="font-semibold mb-1">{recommendationIcon[tradeAnalysis.recommendation]} AI Suggestion: {tradeAnalysis.recommendation}</p>
                <p>{tradeAnalysis.reasoning}</p>
                <p className="mt-1 opacity-75">{tradeAnalysis.marketContext}</p>
                <p className="mt-1 opacity-60">Confidence: {Math.round(tradeAnalysis.confidence * 100)}%</p>
              </div>
            )}
            <div>
              <label className="text-xs">Quantity</label>
              <Input type="number" min="1" max={actionType === 'buy' ? maxAffordable : maxToSell} value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))} className="text-sm" />
              <p className="text-xs text-gray-500 mt-1">
                {actionType === 'buy' ? `You can afford up to ${maxAffordable} shares` : `You own ${maxToSell} shares`}
              </p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg text-xs">
              <div className="flex justify-between mb-1"><span>Price per share:</span><span>${selectedStock?.price.toFixed(2)}</span></div>
              <div className="flex justify-between mb-1"><span>Quantity:</span><span>{quantity}</span></div>
              <div className="flex justify-between border-t pt-1 font-medium"><span>Total:</span>
                <span className="text-indigo-900">${((selectedStock?.price || 0) * quantity).toFixed(2)}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleTransaction}
                className={`text-xs flex-1 ${actionType === 'buy' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}>
                Confirm {actionType === 'buy' ? 'Purchase' : 'Sale'}
              </Button>
              <Button variant="outline" onClick={() => setSelectedStock(null)} className="text-xs">Cancel</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
