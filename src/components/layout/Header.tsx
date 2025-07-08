import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(new Date());
    }, 30000); // Atualiza a cada 30 segundos

    return () => clearInterval(interval);
  }, []);

  const handleLogoClick = () => {
    navigate("/");
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <header className="bg-gray-900 border-b border-gray-700 sticky top-0 z-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-24 md:h-28">
          <button
            onClick={handleLogoClick}
            className="flex items-center hover:opacity-90 transition-all duration-300 group p-3 rounded-xl hover:bg-gray-800/50"
            aria-label="Voltar ao início"
          >
            <img
              src="/images/logo-cryptodash.svg"
              alt="CryptoDash Logo"
              className="h-16 w-16 md:h-20 md:w-20 lg:h-24 lg:w-24 group-hover:scale-110 transition-transform duration-300"
            />
          </button>

          <div className="flex items-center space-x-4">
            {/* Versão ultra compacta para mobile */}
            <div
              className="flex md:hidden items-center"
              title="Dados em tempo real"
            >
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>

            {/* Versão simples para MD */}
            <div className="hidden md:flex lg:hidden items-center space-x-2 text-sm text-gray-400">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Live Data</span>
            </div>

            {/* Versão aprimorada para LG+ */}
            <div className="hidden lg:flex items-center space-x-3 text-sm text-gray-400">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Dados atualizados</span>
              </div>
              <span className="text-gray-500">•</span>
              <span className="text-xs text-gray-500">
                {formatTime(lastUpdate)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
