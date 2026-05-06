import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import type { PaginationOutputModel, TrainingRecordCoachView } from '@shared-types';
import { getAccessToken } from '../auth/token-storage';
import { getCoachTrainingRecords } from '../../api/training-journals/get-coach-training-records';
import { usePageTitle } from '../../components/page-title-context';
import { t } from '../../i18n';

const formatDateTime = (value: string) => {
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

export default function CoachTrainingRecordsPage() {
  usePageTitle('Дневник спортсмена');
  const { journalId } = useParams();
  const [records, setRecords] =
    useState<PaginationOutputModel<TrainingRecordCoachView> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const pageSize = 8;
  const token = useMemo(() => getAccessToken(), []);

  useEffect(() => {
    if (!journalId || !token) {
      setIsLoading(false);
      return;
    }
    const load = async () => {
      setIsLoading(true);
      setError(null);
      try {
        setRecords(
          await getCoachTrainingRecords(token, journalId, {
            pageNumber: String(pageNumber),
            pageSize: String(pageSize),
          }),
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Не удалось загрузить записи.');
      } finally {
        setIsLoading(false);
      }
    };
    void load();
  }, [journalId, pageNumber, token]);

  const items = records?.items ?? [];

  return (
    <section className="page journal-page">
      <div className="journal-actions">
        <Link className="button-link ghost" to="/">
          {t('journal.backDashboard')}
        </Link>
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
                    <p className="record-date">{formatDateTime(record.createdAt)}</p>
                    <p className="record-result">
                      {record.result ?? t('journal.noResult')}
                    </p>
                    <p className="record-note record-note-preview">
                      {record.coachNotes ?? t('journal.dash')}
                    </p>
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
      ) : null}
    </section>
  );
}
