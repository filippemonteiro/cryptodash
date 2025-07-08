import { create } from "zustand";
import { Cryptocurrency, CryptocurrencyDetail } from "../types/crypto";
import {
  fetchCryptocurrencies,
  fetchCryptocurrencyDetail,
} from "../services/cryptoAPI";

// Interface do estado do store
interface CryptoStore {
  // Estado da lista de criptomoedas
  cryptocurrencies: Cryptocurrency[];
  isLoadingList: boolean;
  listError: string | null;

  // Estado dos detalhes de uma criptomoeda
  cryptoDetail: CryptocurrencyDetail | null;
  isLoadingDetail: boolean;
  detailError: string | null;

  // Estado do filtro de busca
  searchTerm: string;

  // Ações para a lista de criptomoedas
  fetchCryptoList: () => Promise<void>;
  clearListError: () => void;

  // Ações para os detalhes de uma criptomoeda
  fetchCryptoDetail: (coinId: string) => Promise<void>;
  clearDetailError: () => void;
  clearCryptoDetail: () => void;

  // Ações para busca/filtro
  setSearchTerm: (term: string) => void;
  clearSearch: () => void;

  // Função computada para filtrar criptomoedas
  getFilteredCryptocurrencies: () => Cryptocurrency[];
}

// Criando o store com Zustand
export const useCryptoStore = create<CryptoStore>((set, get) => ({
  // Estado inicial
  cryptocurrencies: [],
  isLoadingList: false,
  listError: null,

  cryptoDetail: null,
  isLoadingDetail: false,
  detailError: null,

  searchTerm: "",

  // Ação para buscar a lista de criptomoedas
  fetchCryptoList: async () => {
    set({ isLoadingList: true, listError: null });

    try {
      const cryptocurrencies = await fetchCryptocurrencies();
      set({
        cryptocurrencies,
        isLoadingList: false,
        listError: null,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro desconhecido";
      set({
        isLoadingList: false,
        listError: errorMessage,
        cryptocurrencies: [],
      });
    }
  },

  // Ação para limpar erro da lista
  clearListError: () => {
    set({ listError: null });
  },

  // Ação para buscar detalhes de uma criptomoeda
  fetchCryptoDetail: async (coinId: string) => {
    set({ isLoadingDetail: true, detailError: null, cryptoDetail: null });

    try {
      const cryptoDetail = await fetchCryptocurrencyDetail(coinId);
      set({
        cryptoDetail,
        isLoadingDetail: false,
        detailError: null,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro desconhecido";
      set({
        isLoadingDetail: false,
        detailError: errorMessage,
        cryptoDetail: null,
      });
    }
  },

  // Ação para limpar erro dos detalhes
  clearDetailError: () => {
    set({ detailError: null });
  },

  // Ação para limpar os detalhes da criptomoeda
  clearCryptoDetail: () => {
    set({ cryptoDetail: null, detailError: null });
  },

  // Ação para definir o termo de busca
  setSearchTerm: (term: string) => {
    set({ searchTerm: term });
  },

  // Ação para limpar a busca
  clearSearch: () => {
    set({ searchTerm: "" });
  },

  // Função computada para filtrar criptomoedas baseado no termo de busca
  getFilteredCryptocurrencies: () => {
    const { cryptocurrencies, searchTerm } = get();

    if (!searchTerm.trim()) {
      return cryptocurrencies;
    }

    const lowercaseSearchTerm = searchTerm.toLowerCase().trim();

    return cryptocurrencies.filter(
      (crypto) =>
        crypto.name.toLowerCase().includes(lowercaseSearchTerm) ||
        crypto.symbol.toLowerCase().includes(lowercaseSearchTerm)
    );
  },
}));
