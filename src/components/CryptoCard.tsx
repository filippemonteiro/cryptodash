import React from "react";
import { useNavigate } from "react-router-dom";
import { Cryptocurrency } from "../types/crypto";
import { formatBRL, formatPercentage } from "../services/cryptoAPI";

interface CryptoCardProps {
  crypto: Cryptocurrency;
}

export const CryptoCard: React.FC<CryptoCardProps> = ({ crypto }) => {
  const navigate = useNavigate();

  const isPositiveChange = crypto.price_change_percentage_24h > 0;

  const handleClick = () => {
    navigate(`/coin/${crypto.id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="bg-gray-800 hover:bg-gray-750 border border-gray-700 rounded-lg p-4 md:p-6 
                cursor-pointer transition-all duration-200 hover:border-blue-500 hover:shadow-lg 
                hover:shadow-blue-500/10 transform hover:-translate-y-1"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <img
            src={crypto.image}
            alt={crypto.name}
            className="w-8 h-8 md:w-10 md:h-10 rounded-full"
            loading="lazy"
          />
          <div>
            <h3 className="font-semibold text-white text-sm md:text-base">
              {crypto.name}
            </h3>
            <p className="text-gray-400 text-xs md:text-sm uppercase">
              {crypto.symbol}
            </p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-xs md:text-sm text-gray-400">
            #{crypto.market_cap_rank}
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-gray-400 text-xs md:text-sm">Preço:</span>
          <span className="font-semibold text-white text-sm md:text-base">
            {formatBRL(crypto.current_price)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-gray-400 text-xs md:text-sm">24h:</span>
          <span
            className={`font-semibold text-sm md:text-base ${
              isPositiveChange ? "text-green-500" : "text-red-500"
            }`}
          >
            {isPositiveChange ? "+" : ""}
            {formatPercentage(crypto.price_change_percentage_24h)}
          </span>
        </div>
      </div>
    </div>
  );
};
