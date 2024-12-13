import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { User } from 'lucide-react';

export const Home: React.FC = () => {
  const [playerName, setPlayerName] = useState('');
  const [gameId, setGameId] = useState('');
  const navigate = useNavigate();

  const createNewGame = () => {
    if (!playerName) return;
    const newGameId = uuidv4();
    navigate(`/game/${newGameId}?name=${encodeURIComponent(playerName)}`);
  };

  const joinGame = () => {
    if (!playerName || !gameId) return;
    navigate(`/game/${gameId}?name=${encodeURIComponent(playerName)}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
        <div className="flex items-center justify-center mb-6">
          <User className="w-12 h-12 text-blue-500" />
          <h1 className="text-3xl font-bold text-blue-900 ml-3">
            Dilema dos Mictórios
          </h1>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Seu Nome
            </label>
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Digite seu nome"
            />
          </div>

          <div className="flex flex-col space-y-4">
            <button
              onClick={createNewGame}
              disabled={!playerName}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Criar Nova Partida
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">OU</span>
              </div>
            </div>

            <div>
              <input
                type="text"
                value={gameId}
                onChange={(e) => setGameId(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-2"
                placeholder="Cole o código da partida"
              />
              <button
                onClick={joinGame}
                disabled={!playerName || !gameId}
                className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Entrar na Partida
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};