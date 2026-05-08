import type { CoachDashboardDataView, RequestQueryParamsModel } from '@shared-types';
import { apiFetch } from '../http';
import { dashboardPaths } from './paths';

export function getCoachDashboard(
  accessToken: string,
  query: Partial<RequestQueryParamsModel> & { coachProfileId?: string } = {},
) {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value != null) params.set(key, String(value));
  });
  const queryString = params.toString();
  return apiFetch<CoachDashboardDataView>(
    `${dashboardPaths.coach}${queryString ? `?${queryString}` : ''}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      credentials: 'include',
    },
  );
}
