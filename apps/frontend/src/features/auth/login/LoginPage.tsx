import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type { LoginInput } from '@shared-types';
import { useAuth } from '../auth-context';
import { t } from '../../../i18n';
import { usePageTitle } from '../../../components/page-title-context';

const DEFAULT_FORM: LoginInput = {
  email: '',
  password: '',
};

export default function LoginPage() {
  usePageTitle(t('login.title'));
  const [form, setForm] = useState<LoginInput>(DEFAULT_FORM);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await login(form);
      navigate('/');
    } catch (err) {
      if (err && typeof err === 'object' && 'status' in err) {
        const status = Number((err as { status?: number }).status);
        if (status === 401 || status === 400) {
          setError(t('login.invalid'));
        } else {
          setError(t('login.failed'));
        }
      } else if (err && typeof err === 'object' && 'message' in err) {
        setError(String((err as { message?: string }).message));
      } else {
        setError(t('login.failed'));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="page">
      <p className="subtitle">{t('login.subtitle')}</p>

      <form className="card form" onSubmit={handleSubmit}>
        <label className="field">
          <span>{t('login.field.email')}</span>
          <input
            type="email"
            name="email"
            placeholder={t('login.placeholder.email')}
            value={form.email}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, email: event.target.value }))
            }
            required
            autoComplete="email"
          />
        </label>

        <label className="field">
          <span>{t('login.field.password')}</span>
          <input
            type="password"
            name="password"
            placeholder={t('login.placeholder.password')}
            value={form.password}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, password: event.target.value }))
            }
            required
            minLength={6}
            autoComplete="current-password"
          />
        </label>

        <button className="primary" type="submit" disabled={isLoading}>
          {isLoading ? t('login.loading') : t('login.button')}
        </button>
      </form>

      {error ? <div className="alert error">{error}</div> : null}

      <p className="footer-note">
        {t('login.noAccount')}{' '}
        <Link to="/register">{t('login.createOne')}</Link>
      </p>
    </section>
  );
}
