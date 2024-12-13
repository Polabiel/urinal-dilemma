import { useEffect, useCallback, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { GameState, GameAction } from '../types/game';

const SOCKET_URL = 'http://localhost:3001';

export const useMultiplayerGame = (
  gameId: string,
  playerId: string,
  playerName: string,
  onGameStateUpdate: (state: GameState) => void
) => {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    socketRef.current = io(SOCKET_URL, {
      query: {
        gameId,
        playerId,
        playerName,
      },
    });

    socketRef.current.on('gameState', (state: GameState) => {
      onGameStateUpdate(state);
    });

    socketRef.current.on('connect_error', (error) => {
      console.error('Connection error:', error);
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [gameId, playerId, playerName, onGameStateUpdate]);

  const sendAction = useCallback((action: GameAction) => {
    socketRef.current?.emit('gameAction', action);
  }, []);

  const selectUrinal = useCallback((index: number) => {
    sendAction({
      type: 'SELECT_URINAL',
      playerId,
      payload: { index },
    });
  }, [playerId, sendAction]);

  const waitForUrinal = useCallback(() => {
    sendAction({
      type: 'WAIT',
      playerId,
    });
  }, [playerId, sendAction]);

  const markAsReady = useCallback(() => {
    sendAction({
      type: 'PLAYER_READY',
      playerId,
    });
  }, [playerId, sendAction]);

  return {
    selectUrinal,
    waitForUrinal,
    markAsReady,
  };
};