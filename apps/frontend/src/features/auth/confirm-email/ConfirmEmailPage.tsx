import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { confirmEmail } from '../../../api/auth/confirm-email';
import type { ApiError } from '../../../api/http';
import { t } from '../../../i18n';
import { usePageTitle } from '../../../components/page-title-context';
import { AccountErrorCodeEnum } from '@shared-types';

type ConfirmState = 'idle' | 'loading' | 'success' | 'error';

const REDIRECT_DELAY_MS = 2500;

const mapConfirmError = (error: ApiError | undefined): string => {
  const details = error?.details;
  if (details && typeof details === 'object' && 'errorMessages' in details) {
    const errorMessages = (details as { errorMessages?: Array<{ code?: string }> })
      .errorMessages;
    const code = errorMessages?.[0]?.code;
    switch (code) {
      case AccountErrorCodeEnum.CODE_ALREADY_CONFIRMED:
        return t('confirmEmail.error.alreadyConfirmed');
      case AccountErrorCodeEnum.CODE_EXPIRED:
        return t('confirmEmail.error.expired');
      case AccountErrorCodeEnum.CODE_INVALID:
      case AccountErrorCodeEnum.CODE_INCORRECT:
        return t('confirmEmail.error.invalid');
      default:
        return t('confirmEmail.error.failed');
    }
  }
  return t('confirmEmail.error.failed');
};

export default function ConfirmEmailPage() {
  usePageTitle(t('confirmEmail.title'));
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const code = useMemo(() => searchParams.get('code') ?? '', [searchParams]);
  const [state, setState] = useState<ConfirmState>('idle');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!code) {
      setState('error');
      setError(t('confirmEmail.error.missing'));
      return;
    }

    let isMounted = true;
    setState('loading');
    setError(null);

    let redirectTimer: ReturnType<typeof setTimeout> | null = null;

    confirmEmail(code)
      .then(() => {
        if (!isMounted) return;
        setState('success');
        setError(null);
        redirectTimer = setTimeout(() => {
          navigate('/login', { replace: true });
        }, REDIRECT_DELAY_MS);
      })
      .catch((err) => {
        if (!isMounted) return;
        const message = mapConfirmError(err as ApiError);
        setState('error');
        setError(message);
      });

    return () => {
      isMounted = false;
      if (redirectTimer) {
        clearTimeout(redirectTimer);
      }
    };
  }, [code, navigate]);

  return (
    <section className="page">
      <div className="journal-actions">
        <Link className="button-link ghost" to="/login">
          {t('confirmEmail.backToLogin')}
        </Link>
      </div>

      <div className="card">
        {state === 'loading' ? <p>{t('confirmEmail.loading')}</p> : null}
        {state === 'success' ? (
          <div className="alert success">
            <p>{t('confirmEmail.success')}</p>
            <p className="subtitle">{t('confirmEmail.redirect')}</p>
          </div>
        ) : null}
        {state === 'error' && error ? (
          <div className="alert error">{error}</div>
        ) : null}
      </div>
    </section>
  );
}
