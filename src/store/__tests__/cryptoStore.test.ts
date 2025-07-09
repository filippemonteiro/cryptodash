import { renderHook, act } from "@testing-library/react";
import { vi } from "vitest";
import { useCryptoStore } from "../cryptoStore";
import { Cryptocurrency, CryptocurrencyDetail } from "../../types/crypto";

// Mock da API
vi.mock("../../services/cryptoAPI", () => ({
  fetchCryptocurrencies: vi.fn(),
  fetchCryptocurrencyDetail: vi.fn(),
}));

import {
  fetchCryptocurrencies,
  fetchCryptocurrencyDetail,
} from "../../services/cryptoAPI";

const mockFetchCryptocurrencies = vi.mocked(fetchCryptocurrencies);
const mockFetchCryptocurrencyDetail = vi.mocked(fetchCryptocurrencyDetail);

// Helper para criar mock de criptomoeda
const createMockCrypto = (
  overrides: Partial<Cryptocurrency> = {}
): Cryptocurrency => ({
  id: "bitcoin",
  symbol: "btc",
  name: "Bitcoin",
  image: "https://example.com/bitcoin.png",
  current_price: 250000,
  market_cap_rank: 1,
  price_change_percentage_24h: 5.25,
  market_cap: 5000000000,
  fully_diluted_valuation: null,
  total_volume: 1000000000,
  high_24h: 260000,
  low_24h: 240000,
  price_change_24h: 12500,
  market_cap_change_24h: 100000000,
  market_cap_change_percentage_24h: 2.1,
  circulating_supply: 19000000,
  total_supply: 21000000,
  max_supply: 21000000,
  ath: 300000,
  ath_change_percentage: -16.67,
  ath_date: "2024-01-01T00:00:00.000Z",
  atl: 100,
  atl_change_percentage: 250000,
  atl_date: "2010-07-01T00:00:00.000Z",
  roi: null,
  last_updated: "2025-01-01T00:00:00.000Z",
  ...overrides,
});

// Helper para criar mock de detalhes
const createMockCryptoDetail = (
  overrides: Partial<CryptocurrencyDetail> = {}
): CryptocurrencyDetail => ({
  id: "bitcoin",
  symbol: "btc",
  name: "Bitcoin",
  description: {
    en: "Bitcoin description in English",
    pt: "Descrição do Bitcoin em português",
  },
  image: {
    thumb: "https://example.com/bitcoin-thumb.png",
    small: "https://example.com/bitcoin-small.png",
    large: "https://example.com/bitcoin-large.png",
  },
  market_cap_rank: 1,
  market_data: {
    current_price: {
      usd: 50000,
      brl: 250000,
    },
    price_change_percentage_24h: 5.25,
    market_cap: {
      usd: 1000000000000,
      brl: 5000000000000,
    },
    total_volume: {
      usd: 20000000000,
      brl: 100000000000,
    },
    circulating_supply: 19000000,
  },
  ...overrides,
});

describe("cryptoStore", () => {
  beforeEach(() => {
    // Reset COMPLETO do store antes de cada teste
    act(() => {
      useCryptoStore.setState({
        cryptocurrencies: [],
        isLoadingList: false,
        listError: null,
        cryptoDetail: null,
        isLoadingDetail: false,
        detailError: null,
        currentDetailId: null,
        searchTerm: "",
      });
    });
    vi.clearAllMocks();
  });

  it("deve ter estado inicial correto", () => {
    const { result } = renderHook(() => useCryptoStore());

    expect(result.current.cryptocurrencies).toEqual([]);
    expect(result.current.isLoadingList).toBe(false);
    expect(result.current.listError).toBe(null);
    expect(result.current.searchTerm).toBe("");
  });

  it("deve buscar lista de criptomoedas com sucesso", async () => {
    const mockData: Cryptocurrency[] = [
      createMockCrypto({ id: "bitcoin", name: "Bitcoin", symbol: "btc" }),
    ];

    mockFetchCryptocurrencies.mockResolvedValueOnce(mockData);

    const { result } = renderHook(() => useCryptoStore());

    await act(async () => {
      await result.current.fetchCryptoList();
    });

    expect(result.current.cryptocurrencies).toEqual(mockData);
    expect(result.current.isLoadingList).toBe(false);
    expect(result.current.listError).toBe(null);
  });

  it("deve tratar erro na busca de lista", async () => {
    const errorMessage = "Erro de teste";
    mockFetchCryptocurrencies.mockRejectedValueOnce(new Error(errorMessage));

    const { result } = renderHook(() => useCryptoStore());

    await act(async () => {
      await result.current.fetchCryptoList();
    });

    expect(result.current.cryptocurrencies).toEqual([]);
    expect(result.current.isLoadingList).toBe(false);
    expect(result.current.listError).toBe(errorMessage);
  });

  it("deve filtrar criptomoedas por termo de busca", () => {
    const mockCryptos: Cryptocurrency[] = [
      createMockCrypto({ id: "bitcoin", name: "Bitcoin", symbol: "btc" }),
      createMockCrypto({ id: "ethereum", name: "Ethereum", symbol: "eth" }),
      createMockCrypto({ id: "cardano", name: "Cardano", symbol: "ada" }),
    ];

    const { result } = renderHook(() => useCryptoStore());

    // Simular dados no store
    act(() => {
      useCryptoStore.setState({
        cryptocurrencies: mockCryptos,
      });
    });

    // Testar busca por nome
    act(() => {
      result.current.setSearchTerm("bit");
    });

    const filtered = result.current.getFilteredCryptocurrencies();
    expect(filtered).toHaveLength(1);
    expect(filtered[0].name).toBe("Bitcoin");
  });

  it("deve filtrar criptomoedas por símbolo", () => {
    const mockCryptos: Cryptocurrency[] = [
      createMockCrypto({ id: "bitcoin", name: "Bitcoin", symbol: "btc" }),
      createMockCrypto({ id: "ethereum", name: "Ethereum", symbol: "eth" }),
    ];

    const { result } = renderHook(() => useCryptoStore());

    act(() => {
      useCryptoStore.setState({
        cryptocurrencies: mockCryptos,
      });
    });

    act(() => {
      result.current.setSearchTerm("eth");
    });

    const filtered = result.current.getFilteredCryptocurrencies();
    expect(filtered).toHaveLength(1);
    expect(filtered[0].symbol).toBe("eth");
  });

  it("deve buscar detalhes de criptomoeda", async () => {
    const mockDetail: CryptocurrencyDetail = createMockCryptoDetail({
      id: "bitcoin",
      name: "Bitcoin",
    });

    mockFetchCryptocurrencyDetail.mockResolvedValueOnce(mockDetail);

    const { result } = renderHook(() => useCryptoStore());

    await act(async () => {
      await result.current.fetchCryptoDetail("bitcoin");
    });

    expect(result.current.cryptoDetail).toEqual(mockDetail);
    expect(result.current.isLoadingDetail).toBe(false);
    expect(result.current.detailError).toBe(null);
  });

  it("deve limpar termo de busca", () => {
    const { result } = renderHook(() => useCryptoStore());

    act(() => {
      result.current.setSearchTerm("bitcoin");
    });

    expect(result.current.searchTerm).toBe("bitcoin");

    act(() => {
      result.current.clearSearch();
    });

    expect(result.current.searchTerm).toBe("");
  });

  it("deve retornar todas as criptomoedas quando não há termo de busca", () => {
    const mockCryptos: Cryptocurrency[] = [
      createMockCrypto({ id: "bitcoin", name: "Bitcoin" }),
      createMockCrypto({ id: "ethereum", name: "Ethereum" }),
    ];

    const { result } = renderHook(() => useCryptoStore());

    act(() => {
      useCryptoStore.setState({
        cryptocurrencies: mockCryptos,
        searchTerm: "",
      });
    });

    const filtered = result.current.getFilteredCryptocurrencies();
    expect(filtered).toHaveLength(2);
    expect(filtered).toEqual(mockCryptos);
  });

  it("deve limpar detalhes da criptomoeda", () => {
    const { result } = renderHook(() => useCryptoStore());

    // Simular estado com detalhes
    act(() => {
      useCryptoStore.setState({
        cryptoDetail: createMockCryptoDetail(),
        detailError: "Erro anterior",
        currentDetailId: "bitcoin",
      });
    });

    act(() => {
      result.current.clearCryptoDetail();
    });

    expect(result.current.cryptoDetail).toBe(null);
    expect(result.current.detailError).toBe(null);
    expect(result.current.currentDetailId).toBe(null);
  });
});
