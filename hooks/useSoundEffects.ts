import { useCallback, useRef } from "react";

export const useSoundEffects = () => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const backgroundMusicRef = useRef<AudioBufferSourceNode | null>(null);
  const isMutedRef = useRef<boolean>(false);
  const backgroundMusicIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize Audio Context (needs user interaction first)
  const initAudio = useCallback(() => {
    if (isMutedRef.current) return null;

    if (!audioContextRef.current) {
      audioContextRef.current = new (
        window.AudioContext || (window as any).webkitAudioContext
      )();
    }
    if (audioContextRef.current.state === "suspended") {
      audioContextRef.current.resume();
    }
    return audioContextRef.current;
  }, []);

  // Mute/unmute all sounds
  const setMuted = useCallback(
    (muted: boolean) => {
      isMutedRef.current = muted;

      if (muted && audioContextRef.current) {
        // Close audio context when muting to save resources
        audioContextRef.current.close();
        audioContextRef.current = null;
      } else if (!muted && !audioContextRef.current) {
        // Re-initialize when unmuting
        initAudio();
      }
    },
    [initAudio],
  );

  // Play match success sound
  const playMatchSound = useCallback(() => {
    if (isMutedRef.current) return;

    const ctx = initAudio();
    if (!ctx) return;

    const now = ctx.currentTime;

    // Happy ascending arpeggio
    const frequencies = [523.25, 659.25, 783.99]; // C, E, G
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
  }, [initAudio]);

  // Play mismatch error sound
  const playMismatchSound = useCallback(() => {
    if (isMutedRef.current) return;

    const ctx = initAudio();
    if (!ctx) return;

    const now = ctx.currentTime;

    // Descending sad sound
    const frequencies = [440, 349.23, 293.66]; // A, F, D
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
  }, [initAudio]);

  // Play card flip sound
  const playFlipSound = useCallback(() => {
    if (isMutedRef.current) return;

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
  }, [initAudio]);

  // Play background music (ambient)
  const playBackgroundMusic = useCallback(() => {
    // Clear existing interval
    if (backgroundMusicIntervalRef.current) {
      clearInterval(backgroundMusicIntervalRef.current);
      backgroundMusicIntervalRef.current = null;
    }

    if (isMutedRef.current) return;

    const ctx = initAudio();
    if (!ctx) return;

    // Create ambient pad sound
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

    // Simple ambient loop - plays once and schedules next
    const startTime = ctx.currentTime;
    playNote(261.63, startTime, 4); // C
    playNote(329.63, startTime + 2, 4); // E
    playNote(392.0, startTime + 4, 4); // G
    playNote(523.25, startTime + 6, 4); // C

    // Schedule next loop if not muted
    backgroundMusicIntervalRef.current = setTimeout(() => {
      if (!isMutedRef.current) {
        playBackgroundMusic();
      }
    }, 10000) as unknown as NodeJS.Timeout;
  }, [initAudio]);

  // Stop background music
  const stopBackgroundMusic = useCallback(() => {
    if (backgroundMusicIntervalRef.current) {
      clearTimeout(backgroundMusicIntervalRef.current);
      backgroundMusicIntervalRef.current = null;
    }
    if (backgroundMusicRef.current) {
      try {
        backgroundMusicRef.current.stop();
      } catch (e) {
        // Ignore errors if already stopped
      }
      backgroundMusicRef.current = null;
    }
  }, []);

  // Get mute state
  const getIsMuted = useCallback(() => isMutedRef.current, []);

  return {
    playMatchSound,
    playMismatchSound,
    playFlipSound,
    playBackgroundMusic,
    stopBackgroundMusic,
    initAudio,
    setMuted,
    getIsMuted,
  };
};
