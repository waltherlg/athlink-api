import { useEffect, useMemo, useState } from 'react';
import type { JournalAccessRequestView } from '@shared-types';
import { getAccessToken } from '../auth/token-storage';
import { usePageTitle } from '../../components/page-title-context';
import { t } from '../../i18n';
import { getIncomingJournalAccessRequests } from '../../api/journal-access/get-incoming-journal-access-requests';
import {
  acceptJournalAccessRequest,
  rejectJournalAccessRequest,
} from '../../api/journal-access/respond-journal-access-request';

export default function AccessRequestsPage() {
  usePageTitle('Запросы');
  const [requests, setRequests] = useState<JournalAccessRequestView[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const token = useMemo(() => getAccessToken(), []);

  const load = async () => {
    if (!token) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      setRequests(await getIncomingJournalAccessRequests(token));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось загрузить запросы.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const respond = async (requestId: string, action: 'accept' | 'reject') => {
    if (!token) return;
    setProcessingId(requestId);
    setError(null);
    try {
      if (action === 'accept') {
        await acceptJournalAccessRequest(token, requestId);
      } else {
        await rejectJournalAccessRequest(token, requestId);
      }
      setRequests((prev) => prev.filter((request) => request.id !== requestId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось обработать запрос.');
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <section className="page">
      {isLoading ? <div className="card">{t('dashboard.loading')}</div> : null}
      {error ? <div className="alert error">{error}</div> : null}

      {!isLoading && requests.length === 0 ? (
        <div className="card empty-state">
          <h2>Запросов пока нет</h2>
        </div>
      ) : null}

      {!isLoading && requests.length > 0 ? (
        <section className="journal-stack">
          {requests.map((request) => (
            <article key={request.id} className="journal-card">
              <div>
                <p className="journal-title">{request.athleteUserName}</p>
                <p className="journal-date">{t(`sportType.${request.sportType}`)}</p>
              </div>
              <div className="journal-actions">
                <button
                  className="primary"
                  type="button"
                  disabled={processingId === request.id}
                  onClick={() => void respond(request.id, 'accept')}
                >
                  Принять
                </button>
                <button
                  className="button-link ghost"
                  type="button"
                  disabled={processingId === request.id}
                  onClick={() => void respond(request.id, 'reject')}
                >
                  Отклонить
                </button>
              </div>
            </article>
          ))}
        </section>
      ) : null}
    </section>
  );
}
