import React from 'react';
import { Share2 } from 'lucide-react';
import { Player } from '../types/game';

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
  const copyGameId = () => {
    navigator.clipboard.writeText(gameId);
  };

  return (
    <div className="bg-white rounded-lg shadow-xl p-4 sm:p-8">
      <h2 className="text-xl sm:text-2xl font-bold text-center text-blue-900 mb-4 sm:mb-6">
        Sala de Espera
      </h2>

      <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
          <div className="w-full sm:flex-1">
            <input
              type="text"
              value={gameId}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm sm:text-base"
            />
          </div>
            <button
            onClick={() => {
              const gameUrl = `${window.location.origin}${window.location.pathname}`;
              navigator.clipboard.writeText(gameUrl);
            }}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-md text-sm sm:text-base"
            >
            <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
            Copiar Link
            </button>
        </div>

        <div className="border rounded-lg p-4">
          <h3 className="text-base sm:text-lg font-semibold mb-3">Jogadores:</h3>
          <ul className="space-y-2">
            {players.map((player) => (
              <li
                key={player.id}
                className="flex items-center justify-between text-sm sm:text-base"
              >
                <span>{player.name}</span>
                <span
                  className={`px-2 py-1 rounded-full text-xs sm:text-sm ${
                    player.isReady
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {player.isReady ? 'Pronto' : 'Aguardando'}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <button
        onClick={onReady}
        disabled={isCurrentPlayerReady}
        className={`w-full mt-6 px-4 py-2 rounded-md text-sm sm:text-base font-medium transition-colors ${
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