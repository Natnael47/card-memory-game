"use client";

import { formatTime } from "@/utils/gameUtils";
import { Clock } from "lucide-react";

interface TimerProps {
  timeElapsed: number;
  timeRemaining: number | null;
  hasTimeLimit: boolean;
}

export default function Timer({
  timeElapsed,
  timeRemaining,
  hasTimeLimit,
}: TimerProps) {
  const displayTime =
    hasTimeLimit && timeRemaining !== null ? timeRemaining : timeElapsed;
  const isLowTime =
    hasTimeLimit && timeRemaining !== null && timeRemaining <= 10;

  return (
    <div className="flex items-center justify-center gap-2 mb-6">
      <Clock className="w-5 h-5 text-white" />
      <div
        className={`
        text-2xl font-mono font-bold
        ${isLowTime ? "text-red-500 animate-pulse" : "text-white"}
      `}
      >
        {formatTime(displayTime)}
      </div>
      {hasTimeLimit && <span className="text-sm text-white/70">remaining</span>}
    </div>
  );
}
