import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import type {
  AthleteDashboardDataView,
  CoachDashboardDataView,
} from '@shared-types';
import { getAccessToken } from '../auth/token-storage';
import { getAthleteDashboard } from '../../api/dashboard/get-athlete-dashboard';
import { getCoachDashboard } from '../../api/dashboard/get-coach-dashboard';
import { getApiErrorMessage } from '../../api/errors';
import { t } from '../../i18n';
import { usePageTitle } from '../../components/page-title-context';
import { useDashboardMode } from './use-dashboard-mode';

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
  const [coachData, setCoachData] = useState<CoachDashboardDataView | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const pageSize = 8;

  const token = useMemo(() => getAccessToken(), []);
  const mode = useDashboardMode();

  const loadDashboard = async () => {
    if (!token) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      if (mode.type === 'coach') {
        const response = await getCoachDashboard(token, {
          coachProfileId: mode.profile.id,
          pageNumber: String(pageNumber),
          pageSize: String(pageSize),
        });
        setCoachData(response);
        setData(null);
      } else {
        const response = await getAthleteDashboard(token);
        setData(response);
        setCoachData(null);
      }
    } catch (err) {
      setError(getApiErrorMessage(err, t('dashboard.errorLoad')));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadDashboard();
  }, [mode, pageNumber]);

  const journals = data?.journals ?? [];
  const coachJournals = coachData?.items ?? [];

  if (mode.type === 'coach') {
    return (
      <section className="page dashboard">
        <header className="page-header compact">
          <p className="subtitle">
            Журналы спортсменов, которые дали доступ этому профилю тренера.
          </p>
        </header>

        {isLoading ? <div className="card">{t('dashboard.loading')}</div> : null}
        {error ? <div className="alert error">{error}</div> : null}

        {!isLoading && coachJournals.length === 0 ? (
          <div className="card empty-state">
            <h2>Доступных дневников пока нет</h2>
            <p className="subtitle">Здесь появятся дневники после принятия запросов.</p>
          </div>
        ) : null}

        {!isLoading && coachJournals.length > 0 ? (
          <section className="journal-stack compact-stack">
            {coachJournals.map((journal) => (
              <article key={journal.id} className="journal-card compact-card">
                <div className="compact-line">
                  <strong>{journal.athleteUserName}</strong>
                  <span>Последняя запись</span>
                  <span>
                    {journal.latestRecord
                      ? `${formatDate(journal.latestRecord.date)} · ${
                          journal.latestRecord.event ?? 'Без упражнения'
                        } · ${
                          journal.latestRecord.result ?? t('dashboard.noResult')
                        }`
                      : 'Записей пока нет'}
                  </span>
                </div>

                <div className="single-line-preview">
                  {journal.latestRecord?.coachNotes ?? 'Заметки нет'}
                </div>

                <div className="journal-actions">
                  <Link
                    className="button-link ghost"
                    to={`/coach/journal/${journal.id}/records`}
                  >
                    {t('dashboard.openJournal')}
                  </Link>
                  {journal.latestRecord ? (
                    <Link
                      className="button-link"
                      to={`/coach/journal/${journal.id}/records/${journal.latestRecord.id}`}
                    >
                      Открыть последнюю запись
                    </Link>
                  ) : null}
                </div>
              </article>
            ))}

            {coachData ? (
              <div className="pagination">
                <button
                  className="button-link ghost"
                  type="button"
                  onClick={() => setPageNumber((prev) => Math.max(prev - 1, 1))}
                  disabled={pageNumber <= 1}
                >
                  {t('journal.prev')}
                </button>
                <span className="pagination-label">
                  {t('journal.page', {
                    page: coachData.page,
                    pages: coachData.pagesCount || 1,
                  })}
                </span>
                <button
                  className="button-link ghost"
                  type="button"
                  onClick={() =>
                    setPageNumber((prev) =>
                      coachData.pagesCount > prev ? prev + 1 : prev,
                    )
                  }
                  disabled={
                    coachData.pagesCount === 0 || pageNumber >= coachData.pagesCount
                  }
                >
                  {t('journal.next')}
                </button>
              </div>
            ) : null}
          </section>
        ) : null}
      </section>
    );
  }

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
                        <p className="journal-title">
                          {t(`sportType.${journal.sportType}`)}
                        </p>
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
                        {latestRecord?.result != null
                          ? latestRecord.result
                          : t('dashboard.freeTraining')}
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
