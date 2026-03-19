import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import AppHeader from './components/AppHeader';
import { AuthProvider } from './features/auth/auth-context';
import LoginPage from './features/auth/login/LoginPage';
import RegistrationPage from './features/auth/registration/RegistrationPage';
import HomePage from './features/home/HomePage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <main className="app">
          <AppHeader />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegistrationPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </AuthProvider>
    </BrowserRouter>
  );
}
