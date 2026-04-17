import { Link } from 'react-router-dom';
import { usePageTitle } from '../../components/page-title-context';
import { t } from '../../i18n';
import { getLanguage } from '../../i18n';

import privacyEn from './content/en/privacy.md?raw';
import privacyRu from './content/ru/privacy.md?raw';

export default function PrivacyPage() {
  usePageTitle(t('legal.privacy.title'));
  const lang = getLanguage();
  const content = lang === 'ru' ? privacyRu : privacyEn;

  return (
    <section className="page">
      <div className="page-header compact">
        <h1>{t('legal.privacy.title')}</h1>
        <Link className="button-link ghost small" to="/register">
          {t('legal.privacy.back')}
        </Link>
      </div>

      <div className="card">
        <article className="markdown">{content}</article>
      </div>
    </section>
  );
}
