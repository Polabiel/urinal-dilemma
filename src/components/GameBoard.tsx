import React from 'react';
import { Urinal } from './Urinal';
import { GameState } from '../types/game';

interface GameBoardProps {
  gameState: GameState;
  onUrinalSelect: (index: number) => void;
  onWait: () => void;
  shouldWait: (urinals: boolean[]) => boolean;
}

export const GameBoard: React.FC<GameBoardProps> = ({ gameState, onUrinalSelect, onWait, shouldWait }) => {
  return (
    <div className="flex flex-col items-center w-full">
      <div className="mb-4 sm:mb-8 text-center">
        <h2 className="text-xl sm:text-2xl font-bold">Dia {gameState.day}</h2>
        <p className="text-base sm:text-lg">Pontuação: {gameState.score}</p>
      </div>
      
      <div className="flex flex-wrap justify-center items-end gap-1 sm:gap-2 bg-gray-100 p-4 sm:p-8 rounded-lg w-full">
        {gameState.urinals.map((urinal, index) => (
          <Urinal
            key={urinal.id}
            isOccupied={urinal.isOccupied}
            onClick={() => onUrinalSelect(index)}
            disabled={gameState.gameOver}
          />
        ))}
      </div>
      
      {gameState.message && (
        <div className={`mt-4 p-3 sm:p-4 rounded-lg text-sm sm:text-base w-full text-center ${
          gameState.message.includes('Correto') 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {gameState.message}
        </div>
      )}

      <div className="flex justify-center items-center mt-4 w-full">
        <button
          onClick={onWait}
          className={`
            py-2 px-4 rounded-md transition-all text-sm sm:text-base
            w-full sm:w-auto
            ${shouldWait(gameState.urinals.map(u => u.isOccupied))
              ? 'bg-gray-300 text-gray-700'
              : 'bg-green-500 hover:bg-green-600 text-white'
            }
          `}
        >
          Esperar próximo mictório
        </button>
      </div>
    </div>
  );
}