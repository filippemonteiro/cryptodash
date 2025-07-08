import React from "react";

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  onRetry,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-red-900/20 border border-red-500/30 rounded-lg mx-4">
      <div className="text-red-400 text-4xl mb-4">⚠️</div>
      <h3 className="text-lg font-semibold text-red-300 mb-2 text-center">
        Ops! Algo deu errado
      </h3>
      <p className="text-red-200 text-sm md:text-base text-center mb-4 max-w-md">
        {message}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200 text-sm md:text-base"
        >
          Tentar novamente
        </button>
      )}
    </div>
  );
};
