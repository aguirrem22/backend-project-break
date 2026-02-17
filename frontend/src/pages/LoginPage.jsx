import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../api';
import { saveAuth } from '../auth';

export default function LoginPage({ onLogin }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await login(form);
      const token = data.token || data.accessToken;
      const user = data.user || null;
      if (!token) throw new Error('La API no devolvió token');

      const authPayload = { token, user };
      saveAuth(authPayload);
      onLogin(authPayload);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="panel" style={{ maxWidth: 460 }}>
      <h1 className="page-title">Login</h1>

      <form onSubmit={handleSubmit} className="stack">
        <label>
          Email
          <input
            className="input"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Password
          <input
            className="input"
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </label>

        {error && <p className="error" style={{ margin: 0 }}>{error}</p>}

        <button type="submit" className="btn" disabled={loading}>
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>

      <p className="muted" style={{ marginBottom: 0 }}>
        ¿No tienes cuenta? <Link to="/register">Crear cuenta</Link>
      </p>
    </section>
  );
}
