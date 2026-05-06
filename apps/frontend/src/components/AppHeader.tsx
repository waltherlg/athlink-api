import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type { CoachProfileView } from '@shared-types';
import { useAuth } from '../features/auth/auth-context';
import { t } from '../i18n';
import { usePageTitleValue } from './page-title-context';
import { BackendStatusIndicator } from './backend-status/BackendStatusIndicator';
import { useBackendStatus } from './backend-status/useBackendStatus';
import { getAccessToken } from '../features/auth/token-storage';
import { getCoachProfiles } from '../api/coaches/get-coach-profiles';
import {
  athleteMode,
  setDashboardMode,
} from '../features/dashboard/dashboard-mode';
import { getIncomingJournalAccessRequestsCount } from '../api/journal-access/get-incoming-journal-access-requests-count';
import { useDashboardMode } from '../features/dashboard/use-dashboard-mode';

export default function AppHeader() {
  const { userName, isChecking, logout } = useAuth();
  const title = usePageTitleValue();
  const backendStatus = useBackendStatus();
  const token = useMemo(() => getAccessToken(), [userName]);
  const [coachProfiles, setCoachProfiles] = useState<CoachProfileView[]>([]);
  const [requestsCount, setRequestsCount] = useState(0);
  const mode = useDashboardMode();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token || !userName) {
      setCoachProfiles([]);
      setRequestsCount(0);
      setDashboardMode(athleteMode);
      return;
    }

    let isActive = true;
    const load = async () => {
      const [profilesResponse, countResponse] = await Promise.allSettled([
        getCoachProfiles(token),
        getIncomingJournalAccessRequestsCount(token),
      ]);
      if (!isActive) return;
      if (profilesResponse.status === 'fulfilled') {
        setCoachProfiles(profilesResponse.value);
        if (
          mode.type === 'coach' &&
          !profilesResponse.value.some(
            (profile) => profile.id === mode.profile.id,
          )
        ) {
          setDashboardMode(athleteMode);
        }
      }
      if (countResponse.status === 'fulfilled') {
        setRequestsCount(countResponse.value.count);
      }
    };

    void load();
    const intervalId = window.setInterval(load, 30000);
    return () => {
      isActive = false;
      window.clearInterval(intervalId);
    };
  }, [mode, token, userName]);

  const modeValue =
    mode.type === 'coach' ? `coach:${mode.profile.id}` : 'athlete';

  return (
    <header className="app-header">
      <div className="app-header-inner">
        <div className="brand-block">
          <span className="page-title">{title}</span>
        </div>

        <div className="header-actions">
          {isChecking ? (
            <span className="muted">{t('header.checking')}</span>
          ) : userName ? (
            <>
              <span className="user-badge">{userName}</span>
              <select
                className="mode-select"
                value={modeValue}
                onChange={(event) => {
                  if (event.target.value === 'athlete') {
                    setDashboardMode(athleteMode);
                    return;
                  }
                  if (event.target.value === 'add-coach-profile') {
                    navigate('/coach/new');
                    return;
                  }
                  const profileId = event.target.value.replace('coach:', '');
                  const profile = coachProfiles.find(
                    (item) => item.id === profileId,
                  );
                  if (profile) setDashboardMode({ type: 'coach', profile });
                }}
              >
                <option value="athlete">Спортсмен</option>
                {coachProfiles.map((profile) => (
                  <option key={profile.id} value={`coach:${profile.id}`}>
                    {`Тренер ${t(`sportType.${profile.sportType}`)}`}
                  </option>
                ))}
                <option value="add-coach-profile">
                  Добавить профиль тренера
                </option>
              </select>
              <Link className="button-link" to="/">
                {t('header.dashboard')}
              </Link>
              <Link className="button-link ghost request-link" to="/requests">
                Запросы
                {requestsCount > 0 ? (
                  <span className="request-badge">{requestsCount}</span>
                ) : null}
              </Link>
              <button
                className="button-link ghost"
                type="button"
                onClick={logout}
              >
                {t('header.logout')}
              </button>
            </>
          ) : (
            <Link className="button-link" to="/login">
              {t('header.login')}
            </Link>
          )}
          <BackendStatusIndicator status={backendStatus} />
        </div>
      </div>
    </header>
  );
}
