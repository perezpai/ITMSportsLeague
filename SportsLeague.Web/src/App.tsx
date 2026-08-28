import { Navigate, Route, BrowserRouter, Routes } from 'react-router-dom';
import { AuthProvider } from './auth/AuthContext';
import { ProtectedRoute } from './auth/ProtectedRoute';
import { Layout } from './components/Layout';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { StandingsPage } from './pages/StandingsPage';
import { MatchesPage } from './pages/MatchesPage';
import { UsersPage } from './pages/UsersPage';
import { TeamsPage } from './pages/crud/TeamsPage';
import { PlayersPage } from './pages/crud/PlayersPage';
import { RefereesPage } from './pages/crud/RefereesPage';
import { SponsorsPage } from './pages/crud/SponsorsPage';
import { TournamentsPage } from './pages/crud/TournamentsPage';

function Protected({ children, roles }: { children: React.ReactNode; roles?: ('Admin' | 'Manager' | 'Referee' | 'Viewer')[] }) {
  return (
    <ProtectedRoute roles={roles}>
      <Layout>{children}</Layout>
    </ProtectedRoute>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route path="/" element={<Protected><DashboardPage /></Protected>} />
          <Route path="/standings" element={<Protected><StandingsPage /></Protected>} />
          <Route path="/matches" element={<Protected><MatchesPage /></Protected>} />
          <Route path="/teams" element={<Protected><TeamsPage /></Protected>} />
          <Route path="/players" element={<Protected><PlayersPage /></Protected>} />
          <Route path="/referees" element={<Protected><RefereesPage /></Protected>} />
          <Route path="/sponsors" element={<Protected><SponsorsPage /></Protected>} />
          <Route path="/tournaments" element={<Protected><TournamentsPage /></Protected>} />
          <Route
            path="/users"
            element={
              <Protected roles={['Admin']}>
                <UsersPage />
              </Protected>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
