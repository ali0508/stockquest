const API_KEY = import.meta.env.VITE_ALPHAVANTAGE_API_KEY;
const BASE_URL = 'https://www.alphavantage.co/query';

export interface StockQuote {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  timestamp: string;
}

export interface TradeAnalysis {
  symbol: string;
  recommendation: 'BUY' | 'SELL' | 'HOLD';
  reasoning: string;
  confidence: number;
  marketContext: string;
}

/**
 * Fetch real-time stock quote from Alpha Vantage
 */
export async function getStockQuote(symbol: string): Promise<StockQuote | null> {
  if (!API_KEY) {
    console.error('VITE_ALPHAVANTAGE_API_KEY is not set in .env.local');
    return null;
  }

  try {
    const response = await fetch(
      `${BASE_URL}?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`
    );
    const data = await response.json();

    if (data.Note || data.Information || data['Error Message']) {
      console.warn(`Alpha Vantage did not return quote for ${symbol}:`, data.Note || data.Information || data['Error Message']);
      return null;
    }

    if (!data['Global Quote'] || Object.keys(data['Global Quote']).length === 0) {
      console.error(`No data found for symbol: ${symbol}`);
      return null;
    }

    const quote = data['Global Quote'];
    return {
      symbol: quote['01. symbol'],
      price: parseFloat(quote['05. price']),
      change: parseFloat(quote['09. change']),
      changePercent: parseFloat(quote['10. change percent']),
      timestamp: quote['07. latest trading day'],
    };
  } catch (error) {
    console.error(`Error fetching quote for ${symbol}:`, error);
    return null;
  }
}

/**
 * Fetch intraday time series data for technical analysis
 */
export async function getIntradayData(symbol: string) {
  if (!API_KEY) {
    console.error('VITE_ALPHAVANTAGE_API_KEY is not set in .env.local');
    return null;
  }

  try {
    const response = await fetch(
      `${BASE_URL}?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=60min&apikey=${API_KEY}`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching intraday data for ${symbol}:`, error);
    return null;
  }
}

/**
 * Analyze if a trade is good based on market data and technical indicators
 */
export function analyzeTradeQuality(quote: StockQuote): TradeAnalysis {
  const { symbol, changePercent } = quote;

  // Simple analysis logic - you can expand this with more indicators
  let recommendation: 'BUY' | 'SELL' | 'HOLD' = 'HOLD';
  let reasoning = '';
  let confidence = 0.5;

  // Price movement analysis
  if (changePercent <= -3) {
    recommendation = 'BUY';
    reasoning = `Stock is down ${Math.abs(changePercent)}% - potential buying opportunity after market correction.`;
    confidence = 0.7;
  } else if (changePercent >= 3) {
    recommendation = 'SELL';
    reasoning = `Stock is up ${changePercent}% - consider taking profits after strong gains.`;
    confidence = 0.6;
  } else if (changePercent > -1 && changePercent < 1) {
    recommendation = 'HOLD';
    reasoning = `Stock is relatively stable. Wait for clearer price action.`;
    confidence = 0.5;
  } else if (changePercent < 0) {
    recommendation = 'BUY';
    reasoning = `Slight downward trend - could be accumulation opportunity.`;
    confidence = 0.55;
  } else {
    recommendation = 'SELL';
    reasoning = `Slight upward trend - take partial profits.`;
    confidence = 0.55;
  }

  // Market context
  const marketContext =
    Math.abs(changePercent) > 2
      ? 'High volatility - use smaller position sizes'
      : 'Normal volatility - standard trading parameters apply';

  return {
    symbol,
    recommendation,
    reasoning,
    confidence,
    marketContext,
  };
}

/**
 * Compare multiple stocks to the benchmark (market average)
 */
export function compareToBenchmark(stocks: StockQuote[], benchmarkChange: number = 0.5): Record<string, any> {
  return stocks.map((stock) => ({
    symbol: stock.symbol,
    price: stock.price,
    change: stock.change,
    changePercent: stock.changePercent,
    vsMarket: stock.changePercent - benchmarkChange,
    performanceRating: stock.changePercent - benchmarkChange > 1 ? 'Outperforming' : 'Underperforming',
  }));
}
