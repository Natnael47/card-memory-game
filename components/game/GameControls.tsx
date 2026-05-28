"use client";

import { Difficulty } from "@/types/game.types";
import { Clock, RotateCcw, Target, Trophy, Zap } from "lucide-react";

interface GameControlsProps {
  difficulty: Difficulty;
  onDifficultyChange: (difficulty: Difficulty) => void;
  onNewGame: () => void;
  moves: number;
}

export default function GameControls({
  difficulty,
  onDifficultyChange,
  onNewGame,
  moves,
}: GameControlsProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 mb-6 p-4 bg-white/10 backdrop-blur-sm rounded-lg shadow-lg">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-2 bg-white/20 rounded-lg">
          <Trophy className="w-5 h-5 text-yellow-400" />
          <span className="text-white font-bold text-lg">{moves}</span>
          <span className="text-white/70 text-sm">moves</span>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => onDifficultyChange("easy")}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-lg font-semibold
            transition-all duration-200 cursor-pointer
            ${
              difficulty === "easy"
                ? "bg-green-500 text-white shadow-lg scale-105 hover:bg-green-600"
                : "bg-white/20 text-white hover:bg-white/30 border border-white/30"
            }
          `}
        >
          <Zap className="w-4 h-4" />
          Easy
        </button>

        <button
          onClick={() => onDifficultyChange("medium")}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-lg font-semibold
            transition-all duration-200 cursor-pointer
            ${
              difficulty === "medium"
                ? "bg-yellow-500 text-white shadow-lg scale-105 hover:bg-yellow-600"
                : "bg-white/20 text-white hover:bg-white/30 border border-white/30"
            }
          `}
        >
          <Target className="w-4 h-4" />
          Medium
        </button>

        <button
          onClick={() => onDifficultyChange("hard")}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-lg font-semibold
            transition-all duration-200 cursor-pointer
            ${
              difficulty === "hard"
                ? "bg-red-500 text-white shadow-lg scale-105 hover:bg-red-600"
                : "bg-white/20 text-white hover:bg-white/30 border border-white/30"
            }
          `}
        >
          <Clock className="w-4 h-4" />
          Hard
        </button>
      </div>

      <button
        onClick={onNewGame}
        className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold
          bg-white/20 text-white hover:bg-white/30 border border-white/30
          transition-all duration-200 cursor-pointer"
      >
        <RotateCcw className="w-4 h-4" />
        New Game
      </button>
    </div>
  );
}
