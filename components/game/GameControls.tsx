"use client";

import { Button } from "@/components/ui/button";
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
        <Button
          variant={difficulty === "easy" ? "default" : "outline"}
          onClick={() => onDifficultyChange("easy")}
          className={`
            gap-2 transition-all duration-200
            ${
              difficulty === "easy"
                ? "bg-green-500 hover:bg-green-600 shadow-lg scale-105"
                : "text-white border-white/30 hover:bg-white/20"
            }
          `}
          size="default"
        >
          <Zap className="w-4 h-4" />
          Easy
        </Button>

        <Button
          variant={difficulty === "medium" ? "default" : "outline"}
          onClick={() => onDifficultyChange("medium")}
          className={`
            gap-2 transition-all duration-200
            ${
              difficulty === "medium"
                ? "bg-yellow-500 hover:bg-yellow-600 shadow-lg scale-105"
                : "text-white border-white/30 hover:bg-white/20"
            }
          `}
          size="default"
        >
          <Target className="w-4 h-4" />
          Medium
        </Button>

        <Button
          variant={difficulty === "hard" ? "default" : "outline"}
          onClick={() => onDifficultyChange("hard")}
          className={`
            gap-2 transition-all duration-200
            ${
              difficulty === "hard"
                ? "bg-red-500 hover:bg-red-600 shadow-lg scale-105"
                : "text-white border-white/30 hover:bg-white/20"
            }
          `}
          size="default"
        >
          <Clock className="w-4 h-4" />
          Hard
        </Button>
      </div>

      <Button
        onClick={onNewGame}
        variant="secondary"
        size="default"
        className="gap-2 bg-white/20 text-white hover:bg-white/30 border border-white/30"
      >
        <RotateCcw className="w-4 h-4" />
        New Game
      </Button>
    </div>
  );
}
