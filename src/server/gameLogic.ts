import { GameState, Urinal, Player } from '../types/game';

export const generateUrinals = (day: number): Urinal[] => {
  const numUrinals = Math.min(3 + Math.floor(day / 3), 8);
  const urinals = Array(numUrinals).fill(null).map((_, id) => ({
    id,
    isOccupied: false
  }));

  // Add random occupants
  const numOccupants = Math.min(1 + Math.floor(Math.random() * (day / 2)), numUrinals - 1);
  for (let i = 0; i < numOccupants; i++) {
    let index;
    do {
      index = Math.floor(Math.random() * numUrinals);
    } while (urinals[index].isOccupied);
    urinals[index].isOccupied = true;
  }

  return urinals;
};

export const isOptimalPosition = (urinals: Urinal[], selectedIndex: number): boolean => {
  return urinals.every((u, i) => {
    if (u.isOccupied) {
      return Math.abs(i - selectedIndex) > 1;
    }
    return true;
  });
};