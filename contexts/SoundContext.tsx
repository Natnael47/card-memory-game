"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

interface SoundContextType {
  isMuted: boolean;
  toggleMute: () => void;
  playMatchSound: () => void;
  playMismatchSound: () => void;
  playFlipSound: () => void;
  playBackgroundMusic: () => void;
  stopBackgroundMusic: () => void;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export const useSound = () => {
  const context = useContext(SoundContext);
  if (!context) {
    throw new Error("useSound must be used within SoundProvider");
  }
  return context;
};

export const SoundProvider = ({ children }: { children: React.ReactNode }) => {
  const [isMuted, setIsMuted] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const backgroundMusicIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const hasUserInteractedRef = useRef(false);

  // Load mute state from localStorage on mount
  useEffect(() => {
    const savedMuteState = localStorage.getItem("sound_muted");
    if (savedMuteState !== null) {
      setIsMuted(savedMuteState === "true");
    }
  }, []);

  // Save mute state to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("sound_muted", isMuted.toString());
  }, [isMuted]);

  // Initialize Audio Context
  const initAudio = useCallback(() => {
    if (isMuted) return null;

    if (!audioContextRef.current) {
      audioContextRef.current = new (
        window.AudioContext || (window as any).webkitAudioContext
      )();
    }
    if (
      audioContextRef.current.state === "suspended" &&
      hasUserInteractedRef.current
    ) {
      audioContextRef.current.resume();
    }
    return audioContextRef.current;
  }, [isMuted]);

  // Play match success sound
  const playMatchSound = useCallback(() => {
    if (isMuted) return;

    const ctx = initAudio();
    if (!ctx) return;

    const now = ctx.currentTime;
    const frequencies = [523.25, 659.25, 783.99];

    frequencies.forEach((freq, i) => {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.type = "sine";
      oscillator.frequency.value = freq;

      gainNode.gain.setValueAtTime(0.3, now + i * 0.1);
      gainNode.gain.exponentialRampToValueAtTime(0.00001, now + i * 0.1 + 0.3);

      oscillator.start(now + i * 0.1);
      oscillator.stop(now + i * 0.1 + 0.3);
    });
  }, [isMuted, initAudio]);

  // Play mismatch error sound
  const playMismatchSound = useCallback(() => {
    if (isMuted) return;

    const ctx = initAudio();
    if (!ctx) return;

    const now = ctx.currentTime;
    const frequencies = [440, 349.23, 293.66];

    frequencies.forEach((freq, i) => {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.type = "sawtooth";
      oscillator.frequency.value = freq;

      gainNode.gain.setValueAtTime(0.2, now + i * 0.1);
      gainNode.gain.exponentialRampToValueAtTime(0.00001, now + i * 0.1 + 0.2);

      oscillator.start(now + i * 0.1);
      oscillator.stop(now + i * 0.1 + 0.2);
    });
  }, [isMuted, initAudio]);

  // Play card flip sound
  const playFlipSound = useCallback(() => {
    if (isMuted) return;

    const ctx = initAudio();
    if (!ctx) return;

    const now = ctx.currentTime;

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.type = "sine";
    oscillator.frequency.value = 800;
    oscillator.frequency.exponentialRampToValueAtTime(400, now + 0.1);

    gainNode.gain.setValueAtTime(0.15, now);
    gainNode.gain.exponentialRampToValueAtTime(0.00001, now + 0.1);

    oscillator.start(now);
    oscillator.stop(now + 0.1);
  }, [isMuted, initAudio]);

  // Play background music
  const playBackgroundMusic = useCallback(() => {
    if (backgroundMusicIntervalRef.current) {
      clearTimeout(backgroundMusicIntervalRef.current);
      backgroundMusicIntervalRef.current = null;
    }

    if (isMuted) return;

    const ctx = initAudio();
    if (!ctx) return;

    const playNote = (freq: number, startTime: number, duration: number) => {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.type = "sine";
      oscillator.frequency.value = freq;

      gainNode.gain.setValueAtTime(0.05, startTime);
      gainNode.gain.exponentialRampToValueAtTime(0.00001, startTime + duration);

      oscillator.start(startTime);
      oscillator.stop(startTime + duration);
    };

    const startTime = ctx.currentTime;
    playNote(261.63, startTime, 4);
    playNote(329.63, startTime + 2, 4);
    playNote(392.0, startTime + 4, 4);
    playNote(523.25, startTime + 6, 4);

    backgroundMusicIntervalRef.current = setTimeout(() => {
      if (!isMuted) {
        playBackgroundMusic();
      }
    }, 10000) as unknown as NodeJS.Timeout;
  }, [isMuted, initAudio]);

  // Stop background music
  const stopBackgroundMusic = useCallback(() => {
    if (backgroundMusicIntervalRef.current) {
      clearTimeout(backgroundMusicIntervalRef.current);
      backgroundMusicIntervalRef.current = null;
    }
  }, []);

  // Toggle mute
  const toggleMute = useCallback(() => {
    setIsMuted((prev) => !prev);
    if (!isMuted) {
      // If muting, stop all sounds
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
      stopBackgroundMusic();
    } else {
      // If unmuting, restart background music
      if (hasUserInteractedRef.current) {
        playBackgroundMusic();
      }
    }
  }, [isMuted, stopBackgroundMusic, playBackgroundMusic]);

  // Handle user interaction
  useEffect(() => {
    const handleUserInteraction = () => {
      if (!hasUserInteractedRef.current) {
        hasUserInteractedRef.current = true;
        if (!isMuted) {
          initAudio();
          playBackgroundMusic();
        }
      }
    };

    document.addEventListener("click", handleUserInteraction);
    return () => {
      document.removeEventListener("click", handleUserInteraction);
      stopBackgroundMusic();
    };
  }, [isMuted, initAudio, playBackgroundMusic, stopBackgroundMusic]);

  const value = {
    isMuted,
    toggleMute,
    playMatchSound,
    playMismatchSound,
    playFlipSound,
    playBackgroundMusic,
    stopBackgroundMusic,
  };

  return (
    <SoundContext.Provider value={value}>{children}</SoundContext.Provider>
  );
};
