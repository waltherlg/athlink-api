import { useEffect, useState } from 'react';
import {
  type DashboardMode,
  getDashboardMode,
  subscribeDashboardMode,
} from './dashboard-mode';

export function useDashboardMode() {
  const [mode, setModeState] = useState<DashboardMode>(() => getDashboardMode());

  useEffect(() => {
    return subscribeDashboardMode(() => setModeState(getDashboardMode()));
  }, []);

  return mode;
}
