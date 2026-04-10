import { useState } from 'react';
import { Link } from 'react-router-dom';
import { requestPasswordRecovery } from '../../../api/auth/password-recovery';
import type { ApiError } from '../../../api/http';
import { t } from '../../../i18n';
import { usePageTitle } from '../../../components/page-title-context';

const DEFAULT_EMAIL = '';

export default function PasswordRecoveryPage() {
  usePageTitle(t('passwordRecovery.title'));
  const [email, setEmail] = useState(DEFAULT_EMAIL);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    if (!email.trim()) return;
    setIsLoading(true);
    setError(null);
    setSuccess(false);
    try {
      await requestPasswordRecovery({ email: email.trim() });
      setSuccess(true);
    } catch (err) {
      if (err && typeof err === 'object' && 'message' in err) {
        setError(String((err as ApiError).message));
      } else {
        setError(t('passwordRecovery.error'));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="page">
      <div className="journal-actions">
        <Link className="button-link ghost" to="/login">
          {t('passwordRecovery.back')}
        </Link>
      </div>

      <form
        className="card form"
        onSubmit={(event) => {
          event.preventDefault();
          void handleSubmit();
        }}
      >
        <label className="field">
          <span>{t('passwordRecovery.field.email')}</span>
          <input
            type="email"
            placeholder={t('passwordRecovery.placeholder.email')}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            autoComplete="email"
          />
        </label>

        <button className="primary" type="submit" disabled={isLoading}>
          {isLoading
            ? t('passwordRecovery.loading')
            : t('passwordRecovery.send')}
        </button>
      </form>

      {success ? (
        <div className="alert success">{t('passwordRecovery.success')}</div>
      ) : null}
      {error ? <div className="alert error">{error}</div> : null}
    </section>
  );
}
