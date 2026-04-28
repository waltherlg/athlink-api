import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import type { SportEventView, TrainingRecordsPaginationView } from '@shared-types';
import { getAccessToken } from '../auth/token-storage';
import { getTrainingRecords } from '../../api/training-journals/get-training-records';
import { getTrainingJournalById } from '../../api/training-journals/get-training-journal-by-id';
import { getSportEventsBySportType } from '../../api/sport-events/get-sport-events';
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

export default function TrainingRecordsPage() {
  usePageTitle(t('journal.allTitle'));
  const { trainingJournalId } = useParams();
  const [records, setRecords] =
    useState<TrainingRecordsPaginationView | null>(null);
  const [sportEvents, setSportEvents] = useState<SportEventView[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const pageSize = 8;
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
        const recordsResponse = await getTrainingRecords(
          token,
          trainingJournalId,
          {
            pageNumber: String(pageNumber),
            pageSize: String(pageSize),
          },
        );
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

  useEffect(() => {
    if (!trainingJournalId || !token) return;

    let isActive = true;

    const load = async () => {
      try {
        const journalResponse = await getTrainingJournalById(
          token,
          trainingJournalId,
        );
        const eventsResponse = await getSportEventsBySportType(
          token,
          journalResponse.sportType,
        );
        if (!isActive) return;
        setSportEvents(eventsResponse);
      } catch {
        // ignore, fallback to ids only
      }
    };

    void load();

    return () => {
      isActive = false;
    };
  }, [trainingJournalId, token]);

  const sportEventById = useMemo(() => {
    const map = new Map<string, SportEventView>();
    for (const event of sportEvents) map.set(event.id, event);
    return map;
  }, [sportEvents]);

  const items = records?.items ?? [];

  return (
    <section className="page journal-page">
      <div className="journal-actions">
        {trainingJournalId ? (
          <Link className="button-link ghost" to={`/journal/${trainingJournalId}`}>
            {t('record.backJournal')}
          </Link>
        ) : null}
      </div>

      {error ? <div className="alert error">{error}</div> : null}
      {isLoading ? <div className="card">{t('journal.loading')}</div> : null}

      {!isLoading ? (
        <section className="card">
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
                      {record.result == null ? (
                        t('journal.freeTraining')
                      ) : (
                        <>
                          <span className="record-event">
                            {record.eventId
                              ? (sportEventById.get(record.eventId)?.name ?? t('journal.dash'))
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
                  </div>
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
                disabled={
                  records.pagesCount === 0 || pageNumber >= records.pagesCount
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
