import React from 'react';
import { User } from 'lucide-react';

interface UrinalProps {
  isOccupied: boolean;
  onClick: () => void;
  disabled: boolean;
}

export const Urinal: React.FC<UrinalProps> = ({ isOccupied, onClick, disabled }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled || isOccupied}
      className={`
        w-20 h-32 m-2 rounded-lg transition-all duration-300
        flex items-center justify-center
        ${isOccupied 
          ? 'bg-red-200 cursor-not-allowed' 
          : disabled 
            ? 'bg-gray-200 cursor-not-allowed'
            : 'bg-blue-100 hover:bg-blue-200 cursor-pointer'
        }
      `}
    >
      {isOccupied && <User className="w-8 h-8 text-red-500" />}
    </button>
  );
}