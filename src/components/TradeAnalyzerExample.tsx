import { useState } from 'react';
import { useStockAnalysis } from '../hooks/useStockAnalysis';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';

export function TradeAnalyzerExample() {
  const [symbol, setSymbol] = useState('AAPL');
  const { quote, analysis, loading, error, analyzeStock } = useStockAnalysis();

  const handleAnalyze = async () => {
    await analyzeStock(symbol.toUpperCase());
  };

  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation) {
      case 'BUY':
        return 'text-green-600 bg-green-50';
      case 'SELL':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-yellow-600 bg-yellow-50';
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4 space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder="Enter stock symbol (e.g., AAPL)"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAnalyze()}
          disabled={loading}
        />
        <Button onClick={handleAnalyze} disabled={loading}>
          {loading ? 'Analyzing...' : 'Analyze Trade'}
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {quote && analysis && (
        <div className="space-y-4">
          {/* Stock Quote Card */}
          <Card className="p-4">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">{quote.symbol}</h3>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-sm text-gray-600">Current Price</p>
                  <p className="text-2xl font-bold">${quote.price.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Change</p>
                  <p className={`text-2xl font-bold ${quote.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {quote.change >= 0 ? '+' : ''}{quote.change.toFixed(2)} ({quote.changePercent.toFixed(2)}%)
                  </p>
                </div>
              </div>
              <p className="text-xs text-gray-500">As of: {quote.timestamp}</p>
            </div>
          </Card>

          {/* Trade Analysis Card */}
          <Card className={`p-4 ${getRecommendationColor(analysis.recommendation)}`}>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Trade Recommendation</h3>
                <span className={`px-3 py-1 rounded-full font-bold text-sm ${getRecommendationColor(analysis.recommendation)}`}>
                  {analysis.recommendation}
                </span>
              </div>

              <div>
                <p className="font-medium mb-1">Analysis:</p>
                <p className="text-sm">{analysis.reasoning}</p>
              </div>

              <div>
                <p className="font-medium mb-1">Market Context:</p>
                <p className="text-sm">{analysis.marketContext}</p>
              </div>

              <div>
                <p className="font-medium mb-1">Confidence Level:</p>
                <div className="w-full bg-gray-300 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${analysis.confidence * 100}%` }}
                  ></div>
                </div>
                <p className="text-xs mt-1">{(analysis.confidence * 100).toFixed(0)}%</p>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
