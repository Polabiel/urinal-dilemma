import React from 'react';
import { Urinal } from './Urinal';
import { GameState } from '../types/game';

interface GameBoardProps {
  gameState: GameState;
  onUrinalSelect: (index: number) => void;
}

export const GameBoard: React.FC<GameBoardProps> = ({ gameState, onUrinalSelect }) => {
  return (
    <div className="flex flex-col items-center">
      <div className="mb-8">
        <h2 className="text-2xl font-bold">Dia {gameState.day}</h2>
        <p className="text-lg">Pontuação: {gameState.score}</p>
      </div>
      
      <div className="flex justify-center items-end space-x-2 bg-gray-100 p-8 rounded-lg">
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
        <div className={`mt-4 p-4 rounded-lg ${
          gameState.message.includes('Correto') 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {gameState.message}
        </div>
      )}
    </div>
  );
}