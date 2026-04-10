import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import type { LoginInput } from '@shared-types';
import { AccountErrorCodeEnum } from '@shared-types';
import { useAuth } from '../auth-context';
import { resendConfirmation } from '../../../api/auth/resend-confirmation';
import type { ApiError } from '../../../api/http';
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
  const [needsConfirmation, setNeedsConfirmation] = useState(false);
  const [resendStatus, setResendStatus] = useState<'idle' | 'loading' | 'sent'>(
    'idle',
  );
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, authError } = useAuth();

  useEffect(() => {
    if (authError === 'unauthorized') {
      setError(t('auth.unauthorized'));
    }
  }, [authError]);

  const showRegistrationNotice = searchParams.get('registered') === '1';

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    setNeedsConfirmation(false);
    setResendStatus('idle');
    try {
      await login(form);
      navigate('/');
    } catch (err) {
      if (err && typeof err === 'object' && 'status' in err) {
        const status = Number((err as { status?: number }).status);
        if (status === 401 || status === 400) {
          const details = (err as ApiError).details;
          const errorMessages =
            details &&
            typeof details === 'object' &&
            'errorMessages' in details
              ? (details as { errorMessages?: Array<{ code?: string }> })
                  .errorMessages
              : null;
          const code = errorMessages?.[0]?.code;
          if (code === AccountErrorCodeEnum.EMAIL_NOT_CONFIRMED) {
            setNeedsConfirmation(true);
            setError(t('login.notConfirmed'));
          } else {
            setError(t('login.invalid'));
          }
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

      {showRegistrationNotice ? (
        <div className="alert success">{t('login.registered')}</div>
      ) : null}

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

      {needsConfirmation ? (
        <div className="card">
          <p className="subtitle">{t('login.confirmHint')}</p>
          <button
            className="button-link"
            type="button"
            disabled={resendStatus === 'loading' || !form.email}
            onClick={async () => {
              if (!form.email) return;
              setResendStatus('loading');
              try {
                await resendConfirmation({ email: form.email });
                setResendStatus('sent');
              } catch {
                setResendStatus('idle');
              }
            }}
          >
            {resendStatus === 'loading'
              ? t('login.resendLoading')
              : t('login.resend')}
          </button>
          {resendStatus === 'sent' ? (
            <p className="subtitle">{t('login.resendSuccess')}</p>
          ) : null}
        </div>
      ) : null}

      <p className="footer-note">
        {t('login.noAccount')}{' '}
        <Link to="/register">{t('login.createOne')}</Link>
      </p>

      <p className="footer-note">
        {t('login.forgotPassword')}{' '}
        <Link to="/password-recovery">{t('login.recover')}</Link>
      </p>
    </section>
  );
}
