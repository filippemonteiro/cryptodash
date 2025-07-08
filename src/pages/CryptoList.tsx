import React, { useEffect } from "react";
import { useCryptoStore } from "../store/cryptoStore";
import { CryptoCard } from "../components/CryptoCard";
import { SearchInput } from "../components/ui/SearchInput";
import { Loading } from "../components/ui/Loading";
import { ErrorMessage } from "../components/ui/ErrorMessage";

export const CryptoList: React.FC = () => {
  const {
    isLoadingList,
    listError,
    searchTerm,
    fetchCryptoList,
    clearListError,
    setSearchTerm,
    getFilteredCryptocurrencies,
  } = useCryptoStore();

  const filteredCryptos = getFilteredCryptocurrencies();

  useEffect(() => {
    fetchCryptoList();
  }, [fetchCryptoList]);

  const handleRetry = () => {
    clearListError();
    fetchCryptoList();
  };

  if (isLoadingList) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <Loading message="Carregando criptomoedas..." />
      </div>
    );
  }

  if (listError) {
    const isRateLimitError =
      listError.includes("limite") || listError.includes("requisições");

    return (
      <div className="flex items-center justify-center min-h-96 p-4">
        <ErrorMessage
          message={listError}
          onRetry={handleRetry}
          retryText={
            isRateLimitError ? "Aguardar e tentar novamente" : "Recarregar"
          }
        />
      </div>
    );
  }

  return (
    <div className="py-6 px-4 md:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
            Principais Criptomoedas
          </h2>
          <p className="text-gray-400 text-sm md:text-base">
            Acompanhe as maiores criptomoedas por capitalização de mercado
          </p>
        </div>

        <SearchInput
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Buscar por nome ou símbolo..."
        />

        {filteredCryptos.length === 0 && searchTerm ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg mb-2">🔍</div>
            <p className="text-gray-400 text-base md:text-lg">
              Nenhuma criptomoeda encontrada para "{searchTerm}"
            </p>
            <button
              onClick={() => setSearchTerm("")}
              className="mt-4 text-blue-400 hover:text-blue-300 transition-colors"
            >
              Limpar busca
            </button>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <p className="text-gray-400 text-sm md:text-base">
                {searchTerm
                  ? `${filteredCryptos.length} resultado(s) encontrado(s)`
                  : `Exibindo ${filteredCryptos.length} criptomoedas`}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {filteredCryptos.map((crypto) => (
                <CryptoCard key={crypto.id} crypto={crypto} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
