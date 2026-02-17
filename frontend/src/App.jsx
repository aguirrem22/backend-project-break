import { Navigate, Route, Routes } from 'react-router-dom';
import { useState } from 'react';
import NavBar from './components/NavBar';
import StorePage from './pages/StorePage';
import ProductDetailPage from './pages/ProductDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import { clearAuth, getAuth } from './auth';

function ProtectedRoute({ isAuthenticated, children }) {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default function App() {
  const [auth, setAuth] = useState(getAuth());

  function handleLogout() {
    clearAuth();
    setAuth(null);
  }

  return (
    <>
      <NavBar isAuthenticated={Boolean(auth?.token)} onLogout={handleLogout} />
      <main className="main container">
        <Routes>
          <Route path="/" element={<StorePage />} />
          <Route path="/products/:productId" element={<ProductDetailPage />} />
          <Route
            path="/login"
            element={auth?.token ? <Navigate to="/dashboard" replace /> : <LoginPage onLogin={setAuth} />}
          />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute isAuthenticated={Boolean(auth?.token)}>
                <DashboardPage token={auth?.token} />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </>
  );
}
