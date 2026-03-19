import { Link } from 'react-router-dom';
import { useAuth } from '../features/auth/auth-context';

export default function AppHeader() {
  const { userName, isChecking } = useAuth();

  return (
    <header className="app-header">
      <Link to="/" className="brand">
        Athlink
      </Link>

      <div className="header-actions">
        {isChecking ? (
          <span className="muted">Checking...</span>
        ) : userName ? (
          <span className="user-badge">{userName}</span>
        ) : (
          <Link className="button-link" to="/login">
            Login
          </Link>
        )}
      </div>
    </header>
  );
}
