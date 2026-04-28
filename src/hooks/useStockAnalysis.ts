import { useState, useCallback } from 'react';
import { getStockQuote, analyzeTradeQuality, type StockQuote, type TradeAnalysis } from '../utils/alphavantage';

interface UseStockAnalysisResult {
  quote: StockQuote | null;
  analysis: TradeAnalysis | null;
  loading: boolean;
  error: string | null;
  analyzeStock: (symbol: string) => Promise<void>;
}

/**
 * Custom hook to fetch stock data and analyze trade quality
 * 
 * @example
 * const { quote, analysis, loading, analyzeStock } = useStockAnalysis();
 * 
 * const handleAnalyze = async () => {
 *   await analyzeStock('AAPL');
 * };
 */
export function useStockAnalysis(): UseStockAnalysisResult {
  const [quote, setQuote] = useState<StockQuote | null>(null);
  const [analysis, setAnalysis] = useState<TradeAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeStock = useCallback(async (symbol: string) => {
    setLoading(true);
    setError(null);

    try {
      const stockQuote = await getStockQuote(symbol);

      if (!stockQuote) {
        setError(`Failed to fetch data for ${symbol}. Check API key and symbol validity.`);
        setQuote(null);
        setAnalysis(null);
        return;
      }

      setQuote(stockQuote);
      const tradeAnalysis = analyzeTradeQuality(stockQuote);
      setAnalysis(tradeAnalysis);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      setError(message);
      setQuote(null);
      setAnalysis(null);
    } finally {
      setLoading(false);
    }
  }, []);

  return { quote, analysis, loading, error, analyzeStock };
}
