import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import type { TrainingRecordCoachView } from '@shared-types';
import { getAccessToken } from '../auth/token-storage';
import { getCoachTrainingRecordById } from '../../api/training-journals/get-coach-training-record-by-id';
import { getApiErrorMessage } from '../../api/errors';
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

export default function CoachTrainingRecordPage() {
  usePageTitle('Запись спортсмена');
  const { journalId, recordId } = useParams();
  const [record, setRecord] = useState<TrainingRecordCoachView | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const token = useMemo(() => getAccessToken(), []);

  useEffect(() => {
    if (!journalId || !recordId || !token) {
      setIsLoading(false);
      return;
    }

    const load = async () => {
      setIsLoading(true);
      setError(null);
      try {
        setRecord(await getCoachTrainingRecordById(token, journalId, recordId));
      } catch (err) {
        setError(getApiErrorMessage(err, 'Не удалось загрузить запись.'));
      } finally {
        setIsLoading(false);
      }
    };

    void load();
  }, [journalId, recordId, token]);

  return (
    <section className="page journal-page">
      <div className="journal-actions">
        {journalId ? (
          <Link
            className="button-link ghost"
            to={`/coach/journal/${journalId}/records`}
          >
            Назад к дневнику
          </Link>
        ) : null}
      </div>

      {error ? <div className="alert error">{error}</div> : null}
      {isLoading ? <div className="card">{t('record.loading')}</div> : null}

      {!isLoading && record ? (
        <section className="card record-detail">
          <p className="record-date">{formatDateTime(record.createdAt)}</p>
          <div className="record-block">
            <span className="record-label">Упражнение</span>
            <p className="record-result">{record.event ?? 'Без упражнения'}</p>
          </div>
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
        </section>
      ) : null}
    </section>
  );
}
