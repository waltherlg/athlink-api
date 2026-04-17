import { Link } from 'react-router-dom';
import { usePageTitle } from '../../components/page-title-context';
import { t } from '../../i18n';
import { getLanguage } from '../../i18n';

import termsEn from './content/en/terms.md?raw';
import termsRu from './content/ru/terms.md?raw';

export default function TermsPage() {
  usePageTitle(t('legal.terms.title'));
  const lang = getLanguage();
  const content = lang === 'ru' ? termsRu : termsEn;

  return (
    <section className="page">
      <div className="page-header compact">
        <h1>{t('legal.terms.title')}</h1>
        <Link className="button-link ghost small" to="/register">
          {t('legal.terms.back')}
        </Link>
      </div>

      <div className="card">
        <article className="markdown">{content}</article>
      </div>
    </section>
  );
}
