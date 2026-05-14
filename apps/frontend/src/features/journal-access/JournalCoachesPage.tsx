import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import type {
  JournalCoachAccessView,
  TrainingJournalWithLatestRecordsView,
} from '@shared-types';
import { getAccessToken } from '../auth/token-storage';
import { usePageTitle } from '../../components/page-title-context';
import { t } from '../../i18n';
import { getJournalCoachAccesses } from '../../api/journal-access/get-journal-coach-accesses';
import { deleteJournalAccess } from '../../api/journal-access/delete-journal-access';
import { getTrainingJournalById } from '../../api/training-journals/get-training-journal-by-id';
import { getApiErrorMessage } from '../../api/errors';

export default function JournalCoachesPage() {
  usePageTitle('Тренеры дневника');
  const { journalId } = useParams();
  const [coaches, setCoaches] = useState<JournalCoachAccessView[]>([]);
  const [journal, setJournal] =
    useState<TrainingJournalWithLatestRecordsView | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const token = useMemo(() => getAccessToken(), []);

  const load = async () => {
    if (!token || !journalId) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const [coachesResponse, journalResponse] = await Promise.all([
        getJournalCoachAccesses(token, journalId),
        getTrainingJournalById(token, journalId),
      ]);
      setCoaches(coachesResponse);
      setJournal(journalResponse);
    } catch (err) {
      setError(getApiErrorMessage(err, 'Не удалось загрузить тренеров.'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const revokeAccess = async (coach: JournalCoachAccessView) => {
    if (!token || !journal) return;
    const confirmed = window.confirm(
      `Вы уверены что хотите отменить доступ тренера ${coach.userName} к вашему дневнику ${t(
        `sportType.${journal.sportType}`,
      )}?`,
    );
    if (!confirmed) return;

    setProcessingId(coach.accessId);
    setError(null);
    try {
      await deleteJournalAccess(token, coach.accessId);
      setCoaches((prev) =>
        prev.filter((item) => item.accessId !== coach.accessId),
      );
    } catch (err) {
      setError(getApiErrorMessage(err, 'Не удалось отменить доступ.'));
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <section className="page">
      <div className="journal-actions">
        {journalId ? (
          <Link className="button-link ghost" to={`/journal/${journalId}`}>
            {t('record.backJournal')}
          </Link>
        ) : null}
      </div>

      {isLoading ? <div className="card">{t('journal.loading')}</div> : null}
      {error ? <div className="alert error">{error}</div> : null}

      {!isLoading && coaches.length === 0 ? (
        <div className="card empty-state">
          <h2>У этого дневника пока нет тренеров</h2>
        </div>
      ) : null}

      {!isLoading && coaches.length > 0 ? (
        <section className="journal-stack compact-stack">
          {coaches.map((coach) => (
            <article key={coach.accessId} className="journal-card compact-card">
              <div className="compact-line">
                <strong>{coach.userName}</strong>
                <span>{t(`sportType.${coach.sportType}`)}</span>
              </div>
              <div className="journal-actions">
                <button
                  className="button-link ghost"
                  type="button"
                  disabled={processingId === coach.accessId}
                  onClick={() => void revokeAccess(coach)}
                >
                  Отменить доступ
                </button>
              </div>
            </article>
          ))}
        </section>
      ) : null}
    </section>
  );
}
