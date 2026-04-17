import { Link } from 'react-router-dom';
import { useAuth } from '../features/auth/auth-context';
import { t } from '../i18n';
import { usePageTitleValue } from './page-title-context';
import { BackendStatusIndicator } from './backend-status/BackendStatusIndicator';
import { useBackendStatus } from './backend-status/useBackendStatus';

export default function AppHeader() {
  const { userName, isChecking, logout } = useAuth();
  const title = usePageTitleValue();
  const backendStatus = useBackendStatus();

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
              <span className="user-badge">
                {t('header.greeting', { name: userName })}
              </span>
              <Link className="button-link" to="/">
                {t('header.dashboard')}
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
