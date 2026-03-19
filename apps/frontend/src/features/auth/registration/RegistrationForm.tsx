import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import type { UserRegistrationInput } from '@shared-types';

type RegistrationFormProps = {
  onSubmit: (input: UserRegistrationInput) => void;
  isLoading: boolean;
};

const DEFAULT_FORM: UserRegistrationInput = {
  email: '',
  userName: '',
  password: '',
};

export default function RegistrationForm({
  onSubmit,
  isLoading,
}: RegistrationFormProps) {
  const [form, setForm] = useState<UserRegistrationInput>(DEFAULT_FORM);

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
      </label>

      <button className="primary" type="submit" disabled={isLoading}>
        {isLoading ? 'Creating account...' : 'Create account'}
      </button>
    </form>
  );
}
