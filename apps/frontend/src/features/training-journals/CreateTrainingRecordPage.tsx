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
import {
  safeGetLocalStorageItem,
  safeSetLocalStorageItem,
} from '../../utils/safe-local-storage';

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

const normalizeDecimalInput = (value: string) => value.replace(/,/g, '.');

const buildLastEventStorageKey = (trainingJournalId: string) =>
  `lastEventId:${trainingJournalId}`;

const buildDecimalsLabel = (decimals: number) => {
  if (decimals <= 0) return t('record.decimals.none');
  if (decimals === 1) return t('record.decimals.one');
  return t('record.decimals.many', { count: decimals });
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
  const [resultError, setResultError] = useState<string | null>(null);
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

        const storedEventId = safeGetLocalStorageItem(
          buildLastEventStorageKey(trainingJournalId),
        );
        const storedEventExists = storedEventId
          ? sportEventsResponse.some((event) => event.id === storedEventId)
          : false;

        setForm(
          storedEventExists && storedEventId
            ? { ...EMPTY_FORM, eventId: storedEventId }
            : EMPTY_FORM,
        );
        setResultError(null);
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

      const trimmedResult = normalizeDecimalInput(form.resultText.trim());
      if (!trimmedResult) {
        setResultError(t('record.validation.resultRequired'));
        return;
      }

      const result = Number(trimmedResult);
      if (!Number.isFinite(result)) {
        setResultError(t('record.validation.resultInvalid'));
        return;
      }
      if (result < 0) {
        setResultError(t('record.validation.resultInvalid'));
        return;
      }
      if (
        typeof selectedEvent.maxScore === 'number' &&
        Number.isFinite(selectedEvent.maxScore) &&
        result > selectedEvent.maxScore
      ) {
        setResultError(t('record.validation.resultInvalid'));
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
    setResultError(null);

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

  const showFreeTrainingResultMessage = isFreeTraining;
  const resultFieldError = showFreeTrainingResultMessage ? t('record.freeTrainingHint') : resultError;
  const resultHint = isFreeTraining
    ? null
    : selectedEvent
      ? t('record.exerciseHint', {
          maxScore: selectedEvent.maxScore ?? '-',
          decimalsLabel: buildDecimalsLabel(selectedEvent.decimals ?? 0),
        })
      : t('record.loadingExercises');

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
              onChange={(event) => {
                const nextEventId = event.target.value;
                if (
                  trainingJournalId &&
                  nextEventId &&
                  (nextEventId === FREE_TRAINING_VALUE ||
                    sportEvents.some((sportEvent) => sportEvent.id === nextEventId))
                ) {
                  safeSetLocalStorageItem(
                    buildLastEventStorageKey(trainingJournalId),
                    nextEventId,
                  );
                }

                setForm((prev) => ({
                  ...prev,
                  eventId: nextEventId,
                  resultText:
                    nextEventId === FREE_TRAINING_VALUE
                      ? ''
                      : prev.resultText,
                }));
              }}
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

            <div className={resultFieldError ? 'field has-error' : 'field'}>
              <input
                type="text"
                inputMode="decimal"
                value={form.resultText}
                onChange={(event) => {
                  const nextValue = event.target.value;
                  setForm((prev) => ({ ...prev, resultText: nextValue }));
                  if (resultError) setResultError(null);
                }}
                placeholder={t('record.placeholder.result')}
                disabled={isFreeTraining || isLoading || isSubmitting}
                aria-invalid={Boolean(resultFieldError)}
              />
              {resultFieldError ? (
                <div className="field-error">{resultFieldError}</div>
              ) : null}
            </div>
          </div>
          {resultHint ? <span className="field-hint">{resultHint}</span> : null}
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
