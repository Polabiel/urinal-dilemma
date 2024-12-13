import React, { useState, useEffect, useRef } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { GameBoard } from "../components/GameBoard";
import { WaitingRoom } from "../components/WaitingRoom";
import { PlayerList } from "../components/PlayerList";
import { useMultiplayerGame } from "../hooks/useMultiplayerGame";
import { GameState } from "../types/game";
import { Socket } from "socket.io-client";

export const Game: React.FC = () => {
  const { gameId = "" } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const playerName = searchParams.get("name");
  const [playerId] = useState(() => uuidv4());
  const [gameState, setGameState] = useState<GameState | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleTabClose = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";

      if (socketRef.current) {
        socketRef.current.emit("disconnect");
        socketRef.current.disconnect();
      }
    };

    window.addEventListener("beforeunload", handleTabClose);

    return () => {
      window.removeEventListener("beforeunload", handleTabClose);
    };
  }, [gameId]);

  const [tempName, setTempName] = useState("");

  if (!playerName) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-6 sm:p-8 w-full max-w-md">
          <div className="flex flex-col items-center space-y-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-blue-900">
              {gameId ? "Entrar na Partida" : "Nova Partida"}
            </h1>

            <div className="w-full space-y-4">
              <p className="text-red-600 font-medium text-center">
                Você precisa informar um nome para jogar.
              </p>

              <input
                type="text"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Digite seu nome"
              />

              <button
                onClick={async () => {
                  if (tempName.trim()) {
                    setIsLoading(true);
                    try {
                      await navigate(
                        `/game/${gameId}?name=${encodeURIComponent(
                          tempName.trim()
                        )}`,
                        { replace: true }
                      );
                      // Pequeno delay para garantir que a navegação foi concluída
                      await new Promise((resolve) => setTimeout(resolve, 100));
                      // Recarrega usando history API
                      window.history.go(0);
                    } catch (error) {
                      console.error("Erro ao navegar:", error);
                    } finally {
                      setIsLoading(false);
                    }
                  }
                }}
                className={`
    w-full px-6 py-3 rounded-md font-medium transition-colors
    ${
      isLoading
        ? "bg-gray-400 cursor-not-allowed"
        : "bg-blue-500 hover:bg-blue-600"
    }
    text-white disabled:opacity-50
  `}
                disabled={!tempName.trim() || isLoading}
              >
                {isLoading ? "Carregando..." : "Ir para o jogo"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
              shouldWait={(urinals) => urinals.every((u) => u)}
            />
          </div>
          <div className="col-span-1">
            <PlayerList players={gameState.players} />
          </div>
        </div>

        {gameState.message && (
          <div className="mt-4 text-center">
            <p className="text-lg font-medium text-blue-800">
              {gameState.message}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
