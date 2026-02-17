import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getProductById } from '../api';

export default function ProductDetailPage() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadProduct() {
      setLoading(true);
      setError('');
      try {
        const data = await getProductById(productId);
        setProduct(data.product || data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [productId]);

  if (loading) return <p className="muted">Cargando detalle...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!product) return <p className="muted">Producto no encontrado.</p>;

  return (
    <section className="panel stack">
      <Link to="/" className="btn secondary" style={{ width: 'fit-content' }}>
        ← Volver
      </Link>
      <img src={product.image} alt={product.name} className="image-cover" style={{ maxHeight: 420 }} />
      <h1 style={{ margin: 0 }}>{product.name}</h1>
      <p className="muted" style={{ margin: 0 }}>{product.category} · {product.size}</p>
      <p style={{ margin: 0 }}>{product.description}</p>
      <p style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>{Number(product.price).toFixed(2)} €</p>
    </section>
  );
}
