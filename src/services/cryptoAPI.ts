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
  LIST: 15 * 60 * 1000, // 15 minutos para lista
  DETAIL: 60 * 60 * 1000, // 1 hora para detalhes
};

let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 3000; // 3 segundos entre requisições

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
      mode: "cors",
      headers: {
        Accept: "application/json",
      },
    });

    if (response.status === 429) {
      throw new Error(
        "Muitas pessoas acessando os dados ao mesmo tempo. Aguarde alguns minutos e tente novamente."
      );
    }

    if (response.status === 403) {
      throw new Error(
        "Serviço temporariamente indisponível. Aguarde alguns minutos e recarregue a página."
      );
    }

    if (!response.ok) {
      throw new Error(
        `Serviço de dados indisponível no momento. Tente novamente em alguns minutos.`
      );
    }

    const data: Cryptocurrency[] = await response.json();
    setCachedData(cacheKey, data, CACHE_TTL.LIST);

    return data;
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes("429") || error.message.includes("403")) {
        throw error;
      }
      if (
        error.message.includes("CORS") ||
        error.message.includes("network") ||
        error.message.includes("NetworkError")
      ) {
        throw new Error(
          "Problema de conexão com a internet. Verifique sua conexão e tente novamente."
        );
      }
      if (error.message.includes("Failed to fetch")) {
        throw new Error(
          "Não foi possível carregar os dados. Verifique sua conexão com a internet."
        );
      }
      throw error;
    }
    throw new Error(
      "Ocorreu um problema inesperado. Tente recarregar a página."
    );
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
      mode: "cors",
      headers: {
        Accept: "application/json",
      },
    });

    if (response.status === 429) {
      throw new Error(
        "Muitas pessoas acessando os dados ao mesmo tempo. Aguarde alguns minutos e tente novamente."
      );
    }

    if (response.status === 403) {
      throw new Error(
        "Serviço temporariamente indisponível. Aguarde alguns minutos e recarregue a página."
      );
    }

    if (!response.ok) {
      throw new Error(
        `Serviço de dados indisponível no momento. Tente novamente em alguns minutos.`
      );
    }

    const data: CryptocurrencyDetail = await response.json();
    setCachedData(cacheKey, data, CACHE_TTL.DETAIL);

    return data;
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes("429") || error.message.includes("403")) {
        throw error;
      }
      if (
        error.message.includes("CORS") ||
        error.message.includes("network") ||
        error.message.includes("NetworkError")
      ) {
        throw new Error(
          "Problema de conexão com a internet. Verifique sua conexão e tente novamente."
        );
      }
      if (error.message.includes("Failed to fetch")) {
        throw new Error(
          "Não foi possível carregar os dados. Verifique sua conexão com a internet."
        );
      }
      throw error;
    }
    throw new Error(
      `Não foi possível carregar os detalhes desta criptomoeda. Tente novamente em alguns minutos.`
    );
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
