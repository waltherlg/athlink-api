import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import type {
  TrainingJournalWithLatestRecordsView,
  TrainingRecordsPaginationView,
} from '@shared-types';
import { getAccessToken } from '../auth/token-storage';
import { getTrainingJournalById } from '../../api/training-journals/get-training-journal-by-id';
import { getTrainingRecords } from '../../api/training-journals/get-training-records';
import { t } from '../../i18n';

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
  const [records, setRecords] =
    useState<TrainingRecordsPaginationView | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const pageSize = 6;
  const token = useMemo(() => getAccessToken(), []);

  useEffect(() => {
    if (!trainingJournalId || !token) {
      setIsLoading(false);
      return;
    }

    const load = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [journalResponse, recordsResponse] = await Promise.all([
          getTrainingJournalById(token, trainingJournalId),
          getTrainingRecords(token, trainingJournalId, {
            pageNumber: String(pageNumber),
            pageSize: String(pageSize),
          }),
        ]);
        setJournal(journalResponse);
        setRecords(recordsResponse);
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
  }, [trainingJournalId, token, pageNumber]);

  const items = records?.items ?? [];

  return (
    <section className="page journal-page">
      <header className="page-header">
        <h1>{journal?.sportType ?? t('journal.titleFallback')}</h1>
        <div className="journal-actions">
          <Link className="button-link ghost" to="/">
            {t('journal.back')}
          </Link>
          {trainingJournalId ? (
            <Link
              className="primary"
              to={`/journal/${trainingJournalId}/new-record`}
            >
              {t('journal.addRecord')}
            </Link>
          ) : null}
        </div>
      </header>

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
                    {record.coachNotes ? (
                      <p className="record-note">
                        {t('journal.coach')}: {record.coachNotes}
                      </p>
                    ) : null}
                    {record.privateNotes ? (
                      <p className="record-note">
                        {t('journal.private')}: {record.privateNotes}
                      </p>
                    ) : null}
                  </article>
                ))}
              </div>
            )}
          </section>

          <section className="card">
            <h2>{t('journal.allTitle')}</h2>
            {items.length === 0 ? (
              <p className="subtitle">{t('journal.allEmpty')}</p>
            ) : (
              <div className="record-list">
                {items.map((record) => (
                  <article key={record.id} className="record-row">
                    <div>
                      <p className="record-date">
                        {formatDateTime(record.createdAt)}
                      </p>
                      <p className="record-result">
                        {record.result ?? t('journal.noResult')}
                      </p>
                    </div>
                    <div className="record-meta">
                      {record.coachNotes ? (
                        <span>
                          {t('journal.coach')}: {record.coachNotes}
                        </span>
                      ) : (
                        <span>
                          {t('journal.coach')}: {t('journal.dash')}
                        </span>
                      )}
                      {record.privateNotes ? (
                        <span>
                          {t('journal.private')}: {record.privateNotes}
                        </span>
                      ) : (
                        <span>
                          {t('journal.private')}: {t('journal.dash')}
                        </span>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            )}

            {records ? (
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
                    page: records.page,
                    pages: records.pagesCount || 1,
                  })}
                </span>
                <button
                  className="button-link ghost"
                  type="button"
                  onClick={() =>
                    setPageNumber((prev) =>
                      records.pagesCount > prev ? prev + 1 : prev,
                    )
                  }
                  disabled={records.pagesCount === 0 || pageNumber >= records.pagesCount}
                >
                  {t('journal.next')}
                </button>
              </div>
            ) : null}
          </section>
        </div>
      ) : null}
    </section>
  );
}
