export interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  sector: string;
  description: string;
  volatility: number;
}

export interface Holding {
  symbol: string;
  quantity: number;
  averagePrice: number;
}

export interface Portfolio {
  cash: number;
  holdings: Holding[];
  totalValue: number;
  totalGainLoss: number;
}

export interface Transaction {
  id: string;
  type: 'buy' | 'sell';
  symbol: string;
  quantity: number;
  price: number;
  total: number;
  timestamp: Date;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: Date;
  progress?: number;
  target?: number;
}
