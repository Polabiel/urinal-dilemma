import { useState, useCallback } from 'react';
import { GameState } from '../types/game';
import { generateNewDay } from '../utils/gameLogic';

const createInitialState = (): GameState => ({
  id: Math.random().toString(),
  day: 1,
  urinals: generateNewDay(1).map((isOccupied, id) => ({ id, isOccupied })),
  score: 0,
  gameOver: false,
  message: '',
  players: [],
  waitingAvailable: true,
  waitingPlayers: [],
});

export const useGameState = () => {
  const [gameState, setGameState] = useState<GameState>(createInitialState());

  const advanceToNextDay = useCallback((currentScore: number) => {
    setGameState(prev => {
      const nextDay = prev.day + 1;
      return {
        ...prev,
        day: nextDay,
        urinals: generateNewDay(nextDay).map((isOccupied, id) => ({ id, isOccupied })),
        score: currentScore,
        gameOver: false,
        message: '',
      };
    });
  }, []);

  const updateGameState = useCallback((updates: Partial<GameState>) => {
    setGameState(prev => ({
      ...prev,
      ...updates,
    }));
  }, []);

  const resetGame = useCallback(() => {
    setGameState(createInitialState());
  }, []);

  return {
    gameState,
    advanceToNextDay,
    updateGameState,
    resetGame,
  };
};