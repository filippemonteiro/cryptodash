export interface Cryptocurrency {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  fully_diluted_valuation: number | null;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: number | null;
  max_supply: number | null;
  ath: number;
  ath_change_percentage: number;
  ath_date: string;
  atl: number;
  atl_change_percentage: number;
  atl_date: string;
  roi: null | {
    times: number;
    currency: string;
    percentage: number;
  };
  last_updated: string;
}

export interface CryptocurrencyDetail {
  id: string;
  symbol: string;
  name: string;
  description: {
    en: string;
    pt: string;
  };
  image: {
    thumb: string;
    small: string;
    large: string;
  };
  market_cap_rank: number;
  market_data: {
    current_price: {
      usd: number;
      brl: number;
    };
    price_change_percentage_24h: number;
    market_cap: {
      usd: number;
      brl: number;
    };
    total_volume: {
      usd: number;
      brl: number;
    };
    circulating_supply: number;
  };
}

export interface CoinGeckoAPIParams {
  vs_currency: string;
  order: string;
  per_page: number;
  page: number;
  sparkline: boolean;
}

export type CryptocurrencyListResponse = Cryptocurrency[];
