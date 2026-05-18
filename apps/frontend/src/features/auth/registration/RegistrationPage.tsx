import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../../../api/auth/registration';
import type { UserRegistrationInput } from '@shared-types';
import RegistrationForm from './RegistrationForm';
import { normalizeApiFormErrors } from '../../../api/errors';
import type { FormErrors } from '../../../api/errors';
import { t } from '../../../i18n';
import { usePageTitle } from '../../../components/page-title-context';

type FieldKey = keyof UserRegistrationInput;

const EMPTY_ERRORS: FormErrors<FieldKey> = { fieldErrors: {}, globalErrors: [] };
const FALLBACK_MESSAGE = t('register.failed');
const FORM_FIELDS = ['email', 'userName', 'password'] as const;

export default function RegistrationPage() {
  usePageTitle(t('register.title'));
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors<FieldKey>>(EMPTY_ERRORS);
  const navigate = useNavigate();

  const handleSubmit = async (input: UserRegistrationInput) => {
    setIsLoading(true);
    setErrors(EMPTY_ERRORS);
    try {
      await registerUser(input);
      navigate('/login?registered=1');
    } catch (err) {
      setErrors(normalizeApiFormErrors(err, FORM_FIELDS, FALLBACK_MESSAGE));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="page">
      <p className="subtitle">{t('register.subtitle')}</p>

      <RegistrationForm
        onSubmit={handleSubmit}
        isLoading={isLoading}
        errors={errors}
      />
    </section>
  );
}
