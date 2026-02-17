import { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';
import { getProducts } from '../api';

const categories = ['', 'Camisetas', 'Pantalones', 'Zapatos', 'Accesorios'];

export default function StorePage() {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      setError('');
      try {
        const data = await getProducts(category);
        setProducts(Array.isArray(data) ? data : data.products || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, [category]);

  return (
    <section className="stack">
      <h1 className="page-title">Tienda</h1>

      <label>
        Filtrar por categoría
        <select className="select" value={category} onChange={(e) => setCategory(e.target.value)}>
          {categories.map((item) => (
            <option key={item || 'all'} value={item}>
              {item || 'Todas'}
            </option>
          ))}
        </select>
      </label>

      {loading && <p className="muted">Cargando productos...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && !error && (
        <div className="grid">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}
