"use client";

import { Card as CardType } from "@/types/game.types";
import { CARD_IMAGES } from "@/utils/constants";
import gsap from "gsap";
import { useEffect, useRef } from "react";

interface CardProps {
  card: CardType;
  onClick: () => void;
  disabled: boolean;
}

export default function Card({ card, onClick, disabled }: CardProps) {
  const cardRef = useRef<HTMLButtonElement>(null);
  const isFlipped = card.isFlipped || card.isMatched;
  const imageIndex = card.imageId % CARD_IMAGES.length;

  // Flip animation when card state changes
  useEffect(() => {
    if (cardRef.current) {
      if (isFlipped || card.isMatched) {
        // Flip to front
        gsap.to(cardRef.current, {
          duration: 0.3,
          rotationY: 180,
          ease: "back.out(0.7)",
        });
      } else {
        // Flip to back
        gsap.to(cardRef.current, {
          duration: 0.3,
          rotationY: 0,
          ease: "back.in(0.7)",
        });
      }
    }
  }, [isFlipped, card.isMatched]);

  // Bounce animation when card is matched
  useEffect(() => {
    if (card.isMatched && cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        { scale: 1 },
        {
          scale: 1.15,
          duration: 0.2,
          yoyo: true,
          repeat: 1,
          ease: "power2.out",
        },
      );
    }
  }, [card.isMatched]);

  // Hover animation
  const handleMouseEnter = () => {
    if (!disabled && !isFlipped && !card.isMatched && cardRef.current) {
      gsap.to(cardRef.current, {
        duration: 0.2,
        scale: 1.05,
        ease: "power2.out",
      });
    }
  };

  const handleMouseLeave = () => {
    if (!disabled && !isFlipped && !card.isMatched && cardRef.current) {
      gsap.to(cardRef.current, {
        duration: 0.2,
        scale: 1,
        ease: "power2.out",
      });
    }
  };

  return (
    <button
      ref={cardRef}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      disabled={disabled || isFlipped || card.isMatched}
      className={`
        aspect-square w-20 h-20 md:w-24 md:h-24 rounded-lg shadow-lg
        transition-all duration-200 transform preserve-3d
        focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2
        ${
          card.isMatched
            ? "bg-green-500 cursor-default opacity-60 cursor-not-allowed"
            : isFlipped
              ? "bg-gradient-to-br from-white to-gray-100"
              : "bg-gradient-to-br from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600"
        }
      `}
      style={{
        transformStyle: "preserve-3d",
        backfaceVisibility: "hidden",
      }}
    >
      <div className="flex items-center justify-center w-full h-full text-4xl backface-hidden">
        {(isFlipped || card.isMatched) && CARD_IMAGES[imageIndex]}
      </div>
    </button>
  );
}
