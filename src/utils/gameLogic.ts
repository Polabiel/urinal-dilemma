export const checkUrinalChoice = (urinals: boolean[], selectedIndex: number): boolean => {
  // Regra básica: deve estar o mais distante possível de outras pessoas
  const n = urinals.length;
  
  // Verifica se o mictório selecionado já está ocupado
  if (urinals[selectedIndex]) {
    return false;
  }
  
  // Verifica se há alguém ao lado
  if (selectedIndex > 0 && urinals[selectedIndex - 1]) {
    return false;
  }
  if (selectedIndex < n - 1 && urinals[selectedIndex + 1]) {
    return false;
  }
  
  // Verifica se existe uma posição melhor (mais distante)
  let maxDistance = 0;
  let bestPosition = -1;
  
  for (let i = 0; i < n; i++) {
    if (urinals[i]) continue;
    
    let minDistance = Number.MAX_VALUE;
    for (let j = 0; j < n; j++) {
      if (urinals[j]) {
        minDistance = Math.min(minDistance, Math.abs(i - j));
      }
    }
    
    if (minDistance > maxDistance) {
      maxDistance = minDistance;
      bestPosition = i;
    }
  }
  
  return selectedIndex === bestPosition;
}

export const generateNewDay = (currentDay: number): boolean[] => {
  const numUrinals = Math.min(3 + Math.floor(currentDay / 3), 8);
  const urinals = new Array(numUrinals).fill(false);
  
  // Adiciona pessoas aleatoriamente (pelo menos 1)
  const numPeople = Math.min(1 + Math.floor(Math.random() * (currentDay / 2)), numUrinals - 1);
  
  for (let i = 0; i < numPeople; i++) {
    let position;
    do {
      position = Math.floor(Math.random() * numUrinals);
    } while (urinals[position]);
    urinals[position] = true;
  }
  
  return urinals;
}