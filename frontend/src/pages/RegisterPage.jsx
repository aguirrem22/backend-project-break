import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../api';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await register(form);
      setSuccess('Usuario creado correctamente. Ahora puedes iniciar sesión.');
      setTimeout(() => navigate('/login'), 900);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="panel" style={{ maxWidth: 460 }}>
      <h1 className="page-title">Registro</h1>

      <form onSubmit={handleSubmit} className="stack">
        <label>
          Nombre
          <input className="input" name="name" value={form.name} onChange={handleChange} required />
        </label>

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
        {success && <p className="success" style={{ margin: 0 }}>{success}</p>}

        <button type="submit" className="btn" disabled={loading}>
          {loading ? 'Creando...' : 'Crear cuenta'}
        </button>
      </form>

      <p className="muted" style={{ marginBottom: 0 }}>
        ¿Ya tienes cuenta? <Link to="/login">Iniciar sesión</Link>
      </p>
    </section>
  );
}
