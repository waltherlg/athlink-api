import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import type { TrainingRecordAthleteView } from '@shared-types';
import { getAccessToken } from '../auth/token-storage';
import { getTrainingRecordById } from '../../api/training-journals/get-training-record-by-id';
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

export default function TrainingRecordPage() {
  usePageTitle(t('record.viewTitle'));
  const { trainingJournalId, recordId } = useParams();
  const [record, setRecord] = useState<TrainingRecordAthleteView | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const token = useMemo(() => getAccessToken(), []);

  useEffect(() => {
    if (!trainingJournalId || !recordId || !token) {
      setIsLoading(false);
      return;
    }

    const load = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await getTrainingRecordById(
          token,
          trainingJournalId,
          recordId,
        );
        setRecord(response);
      } catch (err) {
        if (err && typeof err === 'object' && 'message' in err) {
          setError(String((err as { message?: string }).message));
        } else {
          setError(t('record.errorLoad'));
        }
      } finally {
        setIsLoading(false);
      }
    };

    void load();
  }, [trainingJournalId, recordId, token]);

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
      {isLoading ? <div className="card">{t('record.loading')}</div> : null}

      {!isLoading && record ? (
        <section className="card record-detail">
          <p className="record-date">{formatDateTime(record.createdAt)}</p>
          <div className="record-block">
            <span className="record-label">{t('record.field.result')}</span>
            <p className="record-result">
              {record.result ?? t('journal.noResult')}
            </p>
          </div>
          <div className="record-block">
            <span className="record-label">{t('record.field.coachNotes')}</span>
            <p className="record-note">
              {record.coachNotes ?? t('journal.dash')}
            </p>
          </div>
          <div className="record-block">
            <span className="record-label">{t('record.field.privateNotes')}</span>
            <p className="record-note">
              {record.privateNotes ?? t('journal.dash')}
            </p>
          </div>
        </section>
      ) : null}
    </section>
  );
}
