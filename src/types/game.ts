export interface Player {
  id: string;
  name: string;
  score: number;
  isReady: boolean;
}

export interface Urinal {
  id: number;
  isOccupied: boolean;
  occupiedBy?: string; // player ID
}

export interface GameState {
  id: string;
  day: number;
  score: number;
  urinals: Urinal[];
  players: Player[];
  wrongAttempts: {
    [playerId: string]: Set<number>;
  }
  gameOver: boolean;
  message: string;
  waitingAvailable: boolean;
  waitingPlayers: string[]; // player IDs who are waiting
}

export interface GameAction {
  type: 'SELECT_URINAL' | 'WAIT' | 'PLAYER_READY' | 'NEXT_DAY';
  playerId: string;
  payload?: any;
}