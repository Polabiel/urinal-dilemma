import React from 'react';
import { Player } from '../types/game';

interface PlayerListProps {
  players: Player[];
}

export const PlayerList: React.FC<PlayerListProps> = ({ players }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-3">Jogadores</h3>
      <div className="space-y-2">
        {players.sort((a, b) => b.score - a.score).map((player) => (
          <div
            key={player.id}
            className="flex justify-between items-center p-2 bg-gray-50 rounded"
          >
            <span className="font-medium">{player.name}</span>
            <span className="text-blue-600">{player.score} pontos</span>
          </div>
        ))}
      </div>
    </div>
  );
};