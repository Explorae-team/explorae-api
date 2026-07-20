import { useState, useEffect, useRef } from 'react';

export function useCountdown(expiresAt: string | null, onExpire?: () => void) {
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [expired, setExpired] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const calculateTimeLeft = (expirationStr: string) => {
    const expirationDate = new Date(expirationStr);
    const now = new Date();
    return Math.max(0, Math.floor((expirationDate.getTime() - now.getTime()) / 1000));
  };

  useEffect(() => {
    if (!expiresAt) {
      setTimeLeft(null);
      setExpired(false);
      return;
    }

    const initialTime = calculateTimeLeft(expiresAt);
    setTimeLeft(initialTime);
    setExpired(initialTime <= 0);

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === null || prev <= 1) {
          if (timerRef.current) {
            clearInterval(timerRef.current);
          }
          setExpired(true);
          if (onExpire) {
            onExpire();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [expiresAt]);

  const formattedTime = (() => {
    if (timeLeft === null) return '00:00';
    const mins = Math.floor(timeLeft / 60);
    const secs = timeLeft % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  })();

  const isTimeLow = timeLeft !== null && timeLeft < 60;

  return {
    timeLeft,
    formattedTime,
    isTimeLow,
    expired,
  };
}
