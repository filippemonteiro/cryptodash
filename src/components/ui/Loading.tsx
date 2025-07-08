import React from "react";

interface LoadingProps {
  message?: string;
  size?: "sm" | "md" | "lg";
}

export const Loading: React.FC<LoadingProps> = ({
  message = "Carregando...",
  size = "md",
}) => {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div
        className={`${sizeClasses[size]} border-4 border-gray-600 border-t-blue-500 rounded-full animate-spin`}
      />
      <p className="mt-4 text-gray-400 text-sm md:text-base">{message}</p>
    </div>
  );
};
