import { Socket } from 'socket.io';
import { GameAction, Player } from '../types/game';
import { getOrCreateGame, removeGame } from './gameState';
import { generateUrinals, isOptimalPosition } from './gameLogic';

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

export const handleGameAction = (
  io: any,
  gameId: string,
  action: GameAction
) => {
  const game = getOrCreateGame(gameId);
  if (!game) return;

  switch (action.type) {
    case 'PLAYER_READY': {
      const player = game.players.find(p => p.id === action.playerId);
      if (player) {
        player.isReady = true;
      }
      break;
    }

    case 'SELECT_URINAL': {
      const { index } = action.payload;
      const urinal = game.urinals[index];
      
      if (!urinal || urinal.isOccupied) {
        return;
      }

      const player = game.players.find(p => p.id === action.playerId);
      if (!player) return;

      if (isOptimalPosition(game.urinals, index)) {
        urinal.isOccupied = true;
        urinal.occupiedBy = action.playerId;
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
      break;
    }
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