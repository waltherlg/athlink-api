import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import type { AthleteDashboardDataView } from '@shared-types';
import { getAccessToken } from '../auth/token-storage';
import { getAthleteDashboard } from '../../api/dashboard/get-athlete-dashboard';
import { t } from '../../i18n';
import { usePageTitle } from '../../components/page-title-context';

const formatDate = (value: string) => {
  if (!value) return 'No records yet';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

export default function DashboardPage() {
  usePageTitle(t('dashboard.title'));
  const [data, setData] = useState<AthleteDashboardDataView | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const token = useMemo(() => getAccessToken(), []);

  const loadDashboard = async () => {
    if (!token) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const response = await getAthleteDashboard(token);
      setData(response);
    } catch (err) {
      if (err && typeof err === 'object' && 'message' in err) {
        setError(String((err as { message?: string }).message));
      } else {
        setError(t('dashboard.errorLoad'));
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadDashboard();
  }, []);

  const journals = data?.journals ?? [];

  return (
    <section className="page dashboard">
      <header className="page-header compact">
        <p className="subtitle">{t('dashboard.subtitle')}</p>
        <div className="journal-actions">
          <Link className="button-link" to="/journal/new">
            {t('dashboard.createJournal')}
          </Link>
        </div>
      </header>

      {isLoading ? <div className="card">{t('dashboard.loading')}</div> : null}

      {error ? <div className="alert error">{error}</div> : null}

      {!isLoading && journals.length === 0 ? (
        <div className="card empty-state">
          <h2>{t('dashboard.emptyTitle')}</h2>
          <p className="subtitle">
            <Link className="inline-link" to="/journal/new">
              {t('dashboard.emptyAction')}
            </Link>{' '}
            {t('dashboard.emptyText')}
          </p>
        </div>
      ) : null}

      {!isLoading && journals.length > 0 ? (
        <div className="dashboard-grid">
          <aside className="journal-list">
            <h2>{t('dashboard.yourJournals')}</h2>
            <div className="journal-stack">
              {journals.map((journal) => {
                const latestRecord = journal.latestRecord;
                const hasTodayRecord = journal.hasTodayRecord;

                return (
                  <article key={journal.id} className="journal-card">
                    <div className="journal-card-header">
                      <Link className="journal-link" to={`/journal/${journal.id}`}>
                        <p className="journal-title">{journal.sportType}</p>
                        <p className="journal-date">
                          {formatDate(latestRecord?.date ?? '')}
                        </p>
                      </Link>
                    </div>

                    <div className="record-preview">
                      <span className="record-label">
                        {t('dashboard.lastResult')}
                      </span>
                      <strong>
                        {latestRecord?.result?.trim()
                          ? latestRecord.result
                          : t('dashboard.noResult')}
                      </strong>
                    </div>

                    {!hasTodayRecord ? (
                      <div className="warning-banner">
                        {t('dashboard.missingRecord')}
                      </div>
                    ) : null}

                    <div className="journal-actions">
                      <Link
                        className="button-link ghost"
                        to={`/journal/${journal.id}`}
                      >
                        {t('dashboard.openJournal')}
                      </Link>
                      {!hasTodayRecord ? (
                        <Link
                          className="button-link"
                          to={`/journal/${journal.id}/new-record`}
                        >
                          {t('dashboard.addRecord')}
                        </Link>
                      ) : null}
                    </div>
                  </article>
                );
              })}
            </div>
          </aside>
        </div>
      ) : null}
    </section>
  );
}
