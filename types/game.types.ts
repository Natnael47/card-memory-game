export type Difficulty = "easy" | "medium" | "hard";

export interface Card {
  id: number;
  imageId: number;
  isFlipped: boolean;
  isMatched: boolean;
}

export interface GameStats {
  wins: number;
  losses: number;
  bestTimes: {
    easy: number | null;
    medium: number | null;
    hard: number | null;
  };
}

export interface GameState {
  cards: Card[];
  moves: number;
  isGameActive: boolean;
  isGameComplete: boolean;
  matchedPairs: number;
  difficulty: Difficulty;
  timeRemaining: number | null;
}

export interface DifficultyConfig {
  gridSize: number;
  totalCards: number;
  timeLimit: number | null;
  pairCount: number;
}
