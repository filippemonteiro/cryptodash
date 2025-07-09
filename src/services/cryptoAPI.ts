import {
  Cryptocurrency,
  CryptocurrencyDetail,
  CoinGeckoAPIParams,
} from "../types/crypto";

const BASE_URL = import.meta.env.DEV
  ? "/api"
  : "https://api.coingecko.com/api/v3";

const DEFAULT_PARAMS: CoinGeckoAPIParams = {
  vs_currency: "brl",
  order: "market_cap_desc",
  per_page: 20,
  page: 1,
  sparkline: false,
};

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

type CacheValue =
  | CacheEntry<Cryptocurrency[]>
  | CacheEntry<CryptocurrencyDetail>;
const cache = new Map<string, CacheValue>();

const CACHE_TTL = {
  LIST: 5 * 60 * 1000,
  DETAIL: 10 * 60 * 1000,
};

let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 1000;

const waitForRateLimit = async (): Promise<void> => {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;

  if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
    const waitTime = MIN_REQUEST_INTERVAL - timeSinceLastRequest;
    await new Promise((resolve) => setTimeout(resolve, waitTime));
  }

  lastRequestTime = Date.now();
};

const getCachedData = <T>(key: string): T | null => {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < cached.ttl) {
    return cached.data as T;
  }
  cache.delete(key);
  return null;
};

const setCachedData = <T extends Cryptocurrency[] | CryptocurrencyDetail>(
  key: string,
  data: T,
  ttl: number
): void => {
  const entry: CacheEntry<T> = {
    data,
    timestamp: Date.now(),
    ttl,
  };
  cache.set(key, entry as CacheValue);
};

export const fetchCryptocurrencies = async (): Promise<Cryptocurrency[]> => {
  const cacheKey = "cryptocurrencies";

  const cachedData = getCachedData<Cryptocurrency[]>(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  try {
    await waitForRateLimit();

    const params = new URLSearchParams({
      vs_currency: DEFAULT_PARAMS.vs_currency,
      order: DEFAULT_PARAMS.order,
      per_page: DEFAULT_PARAMS.per_page.toString(),
      page: DEFAULT_PARAMS.page.toString(),
      sparkline: DEFAULT_PARAMS.sparkline.toString(),
    });

    const response = await fetch(`${BASE_URL}/coins/markets?${params}`, {
      headers: {
        "User-Agent": "CryptoDash/1.0",
      },
    });

    if (response.status === 429) {
      throw new Error(
        "Limite de requisições excedido. Aguarde alguns segundos e tente novamente."
      );
    }

    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status} - ${response.statusText}`);
    }

    const data: Cryptocurrency[] = await response.json();
    setCachedData(cacheKey, data, CACHE_TTL.LIST);

    return data;
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes("429") || error.message.includes("limite")) {
        throw new Error(
          "Muitas requisições à API. Aguarde um momento e recarregue a página."
        );
      }
      throw error;
    }
    throw new Error("Erro inesperado ao buscar criptomoedas");
  }
};

export const fetchCryptocurrencyDetail = async (
  coinId: string
): Promise<CryptocurrencyDetail> => {
  const cacheKey = `detail-${coinId}`;

  const cachedData = getCachedData<CryptocurrencyDetail>(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  try {
    await waitForRateLimit();

    const response = await fetch(`${BASE_URL}/coins/${coinId}`, {
      headers: {
        "User-Agent": "CryptoDash/1.0",
      },
    });

    if (response.status === 429) {
      throw new Error(
        "Limite de requisições excedido. Aguarde alguns segundos e tente novamente."
      );
    }

    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status} - ${response.statusText}`);
    }

    const data: CryptocurrencyDetail = await response.json();
    setCachedData(cacheKey, data, CACHE_TTL.DETAIL);

    return data;
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes("429") || error.message.includes("limite")) {
        throw new Error(
          "Muitas requisições à API. Aguarde um momento e tente novamente."
        );
      }
      throw error;
    }
    throw new Error(`Erro inesperado ao buscar detalhes de ${coinId}`);
  }
};

export const formatBRL = (value: number): string => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

export const formatUSD = (value: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
};

export const formatPercentage = (value: number): string => {
  return new Intl.NumberFormat("pt-BR", {
    style: "percent",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value / 100);
};

export const formatLargeNumber = (value: number): string => {
  if (value >= 1_000_000_000_000) {
    return `${(value / 1_000_000_000_000).toFixed(2)}T`;
  } else if (value >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toFixed(2)}B`;
  } else if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(2)}M`;
  } else if (value >= 1_000) {
    return `${(value / 1_000).toFixed(2)}K`;
  } else {
    return value.toFixed(2);
  }
};
