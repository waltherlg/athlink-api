import { useAuth } from '../auth/auth-context';

export default function HomePage() {
  const { userName } = useAuth();

  return (
    <section className="page">
      <header className="page-header">
        <p className="eyebrow">Athlink Auth</p>
        <h1>Welcome back</h1>
        <p className="subtitle">
          {userName
            ? `Signed in as ${userName}.`
            : 'Log in to continue your Athlink journey.'}
        </p>
      </header>
    </section>
  );
}
