import { Link } from 'react-router-dom';

export default function ProductCard({ product }) {
  return (
    <Link to={`/products/${product.id}`} style={styles.card}>
      <img src={product.imageUrl} alt={product.name} style={styles.image} />
      <div style={styles.body}>
        <h3 style={styles.name}>{product.name}</h3>
        <p style={styles.category}>{product.category}</p>
        <p style={styles.price}>${Number(product.price).toFixed(2)}</p>
      </div>
    </Link>
  );
}

const styles = {
  card: {
    display: 'block',
    textDecoration: 'none',
    color: 'inherit',
    border: '1px solid #eee',
    borderRadius: '8px',
    overflow: 'hidden',
    transition: 'transform 0.15s ease',
  },
  image: { width: '100%', height: '220px', objectFit: 'cover' },
  body: { padding: '0.75rem 1rem' },
  name: { margin: '0 0 0.25rem', fontSize: '1.05rem' },
  category: { margin: 0, color: '#8a7f70', fontSize: '0.85rem', textTransform: 'capitalize' },
  price: { margin: '0.4rem 0 0', fontWeight: 'bold' },
};
