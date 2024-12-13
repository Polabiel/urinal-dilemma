import React from 'react';
import { User } from 'lucide-react';

interface UrinalProps {
  isOccupied: boolean;
  onClick: () => void;
  disabled: boolean;
}

export const Urinal: React.FC<UrinalProps> = ({ isOccupied, onClick, disabled }) => {
  const getButtonStyles = () => {
    if (isOccupied) return 'bg-red-200 cursor-not-allowed';
    if (disabled) return 'bg-gray-200 cursor-not-allowed';
    return 'bg-blue-100 hover:bg-blue-200 cursor-pointer';
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || isOccupied}
      className={`
        w-16 h-24 sm:w-20 sm:h-32 
        m-1 sm:m-2 
        rounded-lg 
        transition-all 
        duration-300
        flex 
        items-center 
        justify-center
        ${getButtonStyles()}
      `}
    >
      <User
        className={`
          w-6 h-6 
          sm:w-8 sm:h-8 
          ${
            isOccupied
              ? 'text-red-500'
              : disabled
              ? 'text-gray-400'
              : 'text-blue-500'
          }
        `}
      />
    </button>
  );
};