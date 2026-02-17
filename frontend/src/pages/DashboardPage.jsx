import { useEffect, useMemo, useState } from 'react';
import {
  createProduct,
  deleteProduct,
  getProducts,
  updateProduct
} from '../api';
import ProductCard from '../components/ProductCard';

const emptyForm = {
  name: '',
  description: '',
  image: '',
  category: 'Camisetas',
  size: 'M',
  price: ''
};

export default function DashboardPage({ token }) {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const isEditing = useMemo(() => Boolean(editingId), [editingId]);

  async function loadProducts() {
    setLoading(true);
    setError('');
    try {
      const data = await getProducts();
      setProducts(Array.isArray(data) ? data : data.products || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function startEdit(product) {
    setEditingId(product._id);
    setForm({
      name: product.name || '',
      description: product.description || '',
      image: product.image || '',
      category: product.category || 'Camisetas',
      size: product.size || 'M',
      price: String(product.price ?? '')
    });
    setMessage('');
    setError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function resetForm() {
    setForm(emptyForm);
    setEditingId('');
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError('');
    setMessage('');

    const payload = {
      ...form,
      price: Number(form.price)
    };

    try {
      if (isEditing) {
        await updateProduct(editingId, payload, token);
        setMessage('Producto actualizado correctamente');
      } else {
        await createProduct(payload, token);
        setMessage('Producto creado correctamente');
      }

      resetForm();
      await loadProducts();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(productId) {
    const confirmed = window.confirm('¿Seguro que quieres eliminar este producto?');
    if (!confirmed) return;

    setError('');
    setMessage('');
    try {
      await deleteProduct(productId, token);
      setMessage('Producto eliminado');
      await loadProducts();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <section className="stack">
      <h1 className="page-title">Dashboard</h1>

      <article className="panel">
        <h2 style={{ marginTop: 0 }}>{isEditing ? 'Editar producto' : 'Nuevo producto'}</h2>

        <form onSubmit={handleSubmit} className="form-grid">
          <label>
            Nombre
            <input className="input" name="name" value={form.name} onChange={handleChange} required />
          </label>

          <label>
            Precio
            <input
              className="input"
              type="number"
              step="0.01"
              min="0"
              name="price"
              value={form.price}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Categoría
            <select className="select" name="category" value={form.category} onChange={handleChange} required>
              <option value="Camisetas">Camisetas</option>
              <option value="Pantalones">Pantalones</option>
              <option value="Zapatos">Zapatos</option>
              <option value="Accesorios">Accesorios</option>
            </select>
          </label>

          <label>
            Talla
            <select className="select" name="size" value={form.size} onChange={handleChange} required>
              <option value="XS">XS</option>
              <option value="S">S</option>
              <option value="M">M</option>
              <option value="L">L</option>
              <option value="XL">XL</option>
            </select>
          </label>

          <label className="full">
            URL imagen
            <input className="input" type="url" name="image" value={form.image} onChange={handleChange} required />
          </label>

          <label className="full">
            Descripción
            <textarea className="textarea" name="description" value={form.description} onChange={handleChange} required />
          </label>

          <div className="full row">
            <button type="submit" className="btn" disabled={saving}>
              {saving ? 'Guardando...' : isEditing ? 'Actualizar' : 'Crear'}
            </button>
            {isEditing && (
              <button type="button" className="btn secondary" onClick={resetForm}>
                Cancelar edición
              </button>
            )}
          </div>
        </form>

        {error && <p className="error">{error}</p>}
        {message && <p className="success">{message}</p>}
      </article>

      <article className="stack">
        <h2 style={{ marginBottom: 0 }}>Productos</h2>
        {loading ? (
          <p className="muted">Cargando productos...</p>
        ) : (
          <div className="grid">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                isDashboard
                onEdit={startEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </article>
    </section>
  );
}
