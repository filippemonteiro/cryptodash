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
  asset_platform_id: null | string;
  platforms: Record<string, string>;
  detail_platforms: Record<string, any>;
  block_time_in_minutes: number;
  hashing_algorithm: string;
  categories: string[];
  public_notice: null | string;
  additional_notices: string[];
  description: {
    en: string;
    pt: string;
  };
  links: {
    homepage: string[];
    blockchain_site: string[];
    official_forum_url: string[];
    chat_url: string[];
    announcement_url: string[];
    twitter_screen_name: string;
    facebook_username: string;
    bitcointalk_thread_identifier: null | number;
    telegram_channel_identifier: string;
    subreddit_url: string;
    repos_url: {
      github: string[];
      bitbucket: string[];
    };
  };
  image: {
    thumb: string;
    small: string;
    large: string;
  };
  country_origin: string;
  genesis_date: string;
  sentiment_votes_up_percentage: number;
  sentiment_votes_down_percentage: number;
  watchlist_portfolio_users: number;
  market_cap_rank: number;
  coingecko_rank: number;
  coingecko_score: number;
  developer_score: number;
  community_score: number;
  liquidity_score: number;
  public_interest_score: number;
  market_data: {
    current_price: {
      usd: number;
      brl: number;
    };
    total_value_locked: null | number;
    mcap_to_tvl_ratio: null | number;
    fdv_to_tvl_ratio: null | number;
    roi: null | {
      times: number;
      currency: string;
      percentage: number;
    };
    ath: {
      usd: number;
      brl: number;
    };
    ath_change_percentage: {
      usd: number;
      brl: number;
    };
    ath_date: {
      usd: string;
      brl: string;
    };
    atl: {
      usd: number;
      brl: number;
    };
    atl_change_percentage: {
      usd: number;
      brl: number;
    };
    atl_date: {
      usd: string;
      brl: string;
    };
    market_cap: {
      usd: number;
      brl: number;
    };
    market_cap_rank: number;
    fully_diluted_valuation: {
      usd: number;
      brl: number;
    };
    total_volume: {
      usd: number;
      brl: number;
    };
    high_24h: {
      usd: number;
      brl: number;
    };
    low_24h: {
      usd: number;
      brl: number;
    };
    price_change_24h: number;
    price_change_percentage_24h: number;
    price_change_percentage_7d: number;
    price_change_percentage_14d: number;
    price_change_percentage_30d: number;
    price_change_percentage_60d: number;
    price_change_percentage_200d: number;
    price_change_percentage_1y: number;
    market_cap_change_24h: number;
    market_cap_change_percentage_24h: number;
    price_change_24h_in_currency: {
      usd: number;
      brl: number;
    };
    price_change_percentage_1h_in_currency: {
      usd: number;
      brl: number;
    };
    price_change_percentage_24h_in_currency: {
      usd: number;
      brl: number;
    };
    price_change_percentage_7d_in_currency: {
      usd: number;
      brl: number;
    };
    price_change_percentage_14d_in_currency: {
      usd: number;
      brl: number;
    };
    price_change_percentage_30d_in_currency: {
      usd: number;
      brl: number;
    };
    price_change_percentage_60d_in_currency: {
      usd: number;
      brl: number;
    };
    price_change_percentage_200d_in_currency: {
      usd: number;
      brl: number;
    };
    price_change_percentage_1y_in_currency: {
      usd: number;
      brl: number;
    };
    market_cap_change_24h_in_currency: {
      usd: number;
      brl: number;
    };
    market_cap_change_percentage_24h_in_currency: {
      usd: number;
      brl: number;
    };
    total_supply: number;
    max_supply: number;
    circulating_supply: number;
    last_updated: string;
  };
  public_interest_stats: {
    alexa_rank: number;
    bing_matches: null | number;
  };
  status_updates: any[];
  last_updated: string;
}

export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

export interface SearchFilter {
  searchTerm: string;
}

export interface CoinGeckoAPIParams {
  vs_currency: string;
  order: string;
  per_page: number;
  page: number;
  sparkline: boolean;
}

export type CryptocurrencyListResponse = Cryptocurrency[];
