import React from "react";
import { useNavigate } from "react-router-dom";

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  showHomeButton?: boolean;
  retryText?: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  onRetry,
  showHomeButton = true,
  retryText = "Tentar novamente",
}) => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-red-900/20 border border-red-500/30 rounded-lg mx-4 max-w-md">
      <div className="text-red-400 text-4xl mb-4">⚠️</div>
      <h3 className="text-lg font-semibold text-red-300 mb-2 text-center">
        Ops! Algo deu errado
      </h3>
      <p className="text-red-200 text-sm md:text-base text-center mb-6 leading-relaxed">
        {message}
      </p>
      <div className="flex flex-col sm:flex-row gap-3 w-full">
        {onRetry && (
          <button
            onClick={onRetry}
            className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg 
                      transition-colors duration-200 text-sm md:text-base font-medium"
          >
            {retryText}
          </button>
        )}
        {showHomeButton && (
          <button
            onClick={handleGoHome}
            className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg 
                      transition-colors duration-200 text-sm md:text-base font-medium"
          >
            Voltar ao início
          </button>
        )}
      </div>
    </div>
  );
};
