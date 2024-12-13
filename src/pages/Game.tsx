import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { GameBoard } from '../components/GameBoard';
import { WaitingRoom } from '../components/WaitingRoom';
import { PlayerList } from '../components/PlayerList';
import { useMultiplayerGame } from '../hooks/useMultiplayerGame';
import { GameState } from '../types/game';

export const Game: React.FC = () => {
  const { gameId = '' } = useParams();
  const [searchParams] = useSearchParams();
  const playerName = searchParams.get('name') || '';
  const [playerId] = useState(() => uuidv4());
  const [gameState, setGameState] = useState<GameState | null>(null);

  const { selectUrinal, waitForUrinal, markAsReady } = useMultiplayerGame(
    gameId,
    playerId,
    playerName,
    setGameState
  );

  const isCurrentPlayerReady = gameState?.players.find(
    (p) => p.id === playerId
  )?.isReady;

  const allPlayersReady = gameState?.players.every((p) => p.isReady);

  if (!gameState) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 flex items-center justify-center">
        <div className="text-xl">Conectando...</div>
      </div>
    );
  }

  if (!allPlayersReady) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 p-8">
        <div className="max-w-2xl mx-auto">
          <WaitingRoom
            players={gameState.players}
            gameId={gameId}
            onReady={markAsReady}
            isCurrentPlayerReady={!!isCurrentPlayerReady}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-900 mb-2">
            Dilema dos Mictórios
          </h1>
          <p className="text-lg text-blue-700">Dia {gameState.day}</p>
        </header>

        <div className="grid grid-cols-4 gap-8">
          <div className="col-span-3">
            <GameBoard
              gameState={gameState}
              onUrinalSelect={selectUrinal}
              onWait={waitForUrinal}
              playerId={playerId}
            />
          </div>
          <div className="col-span-1">
            <PlayerList players={gameState.players} />
          </div>
        </div>

        {gameState.message && (
          <div className="mt-4 text-center">
            <p className="text-lg font-medium text-blue-800">{gameState.message}</p>
          </div>
        )}
      </div>
    </div>
  );
};