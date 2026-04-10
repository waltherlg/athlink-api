import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { resetPassword } from '../../../api/auth/password-reset';
import type { ApiError } from '../../../api/http';
import { t } from '../../../i18n';
import { usePageTitle } from '../../../components/page-title-context';

export default function PasswordResetPage() {
  usePageTitle(t('passwordReset.title'));
  const [searchParams] = useSearchParams();
  const initialEmail = useMemo(() => searchParams.get('email') ?? '', [searchParams]);
  const initialCode = useMemo(() => searchParams.get('code') ?? '', [searchParams]);

  const [email, setEmail] = useState(initialEmail);
  const [code, setCode] = useState(initialCode);
  const [newPassword, setNewPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    if (!email.trim() || !code.trim() || !newPassword.trim()) return;
    setIsLoading(true);
    setError(null);
    setSuccess(false);
    try {
      await resetPassword({
        email: email.trim(),
        code: code.trim(),
        newPassword,
      });
      setSuccess(true);
    } catch (err) {
      if (err && typeof err === 'object' && 'message' in err) {
        setError(String((err as ApiError).message));
      } else {
        setError(t('passwordReset.error'));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="page">
      <div className="journal-actions">
        <Link className="button-link ghost" to="/login">
          {t('passwordReset.back')}
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
          <span>{t('passwordReset.field.email')}</span>
          <input
            type="email"
            placeholder={t('passwordReset.placeholder.email')}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            autoComplete="email"
          />
        </label>

        <label className="field">
          <span>{t('passwordReset.field.code')}</span>
          <input
            type="text"
            placeholder={t('passwordReset.placeholder.code')}
            value={code}
            onChange={(event) => setCode(event.target.value)}
            required
          />
        </label>

        <label className="field">
          <span>{t('passwordReset.field.password')}</span>
          <input
            type="password"
            placeholder={t('passwordReset.placeholder.password')}
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            required
            minLength={6}
            autoComplete="new-password"
          />
        </label>

        <button className="primary" type="submit" disabled={isLoading}>
          {isLoading ? t('passwordReset.loading') : t('passwordReset.save')}
        </button>
      </form>

      {success ? (
        <div className="alert success">
          <p>{t('passwordReset.success')}</p>
          <Link className="button-link ghost" to="/login">
            {t('passwordReset.toLogin')}
          </Link>
        </div>
      ) : null}
      {error ? <div className="alert error">{error}</div> : null}
    </section>
  );
}
