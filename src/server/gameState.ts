import { GameState } from '../types/game';
import { generateUrinals } from './gameLogic';

const games = new Map<string, GameState>();

export const getGame = (gameId: string): GameState | undefined => {
  return games.get(gameId);
};

export const createGame = (gameId: string): GameState => {
  const game: GameState = {
    id: gameId,
    day: 1,
    urinals: generateUrinals(1),
    players: [],
    gameOver: false,
    message: '',
    waitingAvailable: false,
    waitingPlayers: []
  };
  games.set(gameId, game);
  return game;
};

export const removeGame = (gameId: string): void => {
  games.delete(gameId);
};

export const getOrCreateGame = (gameId: string): GameState => {
  return getGame(gameId) || createGame(gameId);
};