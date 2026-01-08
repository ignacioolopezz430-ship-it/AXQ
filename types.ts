
export enum AssetType {
  FOREX = 'Forex',
  CRYPTO = 'Crypto',
  COMMODITIES = 'Commodities'
}

export type UserStatus = 'pending' | 'approved' | 'admin';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  status: UserStatus;
  joinedAt: string;
  requestCode?: string; // ID para Telegram
}

export interface Asset {
  id: string;
  name: string;
  symbol: string;
  type: AssetType;
  change: number;
  icon: string;
}

export interface MarketAnalysis {
  bullishProb: number;
  bearishProb: number;
  trend: 'UP' | 'DOWN' | 'NEUTRAL';
  signals: {
    rsi: string;
    macd: string;
    movingAverage: string;
    volatility: string;
  };
  summary: string;
  sources?: { uri: string; title: string }[];
}

export interface NewsArticle {
  title: string;
  summary: string;
  url: string;
  source: string;
  timestamp: string;
  category: 'Forex' | 'Crypto' | 'Gold' | 'General';
}
