import type { Stock } from '../types';

export const generateInitialStocks = (): Stock[] => {
  return [
    {
      symbol: 'TECH',
      name: 'TechCorp Industries',
      price: 150.50,
      change: 2.50,
      changePercent: 1.69,
      sector: 'Technology',
      description: 'A leading technology company specializing in software and cloud services.',
      volatility: 0.02,
    },
    {
      symbol: 'GREEN',
      name: 'GreenEnergy Inc',
      price: 45.30,
      change: -0.80,
      changePercent: -1.74,
      sector: 'Energy',
      description: 'Renewable energy company focused on solar and wind power solutions.',
      volatility: 0.03,
    },
    {
      symbol: 'BANK',
      name: 'First National Bank',
      price: 85.20,
      change: 0.50,
      changePercent: 0.59,
      sector: 'Finance',
      description: 'Major retail and commercial banking institution with global presence.',
      volatility: 0.015,
    },
    {
      symbol: 'HEALTH',
      name: 'HealthCare Plus',
      price: 120.75,
      change: 3.25,
      changePercent: 2.76,
      sector: 'Healthcare',
      description: 'Pharmaceutical and healthcare services provider with innovative treatments.',
      volatility: 0.025,
    },
    {
      symbol: 'RETAIL',
      name: 'MegaRetail Corp',
      price: 65.40,
      change: -1.20,
      changePercent: -1.80,
      sector: 'Retail',
      description: 'E-commerce and brick-and-mortar retail giant serving millions of customers.',
      volatility: 0.028,
    },
    {
      symbol: 'AUTO',
      name: 'AutoDrive Motors',
      price: 95.60,
      change: 1.80,
      changePercent: 1.92,
      sector: 'Automotive',
      description: 'Electric vehicle manufacturer pushing the boundaries of autonomous driving.',
      volatility: 0.035,
    },
    {
      symbol: 'FOOD',
      name: 'FoodChain Global',
      price: 52.90,
      change: 0.30,
      changePercent: 0.57,
      sector: 'Consumer Goods',
      description: 'International food and beverage company with diverse product portfolio.',
      volatility: 0.018,
    },
    {
      symbol: 'SPACE',
      name: 'SpaceVentures Inc',
      price: 210.40,
      change: -5.60,
      changePercent: -2.59,
      sector: 'Aerospace',
      description: 'Commercial space exploration and satellite communications company.',
      volatility: 0.045,
    },
  ];
};

export const updateStockPrices = (stocks: Stock[]): Stock[] => {
  return stocks.map(stock => {
    // Random price change based on volatility
    const randomChange = (Math.random() - 0.5) * 2 * stock.volatility * stock.price;
    const newPrice = Math.max(stock.price + randomChange, 1); // Prevent negative prices
    const change = newPrice - stock.price;
    const changePercent = (change / stock.price) * 100;

    return {
      ...stock,
      price: Number(newPrice.toFixed(2)),
      change: Number(change.toFixed(2)),
      changePercent: Number(changePercent.toFixed(2)),
    };
  });
};
