import { Socket } from 'socket.io';
import { GameAction, Player } from '../types/game';
import { getOrCreateGame, removeGame } from './gameState';
import { generateUrinals, isOptimalPosition } from './gameLogic';
import { shouldWait } from '../utils/gameLogic';

export const handleConnection = (
  socket: Socket,
  io: any,
  query: { gameId: string; playerId: string; playerName: string }
) => {
  const { gameId, playerId, playerName } = query;
  
  socket.join(gameId);
  const game = getOrCreateGame(gameId);

  if (!game.players.find(p => p.id === playerId)) {
    const newPlayer: Player = {
      id: playerId,
      name: playerName,
      score: 0,
      isReady: false
    };
    game.players.push(newPlayer);
  }

  io.to(gameId).emit('gameState', game);
};

const handlePlayerReady = (game: any, playerId: string) => {
  const player = game.players.find((p: any) => p.id === playerId);
  if (player) {
    player.isReady = true;
  }
};

const handleSelectUrinal = (game: any, playerId: string, index: number, io: any, gameId: string) => {
  const urinal = game.urinals[index];
  if (!urinal || urinal.isOccupied) return;

  const player = game.players.find((p: any) => p.id === playerId);
  if (!player) return;

  if (isOptimalPosition(game.urinals, index)) {
    urinal.isOccupied = true;
    urinal.occupiedBy = playerId;
    player.score += 100;
    game.message = `${player.name} escolheu a posição correta!`;
    
    setTimeout(() => {
      game.day += 1;
      game.urinals = generateUrinals(game.day);
      game.message = '';
      io.to(gameId).emit('gameState', game);
    }, 2000);
  } else {
    player.score -= 50;
    game.message = `${player.name} escolheu uma posição inadequada!`;
  }
};

const handleWait = (game: any, playerId: string, io: any, gameId: string) => {
  const player = game.players.find((p: any) => p.id === playerId);
  if (!player) return;

  if (shouldWait(game.urinals.map((u: any) => u.isOccupied))) {
    game.message = `${player.name} decidiu esperar sabiamente!`;
    
    setTimeout(() => {
      game.day += 1;
      game.urinals = generateUrinals(game.day);
      game.message = '';
      io.to(gameId).emit('gameState', game);
    }, 2000);
  } else {
    player.score -= 25;
    game.message = `${player.name} esperou sem necessidade!`;
  }
};

export const handleGameAction = (
  io: any,
  gameId: string,
  action: GameAction
) => {
  const game = getOrCreateGame(gameId);
  if (!game) return;

  switch (action.type) {
    case 'PLAYER_READY':
      handlePlayerReady(game, action.playerId);
      break;
    case 'SELECT_URINAL':
      handleSelectUrinal(game, action.playerId, action.payload.index, io, gameId);
      break;
    case 'WAIT':
      handleWait(game, action.playerId, io, gameId);
      break;
  }

  io.to(gameId).emit('gameState', game);
};

export const handleDisconnection = (
  io: any,
  gameId: string,
  playerId: string
) => {
  const game = getOrCreateGame(gameId);
  if (game) {
    game.players = game.players.filter(p => p.id !== playerId);
    if (game.players.length === 0) {
      removeGame(gameId);
    } else {
      io.to(gameId).emit('gameState', game);
    }
  }
};