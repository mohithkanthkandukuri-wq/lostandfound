import confetti from 'canvas-confetti';

export const triggerSuccessConfetti = () => {
  try {
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#4f46e5', '#10b981', '#f59e0b', '#ec4899', '#6366f1']
    });
  } catch (err) {
    // Graceful fallback if canvas is restricted
  }
};

export const triggerCelebrationFireworks = () => {
  try {
    const duration = 2.5 * 1000;
    const end = Date.now() + duration;

    const interval = setInterval(function() {
      if (Date.now() > end) {
        return clearInterval(interval);
      }
      confetti({
        startVelocity: 30,
        spread: 360,
        ticks: 60,
        origin: { x: Math.random(), y: Math.random() - 0.2 },
        colors: ['#6366f1', '#4338ca', '#10b981', '#38bdf8', '#f59e0b']
      });
    }, 300);
  } catch (err) {
    // Graceful fallback
  }
};
