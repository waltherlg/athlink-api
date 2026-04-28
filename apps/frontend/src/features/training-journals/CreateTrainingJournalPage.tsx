import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type { CreateTrainingJournalInput } from '@shared-types';
import { SportTypeEnum } from '@shared-types';
import { createTrainingJournal } from '../../api/training-journals/create-training-journal';
import { getAvailableSportTypes } from '../../api/training-journals/get-available-sport-types';
import { getAccessToken } from '../auth/token-storage';
import { t } from '../../i18n';
import { usePageTitle } from '../../components/page-title-context';

const EMPTY_FORM: CreateTrainingJournalInput = {
  sportType: SportTypeEnum.SHOOTING_RIFLE_PISTOL,
};

export default function CreateTrainingJournalPage() {
  usePageTitle(t('journalCreate.title'));
  const [form, setForm] = useState<CreateTrainingJournalInput>(EMPTY_FORM);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingSportTypes, setIsLoadingSportTypes] = useState(true);
  const [availableSportTypes, setAvailableSportTypes] = useState<SportTypeEnum[]>(
    [],
  );
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const token = useMemo(() => getAccessToken(), []);

  useEffect(() => {
    if (!token) {
      setIsLoadingSportTypes(false);
      return;
    }

    let isActive = true;

    const load = async () => {
      setIsLoadingSportTypes(true);
      setError(null);
      try {
        const sportTypes = await getAvailableSportTypes(token);
        if (!isActive) return;
        setAvailableSportTypes(sportTypes);
        if (sportTypes.length > 0) {
          setForm({ sportType: sportTypes[0] });
        }
      } catch (err) {
        if (!isActive) return;
        if (err && typeof err === 'object' && 'message' in err) {
          setError(String((err as { message?: string }).message));
        } else {
          setError(t('journalCreate.error'));
        }
      } finally {
        if (isActive) setIsLoadingSportTypes(false);
      }
    };

    void load();

    return () => {
      isActive = false;
    };
  }, [token]);

  const handleSubmit = async () => {
    if (!token) return;
    if (availableSportTypes.length === 0) return;
    setIsLoading(true);
    setError(null);
    try {
      const created = await createTrainingJournal(token, form);
      const createdId =
        typeof created === 'string' ? created : created?.id ?? '';
      if (!createdId) {
        throw new Error(t('journalCreate.error'));
      }
      navigate(`/journal/${createdId}`);
    } catch (err) {
      if (err && typeof err === 'object' && 'message' in err) {
        setError(String((err as { message?: string }).message));
      } else {
        setError(t('journalCreate.error'));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="page">
      <div className="journal-actions">
        <Link className="button-link ghost" to="/">
          {t('journalCreate.back')}
        </Link>
      </div>

      <form
        className="card form"
        onSubmit={(event) => {
          event.preventDefault();
          void handleSubmit();
        }}
      >
        {isLoadingSportTypes ? (
          <div className="card">{t('journalCreate.loadingSportTypes')}</div>
        ) : availableSportTypes.length === 0 ? (
          <div className="alert success">{t('journalCreate.allCreated')}</div>
        ) : (
          <>
            <label className="field">
              <span>{t('journalCreate.field.sportType')}</span>
              <select
                value={form.sportType}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    sportType: event.target.value as SportTypeEnum,
                  }))
                }
                disabled={isLoading}
              >
                {availableSportTypes.map((sportType) => (
                  <option key={sportType} value={sportType}>
                    {t(`sportType.${sportType}`)}
                  </option>
                ))}
              </select>
            </label>

            <button className="primary" type="submit" disabled={isLoading}>
              {isLoading ? t('journalCreate.creating') : t('journalCreate.create')}
            </button>
          </>
        )}
      </form>

      {error ? <div className="alert error">{error}</div> : null}
    </section>
  );
}
