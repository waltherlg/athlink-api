import { t } from '../../i18n';
import type { BackendStatus } from './useBackendStatus';

type Props = {
  status: BackendStatus;
};

export function BackendStatusIndicator({ status }: Props) {
  const label =
    status === 'checking'
      ? t('header.backend.checking')
      : status === 'awake'
        ? t('header.backend.awake')
        : status === 'waking'
          ? t('header.backend.waking')
          : t('header.backend.error');

  const colorClass =
    status === 'checking'
      ? 'is-checking'
      : status === 'awake'
        ? 'is-awake'
        : status === 'waking'
          ? 'is-waking'
          : 'is-error';

  return (
    <div className="backend-status" title={label}>
      <span className={`backend-dot ${colorClass}`} aria-hidden="true" />
      <span className="backend-label">{label}</span>
      <span className="backend-help" title={t('header.backend.help')}>
        ?
      </span>
    </div>
  );
}

