import React from "react";

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 border-t border-gray-700 mt-auto">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold text-white mb-2">
              CryptoDash
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Dashboard interativo para acompanhar as principais criptomoedas do
              mercado em tempo real.
            </p>
          </div>

          <div className="text-center">
            <h4 className="text-white font-medium mb-2">
              Dados fornecidos por
            </h4>
            <a
              href="https://www.coingecko.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 transition-colors text-sm"
            >
              CoinGecko API
            </a>
            <p className="text-gray-500 text-xs mt-1">
              API gratuita para dados de criptomoedas
            </p>
          </div>

          <div className="text-center md:text-right">
            <h4 className="text-white font-medium mb-2">Desenvolvido por</h4>
            <a
              href="https://filippemonteiro.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 transition-colors text-sm font-medium"
            >
              Filippe Monteiro
            </a>
            <p className="text-gray-500 text-xs mt-1">Frontend Developer</p>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-6 pt-6">
          <div className="flex flex-col md:flex-row items-center justify-between text-center md:text-left">
            <p className="text-gray-400 text-sm">© {currentYear} CryptoDash.</p>
            <div className="flex items-center space-x-4 mt-3 md:mt-0">
              <span className="text-gray-500 text-xs">
                Feito com React + TypeScript + Tailwind CSS
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
