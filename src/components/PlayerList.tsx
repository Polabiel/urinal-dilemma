import React from 'react';
import { Player } from '../types/game';

interface PlayerListProps {
  players: Player[];
}

export const PlayerList: React.FC<PlayerListProps> = ({ players }) => {
  return (
        <div className="bg-white p-3 sm:p-4 rounded-lg shadow-md">
          <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3">Jogadores</h3>
          <div className="space-y-1 sm:space-y-2">
            {[...players].sort((a, b) => b.score - a.score).map((player) => (
              <div
                key={player.id}
                className="flex justify-between items-center p-1.5 sm:p-2 bg-gray-50 rounded text-sm sm:text-base"
              >
                <div className="flex-1 min-w-0">
                  <span className="font-medium block truncate">{player.name}</span>
                </div>
                <div className="flex-shrink-0 ml-2">
                  <span className="text-blue-600 whitespace-nowrap">
                    {player.score} pontos
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
  );
};