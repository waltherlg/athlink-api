import { useEffect, useRef, useState } from 'react';
import { API_BASE_URL } from '../../api/http';

export type BackendStatus = 'checking' | 'awake' | 'waking' | 'error';

const CHECK_INTERVAL_MS = 5000;
const TIMEOUT_MS = 5000;
const SLOW_THRESHOLD_MS = 3000;
const ERROR_AFTER_FAILURES = 3;

export function useBackendStatus() {
  const [status, setStatus] = useState<BackendStatus>('checking');
  const intervalRef = useRef<number | null>(null);
  const isCheckingRef = useRef(false);
  const consecutiveFailuresRef = useRef(0);

  const checkBackend = async () => {
    if (isCheckingRef.current) return;
    isCheckingRef.current = true;

    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), TIMEOUT_MS);
    const start = Date.now();

    try {
      const response = await fetch(API_BASE_URL, {
        signal: controller.signal,
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error(`Backend responded with ${response.status}`);
      }

      consecutiveFailuresRef.current = 0;
      const duration = Date.now() - start;
      setStatus(duration > SLOW_THRESHOLD_MS ? 'waking' : 'awake');
    } catch {
      consecutiveFailuresRef.current += 1;
      setStatus(
        consecutiveFailuresRef.current >= ERROR_AFTER_FAILURES ? 'error' : 'waking',
      );
    } finally {
      window.clearTimeout(timeoutId);
      isCheckingRef.current = false;
    }
  };

  useEffect(() => {
    checkBackend();

    intervalRef.current = window.setInterval(() => {
      checkBackend();
    }, CHECK_INTERVAL_MS);

    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return status;
}

