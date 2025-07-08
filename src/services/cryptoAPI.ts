import {
  Cryptocurrency,
  CryptocurrencyDetail,
  CoinGeckoAPIParams,
} from "../types/crypto";

// URL base da API do CoinGecko
const BASE_URL = "https://api.coingecko.com/api/v3";

// Configuração padrão para a lista de moedas
const DEFAULT_PARAMS: CoinGeckoAPIParams = {
  vs_currency: "brl",
  order: "market_cap_desc",
  per_page: 20,
  page: 1,
  sparkline: false,
};

// Função para buscar a lista de criptomoedas
export const fetchCryptocurrencies = async (): Promise<Cryptocurrency[]> => {
  try {
    // Construindo a URL com os parâmetros
    const params = new URLSearchParams({
      vs_currency: DEFAULT_PARAMS.vs_currency,
      order: DEFAULT_PARAMS.order,
      per_page: DEFAULT_PARAMS.per_page.toString(),
      page: DEFAULT_PARAMS.page.toString(),
      sparkline: DEFAULT_PARAMS.sparkline.toString(),
    });

    const response = await fetch(`${BASE_URL}/coins/markets?${params}`);

    // Verificando se a resposta foi bem-sucedida
    if (!response.ok) {
      throw new Error(
        `Erro na API: ${response.status} - ${response.statusText}`
      );
    }

    const data: Cryptocurrency[] = await response.json();
    return data;
  } catch (error) {
    // Tratamento de erro mais específico
    if (error instanceof Error) {
      throw new Error(`Falha ao buscar criptomoedas: ${error.message}`);
    } else {
      throw new Error("Erro desconhecido ao buscar criptomoedas");
    }
  }
};

// Função para buscar detalhes de uma criptomoeda específica
export const fetchCryptocurrencyDetail = async (
  coinId: string
): Promise<CryptocurrencyDetail> => {
  try {
    const response = await fetch(`${BASE_URL}/coins/${coinId}`);

    // Verificando se a resposta foi bem-sucedida
    if (!response.ok) {
      throw new Error(
        `Erro na API: ${response.status} - ${response.statusText}`
      );
    }

    const data: CryptocurrencyDetail = await response.json();
    return data;
  } catch (error) {
    // Tratamento de erro mais específico
    if (error instanceof Error) {
      throw new Error(
        `Falha ao buscar detalhes da ${coinId}: ${error.message}`
      );
    } else {
      throw new Error(`Erro desconhecido ao buscar detalhes da ${coinId}`);
    }
  }
};

// Função para formatação de moeda brasileira
export const formatBRL = (value: number): string => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

// Função para formatação de moeda americana
export const formatUSD = (value: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
};

// Função para formatação de porcentagem
export const formatPercentage = (value: number): string => {
  return new Intl.NumberFormat("pt-BR", {
    style: "percent",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value / 100);
};

// Função para formatação de números grandes (market cap, volume)
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
