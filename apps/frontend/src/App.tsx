import type { ReactNode } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import AppHeader from './components/AppHeader';
import { PageTitleProvider } from './components/page-title-context';
import { AuthProvider, useAuth } from './features/auth/auth-context';
import { t } from './i18n';
import LoginPage from './features/auth/login/LoginPage';
import RegistrationPage from './features/auth/registration/RegistrationPage';
import ConfirmEmailPage from './features/auth/confirm-email/ConfirmEmailPage';
import PasswordRecoveryPage from './features/auth/password-recovery/PasswordRecoveryPage';
import DashboardPage from './features/dashboard/DashboardPage';
import TrainingJournalPage from './features/training-journals/TrainingJournalPage';
import CreateTrainingJournalPage from './features/training-journals/CreateTrainingJournalPage';
import CreateTrainingRecordPage from './features/training-journals/CreateTrainingRecordPage';
import TrainingRecordsPage from './features/training-journals/TrainingRecordsPage';
import TrainingRecordPage from './features/training-journals/TrainingRecordPage';

function RequireAuth({ children }: { children: ReactNode }) {
  const { userName, isChecking } = useAuth();
  if (isChecking) {
    return (
      <section className="page">
        <div className="card">{t('auth.checking')}</div>
      </section>
    );
  }
  if (!userName) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

function RedirectIfAuth({ children }: { children: ReactNode }) {
  const { userName, isChecking } = useAuth();
  if (isChecking) {
    return (
      <section className="page">
        <div className="card">{t('auth.checking')}</div>
      </section>
    );
  }
  if (userName) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <PageTitleProvider>
          <div className="app-shell">
            <AppHeader />
            <main className="app">
              <Routes>
                <Route
                  path="/"
                  element={
                    <RequireAuth>
                      <DashboardPage />
                    </RequireAuth>
                  }
                />
                <Route
                  path="/login"
                  element={
                    <RedirectIfAuth>
                      <LoginPage />
                    </RedirectIfAuth>
                  }
                />
                <Route
                  path="/confirm-email"
                  element={
                    <RedirectIfAuth>
                      <ConfirmEmailPage />
                    </RedirectIfAuth>
                  }
                />
                <Route
                  path="/password-recovery"
                  element={
                    <RedirectIfAuth>
                      <PasswordRecoveryPage />
                    </RedirectIfAuth>
                  }
                />
                <Route
                  path="/register"
                  element={
                    <RedirectIfAuth>
                      <RegistrationPage />
                    </RedirectIfAuth>
                  }
                />
                <Route
                  path="/journal/:trainingJournalId"
                  element={
                    <RequireAuth>
                      <TrainingJournalPage />
                    </RequireAuth>
                  }
                />
                <Route
                  path="/journal/new"
                  element={
                    <RequireAuth>
                      <CreateTrainingJournalPage />
                    </RequireAuth>
                  }
                />
                <Route
                  path="/journal/:trainingJournalId/new-record"
                  element={
                    <RequireAuth>
                      <CreateTrainingRecordPage />
                    </RequireAuth>
                  }
                />
                <Route
                  path="/journal/:trainingJournalId/records"
                  element={
                    <RequireAuth>
                      <TrainingRecordsPage />
                    </RequireAuth>
                  }
                />
                <Route
                  path="/journal/:trainingJournalId/records/:recordId"
                  element={
                    <RequireAuth>
                      <TrainingRecordPage />
                    </RequireAuth>
                  }
                />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
          </div>
        </PageTitleProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
