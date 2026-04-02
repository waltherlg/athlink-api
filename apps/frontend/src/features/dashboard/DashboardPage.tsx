import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import type {
  AthleteDashboardDataView,
  CreateTrainingRecordInput,
} from '@shared-types';
import { getAccessToken } from '../auth/token-storage';
import { getAthleteDashboard } from '../../api/dashboard/get-athlete-dashboard';
import { createTrainingRecord } from '../../api/training-journals/create-training-record';
import { t } from '../../i18n';
import { usePageTitle } from '../../components/page-title-context';

type JournalFormState = Record<string, CreateTrainingRecordInput>;

const EMPTY_FORM: CreateTrainingRecordInput = {
  result: '',
  coachNotes: '',
  privateNotes: '',
};

const normalizeInput = (input: CreateTrainingRecordInput) => ({
  result: input.result?.trim() ? input.result.trim() : undefined,
  coachNotes: input.coachNotes?.trim() ? input.coachNotes.trim() : undefined,
  privateNotes: input.privateNotes?.trim() ? input.privateNotes.trim() : undefined,
});

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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [forms, setForms] = useState<JournalFormState>({});
  const [activeSubmitId, setActiveSubmitId] = useState<string | null>(null);

  const token = useMemo(() => getAccessToken(), []);

  const loadDashboard = async () => {
    if (!token) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const response = await getAthleteDashboard(token);
      setData(response);
    } catch (err) {
      if (err && typeof err === 'object' && 'message' in err) {
        setError(String((err as { message?: string }).message));
      } else {
        setError(t('dashboard.errorLoad'));
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadDashboard();
  }, []);

  const journals = data?.journals ?? [];

  const handleFormChange = (
    journalId: string,
    field: keyof CreateTrainingRecordInput,
    value: string,
  ) => {
    setForms((prev) => ({
      ...prev,
      [journalId]: { ...EMPTY_FORM, ...prev[journalId], [field]: value },
    }));
  };

  const handleQuickSubmit = async (journalId: string) => {
    if (!token) return;
    const payload = normalizeInput(forms[journalId] ?? EMPTY_FORM);
    setActiveSubmitId(journalId);
    setError(null);
    try {
      await createTrainingRecord(token, journalId, payload);
      setForms((prev) => ({ ...prev, [journalId]: EMPTY_FORM }));
      await loadDashboard();
    } catch (err) {
      if (err && typeof err === 'object' && 'message' in err) {
        setError(String((err as { message?: string }).message));
      } else {
        setError(t('dashboard.errorCreateRecord'));
      }
    } finally {
      setActiveSubmitId(null);
    }
  };

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
                const formState = forms[journal.id] ?? EMPTY_FORM;
                const isSubmitting = activeSubmitId === journal.id;

                return (
                  <article key={journal.id} className="journal-card">
                    <div className="journal-card-header">
                      <Link className="journal-link" to={`/journal/${journal.id}`}>
                        <p className="journal-title">{journal.sportType}</p>
                        <p className="journal-date">
                          {formatDate(latestRecord?.date ?? '')}
                        </p>
                      </Link>
                      <span className="journal-badge">Athlete</span>
                    </div>

                    <div className="record-preview">
                      <span className="record-label">
                        {t('dashboard.lastResult')}
                      </span>
                      <strong>
                        {latestRecord?.result?.trim()
                          ? latestRecord.result
                          : t('dashboard.noResult')}
                      </strong>
                    </div>

                    {!hasTodayRecord ? (
                      <div className="warning-banner">
                        {t('dashboard.missingRecord')}
                      </div>
                    ) : null}

                    {!hasTodayRecord ? (
                      <div className="quick-form">
                        <label className="field">
                          <span>{t('dashboard.field.result')}</span>
                          <textarea
                            rows={1}
                            value={formState.result ?? ''}
                            onChange={(event) =>
                              handleFormChange(
                                journal.id,
                                'result',
                                event.target.value,
                              )
                            }
                            placeholder={t('dashboard.placeholder.result')}
                          />
                        </label>

                        <label className="field">
                          <span>{t('dashboard.field.coachNotes')}</span>
                          <textarea
                            rows={4}
                            value={formState.coachNotes ?? ''}
                            onChange={(event) =>
                              handleFormChange(
                                journal.id,
                                'coachNotes',
                                event.target.value,
                              )
                            }
                            placeholder={t('dashboard.placeholder.coachNotes')}
                          />
                        </label>

                        <label className="field">
                          <span>{t('dashboard.field.privateNotes')}</span>
                          <textarea
                            rows={4}
                            value={formState.privateNotes ?? ''}
                            onChange={(event) =>
                              handleFormChange(
                                journal.id,
                                'privateNotes',
                                event.target.value,
                              )
                            }
                            placeholder={t('dashboard.placeholder.privateNotes')}
                          />
                        </label>

                        <button
                          className="primary"
                          type="button"
                          disabled={isSubmitting}
                          onClick={() => handleQuickSubmit(journal.id)}
                        >
                          {isSubmitting
                            ? t('dashboard.saving')
                            : t('dashboard.save')}
                        </button>
                      </div>
                    ) : null}

                    <Link className="button-link ghost" to={`/journal/${journal.id}`}>
                      {t('dashboard.openJournal')}
                    </Link>
                  </article>
                );
              })}
            </div>
          </aside>

          <section className="dashboard-spotlight">
            <div className="card spotlight-card">
              <h2>{t('dashboard.nextTitle')}</h2>
              <p className="subtitle">
                {t('dashboard.nextText')}
              </p>
              <div className="spotlight-actions">
                <Link className="primary" to={`/journal/${journals[0].id}`}>
                  {t('dashboard.goToJournal')}
                </Link>
                <Link
                  className="button-link ghost"
                  to={`/journal/${journals[0].id}/new-record`}
                >
                  {t('dashboard.addRecord')}
                </Link>
              </div>
            </div>
          </section>
        </div>
      ) : null}
    </section>
  );
}
