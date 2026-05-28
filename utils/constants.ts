import { DifficultyConfig } from "@/types/game.types";

export const DIFFICULTY_CONFIGS: Record<string, DifficultyConfig> = {
  easy: {
    gridSize: 4,
    totalCards: 16,
    timeLimit: null,
    pairCount: 8,
  },
  medium: {
    gridSize: 4,
    totalCards: 16,
    timeLimit: 60,
    pairCount: 8,
  },
  hard: {
    gridSize: 6,
    totalCards: 36,
    timeLimit: 90,
    pairCount: 18,
  },
};

export const CARD_IMAGES = [
  "🐶",
  "🐱",
  "🐭",
  "🐹",
  "🐰",
  "🦊",
  "🐻",
  "🐼",
  "🐨",
  "🐯",
  "🦁",
  "🐮",
  "🐷",
  "🐸",
  "🐵",
  "🐔",
  "🦄",
  "🐙",
  "🦋",
  "🐠",
  "🌵",
  "⭐",
  "🔥",
  "💎",
];

export const CARD_BACK_COLOR = "bg-gray-700";
export const MATCHED_CARD_COLOR = "bg-green-500";
export const DEFAULT_CARD_COLOR = "bg-blue-500";
