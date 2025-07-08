import {
  Cryptocurrency,
  CryptocurrencyDetail,
  CoinGeckoAPIParams,
} from "../types/crypto";

const BASE_URL = "https://api.coingecko.com/api/v3";

const DEFAULT_PARAMS: CoinGeckoAPIParams = {
  vs_currency: "brl",
  order: "market_cap_desc",
  per_page: 20,
  page: 1,
  sparkline: false,
};

export const fetchCryptocurrencies = async (): Promise<Cryptocurrency[]> => {
  try {
    const params = new URLSearchParams({
      vs_currency: DEFAULT_PARAMS.vs_currency,
      order: DEFAULT_PARAMS.order,
      per_page: DEFAULT_PARAMS.per_page.toString(),
      page: DEFAULT_PARAMS.page.toString(),
      sparkline: DEFAULT_PARAMS.sparkline.toString(),
    });

    const response = await fetch(`${BASE_URL}/coins/markets?${params}`);

    if (!response.ok) {
      throw new Error(
        `Erro na API: ${response.status} - ${response.statusText}`
      );
    }

    const data: Cryptocurrency[] = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Falha ao buscar criptomoedas: ${error.message}`);
    } else {
      throw new Error("Erro desconhecido ao buscar criptomoedas");
    }
  }
};

export const fetchCryptocurrencyDetail = async (
  coinId: string
): Promise<CryptocurrencyDetail> => {
  try {
    const response = await fetch(`${BASE_URL}/coins/${coinId}`);

    if (!response.ok) {
      throw new Error(
        `Erro na API: ${response.status} - ${response.statusText}`
      );
    }

    const data: CryptocurrencyDetail = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(
        `Falha ao buscar detalhes da ${coinId}: ${error.message}`
      );
    } else {
      throw new Error(`Erro desconhecido ao buscar detalhes da ${coinId}`);
    }
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
