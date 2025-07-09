import { vi } from "vitest";
import {
  fetchCryptocurrencies,
  fetchCryptocurrencyDetail,
  formatBRL,
  formatUSD,
  formatPercentage,
} from "../cryptoAPI";

// Mock do fetch
const mockFetch = vi.fn();
globalThis.fetch = mockFetch;

describe("cryptoAPI", () => {
  beforeEach(() => {
    mockFetch.mockClear();
    vi.clearAllTimers();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("fetchCryptocurrencies", () => {
    it("deve retornar lista de criptomoedas com sucesso", async () => {
      const mockData = [
        {
          id: "bitcoin",
          name: "Bitcoin",
          symbol: "btc",
          current_price: 250000,
        },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockData,
      });

      const result = await fetchCryptocurrencies();

      expect(result).toEqual(mockData);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/coins/markets"),
        expect.objectContaining({
          mode: "cors",
          headers: { Accept: "application/json" },
        })
      );
    });

    it("deve lançar erro personalizado para status 429", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 429,
      });

      await expect(fetchCryptocurrencies()).rejects.toThrow(
        "Muitas pessoas acessando os dados ao mesmo tempo"
      );
    });

    it("deve lançar erro personalizado para status 403", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 403,
      });

      await expect(fetchCryptocurrencies()).rejects.toThrow(
        "Serviço temporariamente indisponível"
      );
    });

    it("deve respeitar rate limiting", async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => [],
      });

      // Simular duas chamadas consecutivas
      const promise1 = fetchCryptocurrencies();
      const promise2 = fetchCryptocurrencies();

      // Avançar o tempo para simular o delay
      vi.advanceTimersByTime(3000);

      await promise1;
      await promise2;

      // Verificar que houve delay entre as chamadas
      expect(mockFetch).toHaveBeenCalledTimes(1); // primeira chamada imediata
    });
  });

  describe("fetchCryptocurrencyDetail", () => {
    it("deve retornar detalhes da criptomoeda", async () => {
      const mockDetail = {
        id: "bitcoin",
        name: "Bitcoin",
        symbol: "btc",
        market_data: {
          current_price: { brl: 250000, usd: 50000 },
        },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockDetail,
      });

      const result = await fetchCryptocurrencyDetail("bitcoin");

      expect(result).toEqual(mockDetail);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/coins/bitcoin"),
        expect.any(Object)
      );
    });
  });

  describe("formatters", () => {
    it("deve formatar BRL corretamente", () => {
      const formatted250k = formatBRL(250000);
      const formatted1234 = formatBRL(1234.56);

      // Verificar que contém os elementos essenciais
      expect(formatted250k).toContain("R$");
      expect(formatted250k).toContain("250");
      expect(formatted250k).toContain("000");
      expect(formatted250k).toContain("00");

      expect(formatted1234).toContain("R$");
      expect(formatted1234).toContain("1");
      expect(formatted1234).toContain("234");
      expect(formatted1234).toContain("56");
    });

    it("deve formatar USD corretamente", () => {
      const formatted50k = formatUSD(50000);
      const formatted1234 = formatUSD(1234.56);

      expect(formatted50k).toContain("$");
      expect(formatted50k).toContain("50");
      expect(formatted50k).toContain("000");

      expect(formatted1234).toContain("$");
      expect(formatted1234).toContain("1");
      expect(formatted1234).toContain("234");
      expect(formatted1234).toContain("56");
    });

    it("deve formatar percentuais corretamente", () => {
      const formatted525 = formatPercentage(5.25);
      const formattedNeg345 = formatPercentage(-3.45);

      expect(formatted525).toContain("5");
      expect(formatted525).toContain("25");
      expect(formatted525).toContain("%");

      expect(formattedNeg345).toContain("-3");
      expect(formattedNeg345).toContain("45");
      expect(formattedNeg345).toContain("%");
    });
  });
});
