import { useEffect, useState } from 'react';

export const usePrivacyMode = (timeoutMs = 60000) => {
  const [isIdle, setIsIdle] = useState(false);
  const [privacyEnabled, setPrivacyEnabled] = useState(false);

  useEffect(() => {
    let timeoutId: number;

    const resetTimer = () => {
      setIsIdle(false);
      clearTimeout(timeoutId);
      if (privacyEnabled) {
        timeoutId = window.setTimeout(() => setIsIdle(true), timeoutMs);
      }
    };

    if (privacyEnabled) {
      window.addEventListener('mousemove', resetTimer);
      window.addEventListener('keydown', resetTimer);
      window.addEventListener('touchstart', resetTimer);
      
      timeoutId = window.setTimeout(() => setIsIdle(true), timeoutMs);
    }

    return () => {
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keydown', resetTimer);
      window.removeEventListener('touchstart', resetTimer);
      clearTimeout(timeoutId);
    };
  }, [privacyEnabled, timeoutMs]);

  return { isIdle, privacyEnabled, setPrivacyEnabled, setIsIdle };
};
