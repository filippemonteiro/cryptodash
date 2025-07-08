import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCryptoStore } from "../store/cryptoStore";
import { Loading } from "../components/ui/Loading";
import { ErrorMessage } from "../components/ui/ErrorMessage";
import { formatBRL, formatUSD, formatPercentage, formatLargeNumber } from "../services/cryptoAPI";

export const CryptoDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const {
    cryptoDetail,
    isLoadingDetail,
    detailError,
    fetchCryptoDetail,
    clearDetailError,
    clearCryptoDetail
  } = useCryptoStore();

  useEffect(() => {
    if (id) {
      fetchCryptoDetail(id);
    }
    return () => {
      clearCryptoDetail();
    };
  }, [id, fetchCryptoDetail, clearCryptoDetail]);

  const handleBack = () => {
    navigate("/");
  };

  const handleRetry = () => {
    clearDetailError();
    if (id) fetchCryptoDetail(id);
  };

  if (isLoadingDetail) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <Loading message="Carregando detalhes..." />
      </div>
    );
  }

  if (detailError) {
    const isRateLimitError = detailError.includes("limite") || detailError.includes("requisições");
    
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <ErrorMessage 
          message={detailError} 
          onRetry={handleRetry}
          showHomeButton={isRateLimitError}
          retryText={isRateLimitError ? "Tentar novamente" : "Recarregar"}
        />
      </div>
    );
  }

  if (!cryptoDetail) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <ErrorMessage 
          message="Criptomoeda não encontrada"
          showHomeButton={true}
        />
      </div>
    );
  }

  const isPositiveChange = cryptoDetail.market_data.price_change_percentage_24h > 0;

  return (
    <div className="min-h-screen bg-slate-900 py-6 px-4 md:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={handleBack}
          className="flex items-center text-blue-400 hover:text-blue-300 transition-colors mb-6"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Voltar para lista
        </button>

        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <img 
                src={cryptoDetail.image.large} 
                alt={cryptoDetail.name}
                className="w-16 h-16 md:w-20 md:h-20 rounded-full"
              />
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white">
                  {cryptoDetail.name}
                </h1>
                <p className="text-gray-400 text-lg uppercase">
                  {cryptoDetail.symbol}
                </p>
                <p className="text-gray-500 text-sm">
                  Ranking #{cryptoDetail.market_cap_rank}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-white border-b border-gray-600 pb-2">
                Preços
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Preço (BRL):</span>
                  <span className="text-white font-semibold text-lg">
                    {formatBRL(cryptoDetail.market_data.current_price.brl)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Preço (USD):</span>
                  <span className="text-white font-semibold">
                    {formatUSD(cryptoDetail.market_data.current_price.usd)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Variação 24h:</span>
                  <span 
                    className={`font-semibold ${
                      isPositiveChange ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {isPositiveChange ? "+" : ""}{formatPercentage(cryptoDetail.market_data.price_change_percentage_24h)}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-white border-b border-gray-600 pb-2">
                Estatísticas de Mercado
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Market Cap:</span>
                  <span className="text-white font-semibold">
                    {formatBRL(cryptoDetail.market_data.market_cap.brl)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Volume 24h:</span>
                  <span className="text-white font-semibold">
                    {formatBRL(cryptoDetail.market_data.total_volume.brl)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Supply Circulante:</span>
                  <span className="text-white font-semibold">
                    {formatLargeNumber(cryptoDetail.market_data.circulating_supply)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {cryptoDetail.description.pt && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-white border-b border-gray-600 pb-2">
                Sobre {cryptoDetail.name}
              </h2>
              <div 
                className="text-gray-300 leading-relaxed text-sm md:text-base"
                dangerouslySetInnerHTML={{ 
                  __html: cryptoDetail.description.pt.slice(0, 500) + "..." 
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
