import { Card, Difficulty } from "@/types/game.types";
import { CARD_IMAGES, DIFFICULTY_CONFIGS } from "./constants";

export const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const generateCards = (difficulty: Difficulty): Card[] => {
  const config = DIFFICULTY_CONFIGS[difficulty];
  const pairCount = config.pairCount;

  const cards: Card[] = [];
  let id = 0;

  for (let i = 0; i < pairCount; i++) {
    const imageId = i % CARD_IMAGES.length;
    // Create two cards for each pair
    cards.push(
      { id: id++, imageId, isFlipped: false, isMatched: false },
      { id: id++, imageId, isFlipped: false, isMatched: false },
    );
  }

  return shuffleArray(cards);
};

export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

export const getGridColsClass = (gridSize: number): string => {
  switch (gridSize) {
    case 4:
      return "grid-cols-4";
    case 6:
      return "grid-cols-6";
    default:
      return "grid-cols-4";
  }
};
