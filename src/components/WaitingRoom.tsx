import React from 'react';
import { Player } from '../types/game';
import { User } from 'lucide-react';

interface WaitingRoomProps {
  players: Player[];
  gameId: string;
  onReady: () => void;
  isCurrentPlayerReady: boolean;
}

export const WaitingRoom: React.FC<WaitingRoomProps> = ({
  players,
  gameId,
  onReady,
  isCurrentPlayerReady,
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-4">Sala de Espera</h2>
      
      <div className="mb-4">
        <p className="text-gray-600 mb-2">Código da partida:</p>
        <div className="bg-gray-100 p-2 rounded flex items-center justify-between">
          <code className="text-blue-600">{gameId}</code>
          <button
            onClick={() => navigator.clipboard.writeText(gameId)}
            className="text-gray-500 hover:text-gray-700"
          >
            Copiar
          </button>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="font-semibold mb-2">Jogadores:</h3>
        <div className="space-y-2">
          {players.map((player) => (
            <div
              key={player.id}
              className="flex items-center justify-between bg-gray-50 p-2 rounded"
            >
              <div className="flex items-center">
                <User className="w-5 h-5 mr-2 text-gray-500" />
                <span>{player.name}</span>
              </div>
              {player.isReady && (
                <span className="text-green-500 text-sm">Pronto</span>
              )}
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={onReady}
        disabled={isCurrentPlayerReady}
        className={`w-full py-2 px-4 rounded-md ${
          isCurrentPlayerReady
            ? 'bg-green-500 text-white cursor-not-allowed'
            : 'bg-blue-500 hover:bg-blue-600 text-white'
        }`}
      >
        {isCurrentPlayerReady ? 'Pronto!' : 'Marcar como Pronto'}
      </button>
    </div>
  );
};