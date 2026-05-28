// Sound utility for managing game audio
export const playSound = (soundName: "match" | "mismatch" | "flip") => {
  // For production, you'd use actual audio files
  // Since we're using Web Audio API for browser-generated sounds
  const audioContext = new (
    window.AudioContext || (window as any).webkitAudioContext
  )();

  const playTone = (
    frequency: number,
    duration: number,
    type: OscillatorType = "sine",
  ) => {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.type = type;
    oscillator.frequency.value = frequency;

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.00001,
      audioContext.currentTime + duration,
    );

    oscillator.start();
    oscillator.stop(audioContext.currentTime + duration);
  };

  switch (soundName) {
    case "match":
      // Success sound - two rising tones
      playTone(523.25, 0.2); // C5
      setTimeout(() => playTone(659.25, 0.3), 150); // E5
      break;
    case "mismatch":
      // Error sound - descending buzz
      playTone(440, 0.15, "sawtooth"); // A4
      setTimeout(() => playTone(349.23, 0.2), 100); // F4
      break;
    case "flip":
      // Card flip sound - short click/pop
      playTone(800, 0.05, "sine");
      break;
  }
};

// Alternative: If you want to use actual sound files
// Create a sounds folder in public/ and add these files:
// - public/sounds/flip.mp3
// - public/sounds/match.mp3
// - public/sounds/mismatch.mp3
// - public/sounds/background.mp3

export const playSoundFile = async (soundFile: string) => {
  const audio = new Audio(soundFile);
  await audio.play();
};
