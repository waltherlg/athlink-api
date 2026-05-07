import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import type {
  CoachProfileSearchView,
  SportEventView,
  TrainingJournalWithLatestRecordsView,
} from '@shared-types';
import { getAccessToken } from '../auth/token-storage';
import { getTrainingJournalById } from '../../api/training-journals/get-training-journal-by-id';
import { getSportEventsBySportType } from '../../api/sport-events/get-sport-events';
import { t } from '../../i18n';
import { usePageTitle } from '../../components/page-title-context';
import { searchCoachProfiles } from '../../api/coaches/search-coach-profiles';
import { createJournalAccessRequest } from '../../api/journal-access/create-journal-access-request';

const formatDateTime = (value: string) => {
  if (!value) return t('journal.noDate');
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString('ru-RU', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export default function TrainingJournalPage() {
  const { journalId } = useParams();
  const [journal, setJournal] =
    useState<TrainingJournalWithLatestRecordsView | null>(null);
  const [sportEvents, setSportEvents] = useState<SportEventView[]>([]);
  const [isCoachSearchOpen, setIsCoachSearchOpen] = useState(false);
  const [coachQuery, setCoachQuery] = useState('');
  const [coachResults, setCoachResults] = useState<CoachProfileSearchView[]>([]);
  const [selectedCoach, setSelectedCoach] =
    useState<CoachProfileSearchView | null>(null);
  const [isSearchingCoaches, setIsSearchingCoaches] = useState(false);
  const [coachRequestStatus, setCoachRequestStatus] = useState<string | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const token = useMemo(() => getAccessToken(), []);
  const sportLabel = journal?.sportType
    ? t(`sportType.${journal.sportType}`)
    : null;
  usePageTitle(
    sportLabel
      ? t('journal.titleWithSport', { sport: sportLabel })
      : t('journal.titleFallback'),
  );

  useEffect(() => {
    if (!journalId || !token) {
      setIsLoading(false);
      return;
    }

    const load = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const journalResponse = await getTrainingJournalById(token, journalId);
        setJournal(journalResponse);

        const eventsResponse = await getSportEventsBySportType(
          token,
          journalResponse.sportType,
        );
        setSportEvents(eventsResponse);
      } catch (err) {
        if (err && typeof err === 'object' && 'message' in err) {
          setError(String((err as { message?: string }).message));
        } else {
          setError(t('journal.errorLoad'));
        }
      } finally {
        setIsLoading(false);
      }
    };

    void load();
  }, [journalId, token]);

  useEffect(() => {
    if (
      !token ||
      !journal ||
      !isCoachSearchOpen ||
      coachQuery.trim().length === 0
    ) {
      setCoachResults([]);
      setSelectedCoach(null);
      return;
    }

    let isActive = true;
    const load = async () => {
      setIsSearchingCoaches(true);
      try {
        const results = await searchCoachProfiles(
          token,
          journal.sportType,
          coachQuery,
        );
        if (!isActive) return;
        setCoachResults(results);
      } catch {
        if (isActive) setCoachResults([]);
      } finally {
        if (isActive) setIsSearchingCoaches(false);
      }
    };

    const timeoutId = window.setTimeout(load, 250);
    return () => {
      isActive = false;
      window.clearTimeout(timeoutId);
    };
  }, [coachQuery, isCoachSearchOpen, journal, token]);

  const sportEventById = useMemo(() => {
    const map = new Map<string, SportEventView>();
    for (const event of sportEvents) map.set(event.id, event);
    return map;
  }, [sportEvents]);

  return (
    <section className="page journal-page">
      <div className="journal-actions">
        <Link className="button-link ghost" to="/">
          {t('journal.backDashboard')}
        </Link>
        {journalId ? (
          <Link className="primary" to={`/journal/${journalId}/new-record`}>
            {t('journal.addRecord')}
          </Link>
        ) : null}
        {journalId ? (
          <Link
            className="button-link ghost"
            to={`/journal/${journalId}/records`}
          >
            {t('journal.viewAll')}
          </Link>
        ) : null}
        {journalId ? (
          <button
            className="button-link ghost"
            type="button"
            onClick={() => setIsCoachSearchOpen((prev) => !prev)}
          >
            Добавить тренера
          </button>
        ) : null}
        {journalId ? (
          <Link
            className="button-link ghost"
            to={`/journal/${journalId}/coaches`}
          >
            Просмотр тренеров
          </Link>
        ) : null}
      </div>

      {isCoachSearchOpen && journal ? (
        <section className="card form">
          <label className="field">
            <span>Username тренера</span>
            <input
              value={coachQuery}
              onChange={(event) => {
                setCoachQuery(event.target.value);
                setSelectedCoach(null);
                setCoachRequestStatus(null);
              }}
              placeholder="Начните вводить username"
            />
          </label>

          {isSearchingCoaches ? <p className="subtitle">Ищем тренера...</p> : null}

          {coachResults.length > 0 ? (
            <div className="search-results">
              {coachResults.map((coach) => (
                <button
                  key={coach.id}
                  className={`search-result ${
                    selectedCoach?.id === coach.id ? 'is-selected' : ''
                  }`}
                  type="button"
                  onClick={() => setSelectedCoach(coach)}
                >
                  {coach.userName}
                </button>
              ))}
            </div>
          ) : null}

          {selectedCoach ? (
            <div className="confirm-box">
              <p>
                Вы действительно хотите дать доступ тренеру{' '}
                <strong>{selectedCoach.userName}</strong> к дневнику{' '}
                <strong>{t(`sportType.${journal.sportType}`)}</strong>?
              </p>
              <button
                className="primary"
                type="button"
                onClick={async () => {
                  if (!token || !journalId || !selectedCoach) return;
                  setCoachRequestStatus(null);
                  try {
                    await createJournalAccessRequest(token, {
                      journalId,
                      coachProfileId: selectedCoach.id,
                    });
                    setCoachRequestStatus('Запрос отправлен.');
                  } catch (err) {
                    setCoachRequestStatus(
                      err instanceof Error
                        ? err.message
                        : 'Не удалось отправить запрос.',
                    );
                  }
                }}
              >
                Добавить тренера
              </button>
            </div>
          ) : null}

          {coachRequestStatus ? (
            <div className="alert success">{coachRequestStatus}</div>
          ) : null}
        </section>
      ) : null}

      {error ? <div className="alert error">{error}</div> : null}

      {isLoading ? <div className="card">{t('journal.loading')}</div> : null}

      {!isLoading && journal ? (
        <div className="journal-detail-grid">
          <section className="card">
            <h2>{t('journal.latestTitle')}</h2>
            {journal.latestRecords.length === 0 ? (
              <p className="subtitle">{t('journal.latestEmpty')}</p>
            ) : (
              <div className="record-grid">
                {journal.latestRecords.map((record) => (
                  <article key={record.id} className="record-card">
                    <p className="record-date">
                      {formatDateTime(record.createdAt)}
                    </p>
                    <p className="record-result">
                      {record.result == null ? (
                        t('journal.freeTraining')
                      ) : (
                        <>
                          <span className="record-event">
                            {record.eventId
                              ? (sportEventById.get(record.eventId)?.name ??
                                t('journal.dash'))
                              : t('journal.dash')}
                            {' - '}
                          </span>
                          <strong className="record-score">{record.result}</strong>
                        </>
                      )}
                    </p>
                    <p className="record-note record-note-preview">
                      {record.coachNotes ?? t('journal.dash')}
                    </p>
                    {journalId ? (
                      <Link
                        className="button-link ghost small"
                        to={`/journal/${journalId}/records/${record.id}`}
                      >
                        {t('record.open')}
                      </Link>
                    ) : null}
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      ) : null}
    </section>
  );
}
