import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import type {
  CreateTrainingRecordInput,
  SportEventView,
  TrainingJournalWithLatestRecordsView,
  TrainingRecordTypeEnum,
} from '@shared-types';
import { createTrainingRecord } from '../../api/training-journals/create-training-record';
import { getTrainingJournalById } from '../../api/training-journals/get-training-journal-by-id';
import { getSportEventsBySportType } from '../../api/sport-events/get-sport-events';
import { getAccessToken } from '../auth/token-storage';
import { t } from '../../i18n';
import { usePageTitle } from '../../components/page-title-context';

const FREE_TRAINING_VALUE = '__free_training__';

type RecordFormState = {
  eventId: string;
  resultText: string;
  coachNotes: string;
  privateNotes: string;
};

const EMPTY_FORM: RecordFormState = {
  eventId: FREE_TRAINING_VALUE,
  resultText: '',
  coachNotes: '',
  privateNotes: '',
};

const normalizeText = (value: string) => {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
};

const buildResultStep = (selectedEvent: SportEventView | null) => {
  const decimals = selectedEvent?.decimals ?? 0;
  return 1 / 10 ** decimals;
};

export default function CreateTrainingRecordPage() {
  usePageTitle(t('record.title'));
  const { trainingJournalId } = useParams();
  const [journal, setJournal] =
    useState<TrainingJournalWithLatestRecordsView | null>(null);
  const [sportEvents, setSportEvents] = useState<SportEventView[]>([]);
  const [form, setForm] = useState<RecordFormState>(EMPTY_FORM);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const token = useMemo(() => getAccessToken(), []);

  useEffect(() => {
    if (!trainingJournalId || !token) {
      setIsLoading(false);
      return;
    }

    let isActive = true;

    const load = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const journalResponse = await getTrainingJournalById(
          token,
          trainingJournalId,
        );
        const sportEventsResponse = await getSportEventsBySportType(
          token,
          journalResponse.sportType,
        );

        if (!isActive) return;

        setJournal(journalResponse);
        setSportEvents(sportEventsResponse);
        setForm(EMPTY_FORM);
      } catch (err) {
        if (!isActive) return;

        if (err && typeof err === 'object' && 'message' in err) {
          setError(String((err as { message?: string }).message));
        } else {
          setError(t('record.errorLoad'));
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    void load();

    return () => {
      isActive = false;
    };
  }, [trainingJournalId, token]);

  const selectedEvent =
    form.eventId === FREE_TRAINING_VALUE
      ? null
      : sportEvents.find((event) => event.id === form.eventId) ?? null;
  const isFreeTraining = form.eventId === FREE_TRAINING_VALUE;
  const resultStep = buildResultStep(selectedEvent);

  const handleSubmit = async () => {
    if (!trainingJournalId || !token || isLoading || isSubmitting) return;

    const coachNotes = normalizeText(form.coachNotes);
    const privateNotes = normalizeText(form.privateNotes);

    let payload: CreateTrainingRecordInput;

    if (isFreeTraining) {
      payload = {
        type: 'FREE' as TrainingRecordTypeEnum,
        coachNotes,
        privateNotes,
      };
    } else {
      if (!selectedEvent) {
        setError(t('record.validation.exerciseRequired'));
        return;
      }

      const trimmedResult = form.resultText.trim();
      if (!trimmedResult) {
        setError(t('record.validation.resultRequired'));
        return;
      }

      const result = Number(trimmedResult);
      if (!Number.isFinite(result)) {
        setError(t('record.validation.resultInvalid'));
        return;
      }

      payload = {
        type: 'STRUCTURED' as TrainingRecordTypeEnum,
        eventId: selectedEvent.id,
        result,
        coachNotes,
        privateNotes,
      };
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await createTrainingRecord(token, trainingJournalId, payload);
      navigate(`/journal/${trainingJournalId}`);
    } catch (err) {
      if (err && typeof err === 'object' && 'message' in err) {
        setError(String((err as { message?: string }).message));
      } else {
        setError(t('record.errorCreate'));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="page">
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
          <span>{t('record.field.exercise')}</span>
          <div className="record-input-row">
            <select
              value={form.eventId}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  eventId: event.target.value,
                  resultText:
                    event.target.value === FREE_TRAINING_VALUE
                      ? ''
                      : prev.resultText,
                }))
              }
              disabled={isLoading || isSubmitting}
            >
              <option value={FREE_TRAINING_VALUE}>
                {t('record.option.freeTraining')}
              </option>
              {sportEvents.map((event) => (
                <option key={event.id} value={event.id}>
                  {event.name}
                </option>
              ))}
            </select>

            <input
              type="number"
              inputMode="decimal"
              step={resultStep}
              min={0}
              value={form.resultText}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, resultText: event.target.value }))
              }
              placeholder={t('record.placeholder.result')}
              disabled={isFreeTraining || isLoading || isSubmitting}
              max={selectedEvent?.maxScore ?? undefined}
            />
          </div>
          <span className="field-hint">
            {isFreeTraining
              ? t('record.freeTrainingHint')
              : selectedEvent
                ? t('record.exerciseHint', {
                    maxScore: selectedEvent.maxScore ?? '-',
                    decimals: selectedEvent.decimals ?? 0,
                  })
                : t('record.loadingExercises')}
          </span>
        </label>

        <label className="field">
          <span>{t('record.field.coachNotes')}</span>
          <textarea
            rows={4}
            value={form.coachNotes}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, coachNotes: event.target.value }))
            }
            placeholder={t('record.placeholder.coachNotes')}
            disabled={isLoading || isSubmitting}
          />
        </label>

        <label className="field">
          <span>{t('record.field.privateNotes')}</span>
          <textarea
            rows={2}
            value={form.privateNotes}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, privateNotes: event.target.value }))
            }
            placeholder={t('record.placeholder.privateNotes')}
            disabled={isLoading || isSubmitting}
          />
        </label>

        <div className="form-actions start">
          <button
            className="primary"
            type="submit"
            disabled={isLoading || isSubmitting}
          >
            {isSubmitting ? t('record.saving') : t('record.save')}
          </button>
        </div>
      </form>

      {error ? <div className="alert error">{error}</div> : null}
      {journal ? null : isLoading ? <div className="card">{t('record.loadingExercises')}</div> : null}
    </section>
  );
}
