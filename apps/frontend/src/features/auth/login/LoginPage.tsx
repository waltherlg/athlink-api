import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type { LoginInput } from '@shared-types';
import { useAuth } from '../auth-context';

const DEFAULT_FORM: LoginInput = {
  email: '',
  password: '',
};

export default function LoginPage() {
  const [form, setForm] = useState<LoginInput>(DEFAULT_FORM);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await login(form);
      navigate('/');
    } catch (err) {
      if (err && typeof err === 'object' && 'status' in err) {
        const status = Number((err as { status?: number }).status);
        if (status === 401 || status === 400) {
          setError('Invalid credentials.');
        } else {
          setError('Login failed. Please try again.');
        }
      } else if (err && typeof err === 'object' && 'message' in err) {
        setError(String((err as { message?: string }).message));
      } else {
        setError('Login failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="page">
      <header className="page-header">
        <p className="eyebrow">Athlink Auth</p>
        <h1>Sign in</h1>
        <p className="subtitle">Use your email and password.</p>
      </header>

      <form className="card form" onSubmit={handleSubmit}>
        <label className="field">
          <span>Email</span>
          <input
            type="email"
            name="email"
            placeholder="email@abc.com"
            value={form.email}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, email: event.target.value }))
            }
            required
            autoComplete="email"
          />
        </label>

        <label className="field">
          <span>Password</span>
          <input
            type="password"
            name="password"
            placeholder="some123PASSWORD"
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
          {isLoading ? 'Signing in...' : 'Login'}
        </button>
      </form>

      {error ? <div className="alert error">{error}</div> : null}

      <p className="footer-note">
        Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
      </p>
    </section>
  );
}
