import { Cryptocurrency, CryptocurrencyDetail, CoinGeckoAPIParams } from "../types/crypto";

const BASE_URL = "/api";

const DEFAULT_PARAMS: CoinGeckoAPIParams = {
  vs_currency: "brl",
  order: "market_cap_desc",
  per_page: 20,
  page: 1,
  sparkline: false,
};

// Cache simples em memória
const cache = new Map<string, { data: any; timestamp: number; ttl: number }>();

const CACHE_TTL = {
  LIST: 5 * 60 * 1000, // 5 minutos para lista
  DETAIL: 10 * 60 * 1000, // 10 minutos para detalhes
};

// Rate limiting - máximo 1 requisição por segundo
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 1000;

const waitForRateLimit = async (): Promise<void> => {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  
  if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
    const waitTime = MIN_REQUEST_INTERVAL - timeSinceLastRequest;
    await new Promise(resolve => setTimeout(resolve, waitTime));
  }
  
  lastRequestTime = Date.now();
};

const getCachedData = (key: string): any | null => {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < cached.ttl) {
    return cached.data;
  }
  cache.delete(key);
  return null;
};

const setCachedData = (key: string, data: any, ttl: number): void => {
  cache.set(key, {
    data,
    timestamp: Date.now(),
    ttl
  });
};

export const fetchCryptocurrencies = async (): Promise<Cryptocurrency[]> => {
  const cacheKey = "cryptocurrencies";
  
  // Verifica cache primeiro
  const cachedData = getCachedData(cacheKey);
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

    const response = await fetch(`${BASE_URL}/coins/markets?${params}`);

    if (response.status === 429) {
      throw new Error("Limite de requisições excedido. Aguarde alguns segundos e tente novamente.");
    }

    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status} - ${response.statusText}`);
    }

    const data: Cryptocurrency[] = await response.json();
    
    // Salva no cache
    setCachedData(cacheKey, data, CACHE_TTL.LIST);
    
    return data;
  } catch (error) {
    if (error instanceof Error) {
      // Se for erro de rate limit, orienta o usuário
      if (error.message.includes("429") || error.message.includes("limite")) {
        throw new Error("Muitas requisições à API. Aguarde um momento e recarregue a página.");
      }
      throw error;
    }
    throw new Error("Erro inesperado ao buscar criptomoedas");
  }
};

export const fetchCryptocurrencyDetail = async (coinId: string): Promise<CryptocurrencyDetail> => {
  const cacheKey = `detail-${coinId}`;
  
  // Verifica cache primeiro
  const cachedData = getCachedData(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  try {
    await waitForRateLimit();
    
    const response = await fetch(`${BASE_URL}/coins/${coinId}`);

    if (response.status === 429) {
      throw new Error("Limite de requisições excedido. Aguarde alguns segundos e tente novamente.");
    }

    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status} - ${response.statusText}`);
    }

    const data: CryptocurrencyDetail = await response.json();
    
    // Salva no cache
    setCachedData(cacheKey, data, CACHE_TTL.DETAIL);
    
    return data;
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes("429") || error.message.includes("limite")) {
        throw new Error("Muitas requisições à API. Aguarde um momento e tente novamente.");
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
