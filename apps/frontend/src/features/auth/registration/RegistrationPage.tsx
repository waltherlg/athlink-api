import { useState } from 'react';
import { registerUser } from '../../../api/auth/registration';
import type {
  UserRegistrationInput,
  UserView,
} from '@shared-types/accounts';
import RegistrationForm from './RegistrationForm';

export default function RegistrationPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<UserView | null>(null);

  const handleSubmit = async (input: UserRegistrationInput) => {
    setIsLoading(true);
    setError(null);
    setResult(null);
    try {
      const response = await registerUser(input);
      setResult(response);
    } catch (err) {
      if (err && typeof err === 'object' && 'message' in err) {
        setError(String((err as { message?: string }).message));
      } else {
        setError('Registration failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="page">
      <header className="page-header">
        <p className="eyebrow">Athlink Auth</p>
        <h1>Create your account</h1>
        <p className="subtitle">Register with email, username, and password.</p>
      </header>

      <RegistrationForm onSubmit={handleSubmit} isLoading={isLoading} />

      {error ? <div className="alert error">{error}</div> : null}

      {result ? (
        <div className="card result">
          <h2>Response</h2>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      ) : null}
    </section>
  );
}
