import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type { CreateCoachProfileInput } from '@shared-types';
import { SportTypeEnum } from '@shared-types';
import { getAccessToken } from '../auth/token-storage';
import { t } from '../../i18n';
import { usePageTitle } from '../../components/page-title-context';
import { getAvailableCoachSportTypes } from '../../api/coaches/get-available-coach-sport-types';
import { createCoachProfile } from '../../api/coaches/create-coach-profile';

const EMPTY_FORM: CreateCoachProfileInput = {
  sportType: SportTypeEnum.SHOOTING_RIFLE_PISTOL,
};

export default function CreateCoachProfilePage() {
  usePageTitle('Стать тренером');
  const [form, setForm] = useState<CreateCoachProfileInput>(EMPTY_FORM);
  const [availableSportTypes, setAvailableSportTypes] = useState<SportTypeEnum[]>([]);
  const [isLoadingSportTypes, setIsLoadingSportTypes] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const token = useMemo(() => getAccessToken(), []);
  const navigate = useNavigate();

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
        const sportTypes = await getAvailableCoachSportTypes(token);
        if (!isActive) return;
        setAvailableSportTypes(sportTypes);
        if (sportTypes.length > 0) setForm({ sportType: sportTypes[0] });
      } catch (err) {
        if (!isActive) return;
        setError(err instanceof Error ? err.message : 'Не удалось загрузить виды спорта.');
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
    if (!token || availableSportTypes.length === 0) return;
    setIsSubmitting(true);
    setError(null);
    try {
      await createCoachProfile(token, form);
      navigate('/');
      window.location.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось создать профиль тренера.');
    } finally {
      setIsSubmitting(false);
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
          <div className="card">Загружаем виды спорта...</div>
        ) : availableSportTypes.length === 0 ? (
          <div className="alert success">
            Вы создали профили тренера для каждого вида спорта.
          </div>
        ) : (
          <>
            <label className="field">
              <span>{t('journalCreate.field.sportType')}</span>
              <select
                value={form.sportType}
                onChange={(event) =>
                  setForm({
                    sportType: event.target.value as SportTypeEnum,
                  })
                }
                disabled={isSubmitting}
              >
                {availableSportTypes.map((sportType) => (
                  <option key={sportType} value={sportType}>
                    {t(`sportType.${sportType}`)}
                  </option>
                ))}
              </select>
            </label>

            <button className="primary" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Создаем...' : 'Создать профиль тренера'}
            </button>
          </>
        )}
      </form>

      {error ? <div className="alert error">{error}</div> : null}
    </section>
  );
}
