import { Link } from 'react-router-dom';

export default function NavBar({ isAuthenticated, onLogout }) {
  return (
    <header className="navbar">
      <div className="container navbar-row">
        <Link to="/" style={{ fontWeight: 700 }}>
          Project Break
        </Link>

        <nav className="nav-links">
          <Link to="/">Tienda</Link>
          {isAuthenticated && <Link to="/dashboard">Dashboard</Link>}
          {!isAuthenticated && <Link to="/login">Login</Link>}
          {!isAuthenticated && <Link to="/register">Registro</Link>}
          {isAuthenticated && (
            <button type="button" className="btn secondary" onClick={onLogout}>
              Salir
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
