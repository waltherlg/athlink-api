import { apiFetch } from '../http';
import type { AthleteDashboardDataView } from '@shared-types';
import { dashboardPaths } from './paths';

export function getAthleteDashboard(accessToken: string) {
  return apiFetch<AthleteDashboardDataView>(dashboardPaths.athlete, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    credentials: 'include',
  });
}
