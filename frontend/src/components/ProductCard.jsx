import { Link } from 'react-router-dom';

export default function ProductCard({ product, isDashboard = false, onEdit, onDelete }) {
  return (
    <article className="card">
      <img src={product.image} alt={product.name} className="image-cover" />
      <div className="card-content stack">
        <div>
          <h3 style={{ margin: '0 0 6px' }}>{product.name}</h3>
          <p className="muted" style={{ margin: 0 }}>{product.category} · {product.size}</p>
          <p style={{ margin: '8px 0 0' }}>{Number(product.price).toFixed(2)} €</p>
        </div>

        {!isDashboard ? (
          <Link className="btn secondary" to={`/products/${product._id}`}>
            Ver detalle
          </Link>
        ) : (
          <div className="row">
            <button type="button" className="btn secondary" onClick={() => onEdit(product)}>
              Editar
            </button>
            <button type="button" className="btn danger" onClick={() => onDelete(product._id)}>
              Eliminar
            </button>
          </div>
        )}
      </div>
    </article>
  );
}
