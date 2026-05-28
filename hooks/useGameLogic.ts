import { Card, Difficulty } from "@/types/game.types";
import { DIFFICULTY_CONFIGS } from "@/utils/constants";
import { generateCards } from "@/utils/gameUtils";
import { useCallback, useEffect, useState } from "react";

export const useGameLogic = (
  difficulty: Difficulty,
  onGameComplete?: (time: number) => void,
) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [moves, setMoves] = useState(0);
  const [isGameActive, setIsGameActive] = useState(false);
  const [selectedCardIndex, setSelectedCardIndex] = useState<number | null>(
    null,
  );
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [isChecking, setIsChecking] = useState(false);
  const [gameStartTime, setGameStartTime] = useState<number | null>(null);

  const totalPairs = DIFFICULTY_CONFIGS[difficulty].pairCount;

  const initializeGame = useCallback(() => {
    const newCards = generateCards(difficulty);
    setCards(newCards);
    setMoves(0);
    setMatchedPairs(0);
    setSelectedCardIndex(null);
    setIsChecking(false);
    setIsGameActive(true);
    setGameStartTime(Date.now());
  }, [difficulty]);

  const handleCardClick = useCallback(
    (index: number) => {
      if (!isGameActive || isChecking) return;
      if (cards[index].isMatched || cards[index].isFlipped) return;

      const newCards = [...cards];

      // First card selected
      if (selectedCardIndex === null) {
        newCards[index].isFlipped = true;
        setCards(newCards);
        setSelectedCardIndex(index);
      }
      // Second card selected
      else if (selectedCardIndex !== index) {
        setIsChecking(true);
        newCards[index].isFlipped = true;
        setCards(newCards);
        setMoves((prev) => prev + 1);

        // Check for match
        const firstCard = cards[selectedCardIndex];
        const secondCard = newCards[index];

        if (firstCard.imageId === secondCard.imageId) {
          // MATCH FOUND - Mark as matched after animation
          setTimeout(() => {
            const matchedCards = [...newCards];
            matchedCards[selectedCardIndex].isMatched = true;
            matchedCards[selectedCardIndex].isFlipped = false;
            matchedCards[index].isMatched = true;
            matchedCards[index].isFlipped = false;
            setCards(matchedCards);
            setMatchedPairs((prev) => prev + 1);
            setSelectedCardIndex(null);
            setIsChecking(false);
          }, 800); // Longer delay to show green flash animation
        } else {
          // NO MATCH - Flip both back after delay
          setTimeout(() => {
            const resetCards = [...newCards];
            resetCards[selectedCardIndex].isFlipped = false;
            resetCards[index].isFlipped = false;
            setCards(resetCards);
            setSelectedCardIndex(null);
            setIsChecking(false);
          }, 800);
        }
      }
    },
    [cards, isGameActive, isChecking, selectedCardIndex],
  );

  // Check for game completion
  useEffect(() => {
    if (
      matchedPairs === totalPairs &&
      totalPairs > 0 &&
      gameStartTime &&
      isGameActive
    ) {
      const completionTime = Math.floor((Date.now() - gameStartTime) / 1000);
      setIsGameActive(false);
      onGameComplete?.(completionTime);
    }
  }, [matchedPairs, totalPairs, gameStartTime, isGameActive, onGameComplete]);

  return {
    cards,
    moves,
    isGameActive,
    matchedPairs,
    totalPairs,
    initializeGame,
    handleCardClick,
  };
};
