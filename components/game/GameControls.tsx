"use client";

import { Button } from "@/components/ui/button";
import { Difficulty } from "@/types/game.types";
import { RotateCcw, Trophy } from "lucide-react";

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
    <div className="flex flex-wrap items-center justify-between gap-4 mb-6 p-4 bg-white/10 backdrop-blur-sm rounded-lg">
      <div className="flex items-center gap-2">
        <Trophy className="w-5 h-5 text-yellow-400" />
        <span className="text-white font-semibold">Moves: {moves}</span>
      </div>

      <div className="flex gap-2">
        <Button
          variant={difficulty === "easy" ? "default" : "outline"}
          onClick={() => onDifficultyChange("easy")}
          className={
            difficulty === "easy"
              ? "bg-green-500 hover:bg-green-600"
              : "text-white"
          }
          size="sm"
        >
          Easy
        </Button>
        <Button
          variant={difficulty === "medium" ? "default" : "outline"}
          onClick={() => onDifficultyChange("medium")}
          className={
            difficulty === "medium"
              ? "bg-yellow-500 hover:bg-yellow-600"
              : "text-white"
          }
          size="sm"
        >
          Medium
        </Button>
        <Button
          variant={difficulty === "hard" ? "default" : "outline"}
          onClick={() => onDifficultyChange("hard")}
          className={
            difficulty === "hard" ? "bg-red-500 hover:bg-red-600" : "text-white"
          }
          size="sm"
        >
          Hard
        </Button>
      </div>

      <Button onClick={onNewGame} variant="secondary" size="sm">
        <RotateCcw className="w-4 h-4 mr-2" />
        New Game
      </Button>
    </div>
  );
}
