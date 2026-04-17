import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import type { UserRegistrationInput } from '@shared-types';
import { Link } from 'react-router-dom';
import { t } from '../../../i18n';

type RegistrationFormProps = {
  onSubmit: (input: UserRegistrationInput) => void;
  isLoading: boolean;
  errors?: {
    fieldErrors?: Partial<Record<keyof UserRegistrationInput, string[]>>;
    globalErrors?: string[];
  };
};

const DEFAULT_FORM: UserRegistrationInput = {
  email: '',
  userName: '',
  password: '',
};

export default function RegistrationForm({
  onSubmit,
  isLoading,
  errors,
}: RegistrationFormProps) {
  const [form, setForm] = useState<UserRegistrationInput>(DEFAULT_FORM);
  const [agreeTos, setAgreeTos] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [confirmAge, setConfirmAge] = useState(false);
  const fieldErrors = errors?.fieldErrors ?? {};
  const globalErrors = errors?.globalErrors ?? [];

  const handleChange = (field: keyof UserRegistrationInput) => {
    return (event: ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: event.target.value }));
    };
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!agreeTos || !agreePrivacy || !confirmAge) return;
    onSubmit(form);
  };

  const isAgreementsValid = agreeTos && agreePrivacy && confirmAge;

  return (
    <form className="card form" onSubmit={handleSubmit}>
      {globalErrors.length > 0 ? (
        <div className="alert error">
          {globalErrors.map((message, index) => (
            <p key={`${message}-${index}`}>{message}</p>
          ))}
        </div>
      ) : null}
      <label className={`field ${fieldErrors.email?.length ? 'has-error' : ''}`}>
        <span>{t('register.field.email')}</span>
        <input
          type="email"
          name="email"
          placeholder={t('register.placeholder.email')}
          value={form.email}
          onChange={handleChange('email')}
          required
          autoComplete="email"
        />
        {fieldErrors.email?.map((message, index) => (
          <span className="field-error" key={`email-${index}`}>
            {message}
          </span>
        ))}
      </label>

      <label
        className={`field ${fieldErrors.userName?.length ? 'has-error' : ''}`}
      >
        <span>{t('register.field.username')}</span>
        <input
          type="text"
          name="userName"
          placeholder={t('register.placeholder.username')}
          value={form.userName}
          onChange={handleChange('userName')}
          minLength={3}
          maxLength={20}
          required
          autoComplete="username"
        />
        {fieldErrors.userName?.map((message, index) => (
          <span className="field-error" key={`userName-${index}`}>
            {message}
          </span>
        ))}
      </label>

      <label
        className={`field ${fieldErrors.password?.length ? 'has-error' : ''}`}
      >
        <span>{t('register.field.password')}</span>
        <input
          type="password"
          name="password"
          placeholder={t('register.placeholder.password')}
          value={form.password}
          onChange={handleChange('password')}
          minLength={6}
          required
          autoComplete="new-password"
        />
        {fieldErrors.password?.map((message, index) => (
          <span className="field-error" key={`password-${index}`}>
            {message}
          </span>
        ))}
      </label>

      <div className="agreement-block">
        <p className="agreement-hint">{t('register.agreement.hint')}</p>

        <label className="checkbox-row">
          <input
            type="checkbox"
            checked={agreeTos}
            onChange={(e) => setAgreeTos(e.target.checked)}
            required
          />
          <span>
            <Link className="inline-link" to="/terms">
              {t('register.agreement.tos')}
            </Link>
          </span>
        </label>

        <label className="checkbox-row">
          <input
            type="checkbox"
            checked={agreePrivacy}
            onChange={(e) => setAgreePrivacy(e.target.checked)}
            required
          />
          <span>
            <Link className="inline-link" to="/privacy">
              {t('register.agreement.privacy')}
            </Link>
          </span>
        </label>

        <label className="checkbox-row">
          <input
            type="checkbox"
            checked={confirmAge}
            onChange={(e) => setConfirmAge(e.target.checked)}
            required
          />
          <span>{t('register.agreement.age')}</span>
        </label>
      </div>

      <button
        className="primary"
        type="submit"
        disabled={isLoading || !isAgreementsValid}
      >
        {isLoading ? t('register.loading') : t('register.button')}
      </button>
    </form>
  );
}
