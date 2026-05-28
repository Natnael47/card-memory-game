import { useCallback, useEffect, useRef, useState } from "react";

export const useTimer = (
  isActive: boolean,
  timeLimit: number | null,
  onTimeUp: () => void,
) => {
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(timeLimit);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (
      isActive &&
      (timeLimit === null || (timeRemaining !== null && timeRemaining > 0))
    ) {
      timerRef.current = setInterval(() => {
        setTimeElapsed((prev) => {
          const newTime = prev + 1;
          return newTime;
        });

        if (timeLimit !== null) {
          setTimeRemaining((prev) => {
            if (prev !== null && prev <= 1) {
              onTimeUp();
              return 0;
            }
            return prev !== null ? prev - 1 : null;
          });
        }
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, timeLimit, timeRemaining, onTimeUp]);

  const resetTimer = useCallback(() => {
    setTimeElapsed(0);
    setTimeRemaining(timeLimit);
    if (timerRef.current) clearInterval(timerRef.current);
  }, [timeLimit]);

  return { timeElapsed, timeRemaining, resetTimer };
};
