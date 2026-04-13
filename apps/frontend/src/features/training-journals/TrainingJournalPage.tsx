import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import type { TrainingJournalWithLatestRecordsView } from '@shared-types';
import { getAccessToken } from '../auth/token-storage';
import { getTrainingJournalById } from '../../api/training-journals/get-training-journal-by-id';
import { t } from '../../i18n';
import { usePageTitle } from '../../components/page-title-context';

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
  const { trainingJournalId } = useParams();
  const [journal, setJournal] =
    useState<TrainingJournalWithLatestRecordsView | null>(null);
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
    if (!trainingJournalId || !token) {
      setIsLoading(false);
      return;
    }

    const load = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const journalResponse = await getTrainingJournalById(
          token,
          trainingJournalId,
        );
        setJournal(journalResponse);
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
  }, [trainingJournalId, token]);

  return (
    <section className="page journal-page">
      <div className="journal-actions">
        <Link className="button-link ghost" to="/">
          {t('journal.backDashboard')}
        </Link>
        {trainingJournalId ? (
          <Link
            className="primary"
            to={`/journal/${trainingJournalId}/new-record`}
          >
            {t('journal.addRecord')}
          </Link>
        ) : null}
        {trainingJournalId ? (
          <Link
            className="button-link ghost"
            to={`/journal/${trainingJournalId}/records`}
          >
            {t('journal.viewAll')}
          </Link>
        ) : null}
      </div>

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
                      {record.result ?? t('journal.noResult')}
                    </p>
                    <p className="record-note record-note-preview">
                      {record.coachNotes ?? t('journal.dash')}
                    </p>
                    {trainingJournalId ? (
                      <Link
                        className="button-link ghost small"
                        to={`/journal/${trainingJournalId}/records/${record.id}`}
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
