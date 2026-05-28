"use client";

import { Button } from "@/components/ui/button";
import { Difficulty, GameStats } from "@/types/game.types";
import { formatTime } from "@/utils/gameUtils";
import { Award, Clock, Repeat, Target, Trophy, X } from "lucide-react";
import { useEffect } from "react";

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  timeElapsed: number;
  moves: number;
  stats: GameStats;
  difficulty: Difficulty;
  onPlayAgain: () => void;
  isWin: boolean;
}

export default function StatsModal({
  isOpen,
  onClose,
  timeElapsed,
  moves,
  stats,
  difficulty,
  onPlayAgain,
  isWin,
}: StatsModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const bestTime = stats.bestTimes[difficulty];
  const isNewRecord = bestTime && timeElapsed === bestTime && isWin;

  const getDifficultyColor = () => {
    switch (difficulty) {
      case "easy":
        return "text-green-400";
      case "medium":
        return "text-yellow-400";
      case "hard":
        return "text-red-400";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative max-w-md w-full bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl animate-in zoom-in-95 duration-300">
        {/* Close button */}
        <Button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </Button>

        {/* Header */}
        <div className="text-center p-6 border-b border-gray-700">
          {isWin ? (
            <>
              <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-500/20 rounded-full mb-4">
                <Trophy className="w-8 h-8 text-yellow-400" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">
                Congratulations! 🎉
              </h2>
              <p className="text-gray-300">You completed the game!</p>
            </>
          ) : (
            <>
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-500/20 rounded-full mb-4">
                <Clock className="w-8 h-8 text-red-400" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">
                Time's Up! ⏰
              </h2>
              <p className="text-gray-300">Better luck next time!</p>
            </>
          )}
        </div>

        {/* Stats */}
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-white/5 rounded-lg">
              <Clock className="w-5 h-5 text-blue-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">
                {formatTime(timeElapsed)}
              </div>
              <div className="text-xs text-gray-400">Time</div>
            </div>

            <div className="text-center p-3 bg-white/5 rounded-lg">
              <Repeat className="w-5 h-5 text-green-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{moves}</div>
              <div className="text-xs text-gray-400">Moves</div>
            </div>
          </div>

          {/* Personal Best */}
          {bestTime && (
            <div className="text-center p-3 bg-white/5 rounded-lg">
              <Award
                className={`w-5 h-5 ${getDifficultyColor()} mx-auto mb-2`}
              />
              <div className="text-sm text-gray-300">
                Personal Best ({difficulty})
              </div>
              <div className="text-xl font-bold text-white">
                {formatTime(bestTime)}
              </div>
              {isNewRecord && (
                <div className="text-xs text-yellow-400 mt-1 animate-pulse">
                  🎯 New Record! 🎯
                </div>
              )}
            </div>
          )}

          {/* Overall Stats */}
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">
                {stats.wins}
              </div>
              <div className="text-xs text-gray-400">Total Wins</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-400">
                {stats.losses}
              </div>
              <div className="text-xs text-gray-400">Total Losses</div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 p-6 border-t border-gray-700">
          <Button
            onClick={onPlayAgain}
            className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white"
          >
            <Target className="w-4 h-4 mr-2" />
            Play Again
          </Button>
          <Button
            onClick={onClose}
            variant="outline"
            className="flex-1 border-gray-600 text-gray-300 hover:bg-white/10"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
