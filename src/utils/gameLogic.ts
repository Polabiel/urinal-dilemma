export const hasValidPosition = (urinals: boolean[]): boolean => {
  const n = urinals.length;
  for (let i = 0; i < n; i++) {
    if (!urinals[i] && // posição vazia
        (i === 0 || !urinals[i-1]) && // ninguém à esquerda
        (i === n-1 || !urinals[i+1])) { // ninguém à direita
      return true;
    }
  }
  return false;
}

// Verifica se vale a pena esperar
export const shouldWait = (urinals: boolean[]): boolean => {
  // Se não houver posição válida, deve esperar
  if (!hasValidPosition(urinals)) {
    return true;
  }

  // Caso específico: 3 posições com pessoa no meio
  if (urinals.length === 3 && urinals[1]) {
    return true;
  }

  return false;
}

export const checkUrinalChoice = (urinals: boolean[], selectedIndex: number): boolean => {
  const n = urinals.length;
  
  if (urinals[selectedIndex]) return false;
  
  // Verifica adjacentes
  if ((selectedIndex > 0 && urinals[selectedIndex - 1]) || 
      (selectedIndex < n - 1 && urinals[selectedIndex + 1])) {
    return false;
  }

  // Se deve esperar, qualquer escolha é inválida
  if (shouldWait(urinals)) {
    return false;
  }

  return true;
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

