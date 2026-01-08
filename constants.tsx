
import { Asset, AssetType } from './types';

export const ASSETS: Asset[] = [
  { id: 'eurusd', name: 'EUR/USD', symbol: 'FX:EURUSD', type: AssetType.FOREX, change: 0.12, icon: '🇪🇺' },
  { id: 'gbpusd', name: 'GBP/USD', symbol: 'FX:GBPUSD', type: AssetType.FOREX, change: -0.05, icon: '🇬🇧' },
  { id: 'usdjpy', name: 'USD/JPY', symbol: 'FX:USDJPY', type: AssetType.FOREX, change: 0.08, icon: '🇯🇵' },
  { id: 'btcusd', name: 'BTC/USD', symbol: 'BINANCE:BTCUSDT', type: AssetType.CRYPTO, change: 2.45, icon: '₿' },
  { id: 'ethusd', name: 'ETH/USD', symbol: 'BINANCE:ETHUSDT', type: AssetType.CRYPTO, change: 1.80, icon: 'Ξ' },
  { id: 'solusd', name: 'SOL/USD', symbol: 'BINANCE:SOLUSDT', type: AssetType.CRYPTO, change: 5.20, icon: '☀️' },
  { id: 'xauusd', name: 'Gold (XAU/USD)', symbol: 'OANDA:XAUUSD', type: AssetType.COMMODITIES, change: 0.65, icon: '🟡' },
];

export const SESSIONS_CONFIG = [
  { name: 'Asia', startHour: 0, endHour: 9 },
  { name: 'London', startHour: 8, endHour: 17 },
  { name: 'New York', startHour: 13, endHour: 22 },
];
