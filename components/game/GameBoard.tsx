"use client";

import { useGameLogic } from "@/hooks/useGameLogic";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useTimer } from "@/hooks/useTimer";
import { Difficulty, GameStats } from "@/types/game.types";
import { DIFFICULTY_CONFIGS } from "@/utils/constants";
import { getGridColsClass } from "@/utils/gameUtils";
import confetti from "canvas-confetti";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import Card from "./Card";
import GameControls from "./GameControls";
import StatsModal from "./StatsModal";
import Timer from "./Timer";

export default function GameBoard() {
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [showStats, setShowStats] = useState(false);
  const [gameCompleteTime, setGameCompleteTime] = useState<number | null>(null);
  const [stats, setStats] = useLocalStorage<GameStats>("memoryGameStats", {
    wins: 0,
    losses: 0,
    bestTimes: { easy: null, medium: null, hard: null },
  });

  const handleGameComplete = (completionTime: number) => {
    setGameCompleteTime(completionTime);
    setShowStats(true);

    setStats((prev) => ({
      wins: prev.wins + 1,
      losses: prev.losses,
      bestTimes: {
        ...prev.bestTimes,
        [difficulty]: prev.bestTimes[difficulty]
          ? Math.min(prev.bestTimes[difficulty]!, completionTime)
          : completionTime,
      },
    }));

    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      startVelocity: 15,
      colors: ["#ff0000", "#00ff00", "#0000ff", "#ffff00", "#ff00ff"],
    });
  };

  const handleTimeUp = () => {
    setStats((prev) => ({ ...prev, losses: prev.losses + 1 }));
    setShowStats(true);
    setGameCompleteTime(null);
  };

  const { cards, moves, isGameActive, initializeGame, handleCardClick } =
    useGameLogic(difficulty, handleGameComplete);

  const { timeElapsed, timeRemaining, resetTimer } = useTimer(
    isGameActive,
    DIFFICULTY_CONFIGS[difficulty].timeLimit,
    handleTimeUp,
  );

  const startNewGame = () => {
    initializeGame();
    resetTimer();
    setShowStats(false);
    setGameCompleteTime(null);
  };

  useEffect(() => {
    startNewGame();
  }, [difficulty]);

  const config = DIFFICULTY_CONFIGS[difficulty];
  const gridClass = `grid gap-2 justify-center p-4 ${getGridColsClass(config.gridSize)}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-purple-800">
      <div className="container mx-auto p-4">
        <GameControls
          difficulty={difficulty}
          onDifficultyChange={(d) => setDifficulty(d)}
          onNewGame={startNewGame}
          moves={moves}
        />

        <Timer
          timeElapsed={timeElapsed}
          timeRemaining={timeRemaining}
          hasTimeLimit={config.timeLimit !== null}
        />

        <motion.div
          className="flex justify-center items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className={gridClass}>
            <AnimatePresence mode="wait">
              {cards.map((card, index) => (
                <Card
                  key={card.id}
                  card={card}
                  onClick={() => handleCardClick(index)}
                  disabled={!isGameActive || showStats}
                />
              ))}
            </AnimatePresence>
          </div>
        </motion.div>

        <StatsModal
          isOpen={showStats}
          onClose={() => setShowStats(false)}
          timeElapsed={gameCompleteTime || timeElapsed}
          moves={moves}
          stats={stats}
          difficulty={difficulty}
          onPlayAgain={startNewGame}
          isWin={gameCompleteTime !== null}
        />
      </div>
    </div>
  );
}
