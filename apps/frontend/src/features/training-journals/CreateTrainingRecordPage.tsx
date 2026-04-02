import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import type { CreateTrainingRecordInput } from '@shared-types';
import { createTrainingRecord } from '../../api/training-journals/create-training-record';
import { getAccessToken } from '../auth/token-storage';
import { t } from '../../i18n';

const EMPTY_FORM: CreateTrainingRecordInput = {
  result: '',
  coachNotes: '',
  privateNotes: '',
};

const normalizeInput = (input: CreateTrainingRecordInput) => ({
  result: input.result?.trim() ? input.result.trim() : undefined,
  coachNotes: input.coachNotes?.trim() ? input.coachNotes.trim() : undefined,
  privateNotes: input.privateNotes?.trim()
    ? input.privateNotes.trim()
    : undefined,
});

export default function CreateTrainingRecordPage() {
  const { trainingJournalId } = useParams();
  const [form, setForm] = useState<CreateTrainingRecordInput>(EMPTY_FORM);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const token = useMemo(() => getAccessToken(), []);

  const handleSubmit = async () => {
    if (!trainingJournalId || !token) return;
    setIsLoading(true);
    setError(null);
    try {
      await createTrainingRecord(token, trainingJournalId, normalizeInput(form));
      navigate(`/journal/${trainingJournalId}`);
    } catch (err) {
      if (err && typeof err === 'object' && 'message' in err) {
        setError(String((err as { message?: string }).message));
      } else {
        setError(t('record.errorCreate'));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="page">
      <header className="page-header">
        <h1>{t('record.title')}</h1>
      </header>

      <div className="journal-actions">
        {trainingJournalId ? (
          <Link className="button-link ghost" to={`/journal/${trainingJournalId}`}>
            {t('record.backJournal')}
          </Link>
        ) : (
          <Link className="button-link ghost" to="/">
            {t('record.backDashboard')}
          </Link>
        )}
      </div>

      <form
        className="card form"
        onSubmit={(event) => {
          event.preventDefault();
          void handleSubmit();
        }}
      >
        <label className="field">
          <span>{t('record.field.result')}</span>
          <input
            type="text"
            value={form.result ?? ''}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, result: event.target.value }))
            }
            placeholder={t('record.placeholder.result')}
          />
        </label>

        <label className="field">
          <span>{t('record.field.coachNotes')}</span>
          <input
            type="text"
            value={form.coachNotes ?? ''}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, coachNotes: event.target.value }))
            }
            placeholder={t('record.placeholder.coachNotes')}
          />
        </label>

        <label className="field">
          <span>{t('record.field.privateNotes')}</span>
          <input
            type="text"
            value={form.privateNotes ?? ''}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, privateNotes: event.target.value }))
            }
            placeholder={t('record.placeholder.privateNotes')}
          />
        </label>

        <button className="primary" type="submit" disabled={isLoading}>
          {isLoading ? t('record.saving') : t('record.save')}
        </button>
      </form>

      {error ? <div className="alert error">{error}</div> : null}
    </section>
  );
}
