import { create } from "zustand";
import { Cryptocurrency, CryptocurrencyDetail } from "../types/crypto";
import {
  fetchCryptocurrencies,
  fetchCryptocurrencyDetail,
} from "../services/cryptoAPI";

interface CryptoStore {
  cryptocurrencies: Cryptocurrency[];
  isLoadingList: boolean;
  listError: string | null;
  
  cryptoDetail: CryptocurrencyDetail | null;
  isLoadingDetail: boolean;
  detailError: string | null;
  
  searchTerm: string;
  
  fetchCryptoList: () => Promise<void>;
  clearListError: () => void;
  fetchCryptoDetail: (coinId: string) => Promise<void>;
  clearDetailError: () => void;
  clearCryptoDetail: () => void;
  setSearchTerm: (term: string) => void;
  clearSearch: () => void;
  getFilteredCryptocurrencies: () => Cryptocurrency[];
}

export const useCryptoStore = create<CryptoStore>((set, get) => ({
  cryptocurrencies: [],
  isLoadingList: false,
  listError: null,
  cryptoDetail: null,
  isLoadingDetail: false,
  detailError: null,
  searchTerm: "",

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

  clearListError: () => {
    set({ listError: null });
  },

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

  clearDetailError: () => {
    set({ detailError: null });
  },

  clearCryptoDetail: () => {
    set({ cryptoDetail: null, detailError: null });
  },

  setSearchTerm: (term: string) => {
    set({ searchTerm: term });
  },

  clearSearch: () => {
    set({ searchTerm: "" });
  },

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
