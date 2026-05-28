"use client";

import { Card as CardType } from "@/types/game.types";
import { CARD_IMAGES } from "@/utils/constants";
import { motion } from "framer-motion";
import { HelpCircle } from "lucide-react";
import { useEffect, useState } from "react";

interface CardProps {
  card: CardType;
  onClick: () => void;
  disabled: boolean;
}

export default function Card({ card, onClick, disabled }: CardProps) {
  const [showGreenFlash, setShowGreenFlash] = useState(false);
  const isFlipped = card.isFlipped || card.isMatched;
  const imageIndex = card.imageId % CARD_IMAGES.length;

  // Trigger green flash animation when card is matched
  useEffect(() => {
    if (card.isMatched) {
      setShowGreenFlash(true);
      // Reset after flash animation
      const timer = setTimeout(() => {
        setShowGreenFlash(false);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [card.isMatched]);

  return (
    <motion.div
      className="relative aspect-square w-20 h-20 md:w-24 md:h-24 [perspective:1000px]"
      animate={
        card.isMatched ? { opacity: 0, scale: 0.6 } : { opacity: 1, scale: 1 }
      }
      transition={{
        duration: 0.4,
        delay: 0.4,
        ease: "easeInOut",
      }}
    >
      <motion.button
        onClick={onClick}
        disabled={disabled || card.isMatched}
        className="relative w-full h-full focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 rounded-lg cursor-pointer"
        animate={{
          rotateY: isFlipped ? 180 : 0,
        }}
        transition={{
          rotateY: { duration: 0.4, ease: "easeInOut" },
        }}
        style={{
          transformStyle: "preserve-3d",
          transform: "rotateY(0deg)",
        }}
      >
        {/* Front of card (shows emoji when flipped) */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center text-4xl rounded-lg shadow-lg bg-white"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            WebkitBackfaceVisibility: "hidden",
          }}
          animate={{
            backgroundColor: showGreenFlash ? "#22c55e" : "#ffffff",
          }}
          transition={{ duration: 0.2 }}
        >
          <motion.span
            animate={{
              scale: showGreenFlash ? [1, 1.2, 1] : 1,
            }}
            transition={{ duration: 0.3 }}
            className="block"
          >
            {CARD_IMAGES[imageIndex]}
          </motion.span>
        </motion.div>

        {/* Back of card (shows question mark when not flipped) */}
        <div
          className="absolute inset-0 flex items-center justify-center rounded-lg shadow-lg bg-gradient-to-br from-purple-600 to-blue-500"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(0deg)",
            WebkitBackfaceVisibility: "hidden",
          }}
        >
          <HelpCircle className="w-10 h-10 text-white" strokeWidth={1.5} />
        </div>
      </motion.button>
    </motion.div>
  );
}
