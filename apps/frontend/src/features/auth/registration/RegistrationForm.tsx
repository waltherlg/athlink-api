import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import type { UserRegistrationInput } from '@shared-types';

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
  const fieldErrors = errors?.fieldErrors ?? {};
  const globalErrors = errors?.globalErrors ?? [];

  const handleChange = (field: keyof UserRegistrationInput) => {
    return (event: ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: event.target.value }));
    };
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(form);
  };

  return (
    <form className="card form" onSubmit={handleSubmit}>
      {globalErrors.length > 0 ? (
        <div className="alert error">
          {globalErrors.map((message, index) => (
            <p key={`${message}-${index}`}>{message}</p>
          ))}
        </div>
      ) : null}
      <label className="field">
        <span>Email</span>
        <input
          type="email"
          name="email"
          placeholder="email@abc.com"
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

      <label className="field">
        <span>Username</span>
        <input
          type="text"
          name="userName"
          placeholder="newUserName"
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

      <label className="field">
        <span>Password</span>
        <input
          type="password"
          name="password"
          placeholder="some123PASSWORD"
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

      <button className="primary" type="submit" disabled={isLoading}>
        {isLoading ? 'Creating account...' : 'Create account'}
      </button>
    </form>
  );
}
