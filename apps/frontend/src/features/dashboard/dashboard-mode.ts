import type { CoachProfileView } from '@shared-types';

const STORAGE_KEY = 'athlink.dashboardMode';
const CHANGE_EVENT = 'dashboard-mode:change';

export type DashboardMode =
  | { type: 'athlete' }
  | { type: 'coach'; profile: CoachProfileView };

export const athleteMode: DashboardMode = { type: 'athlete' };

export function getDashboardMode(): DashboardMode {
  if (typeof window === 'undefined') return athleteMode;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return athleteMode;
  try {
    const parsed = JSON.parse(raw) as DashboardMode;
    if (parsed.type === 'coach' && parsed.profile?.id) return parsed;
  } catch {
    return athleteMode;
  }
  return athleteMode;
}

export function setDashboardMode(mode: DashboardMode) {
  if (typeof window === 'undefined') return;
  if (mode.type === 'athlete') {
    window.localStorage.removeItem(STORAGE_KEY);
  } else {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(mode));
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function subscribeDashboardMode(listener: () => void) {
  window.addEventListener(CHANGE_EVENT, listener);
  window.addEventListener('storage', listener);
  return () => {
    window.removeEventListener(CHANGE_EVENT, listener);
    window.removeEventListener('storage', listener);
  };
}
