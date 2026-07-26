import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as api from '../api';
import { useAuth } from '../context/AuthContext';

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    api.getProduct(id).then((res) => setProduct(res.data));
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    await api.addToCart(product.id, quantity);
    setMessage('Added to cart!');
  };

  if (!product) return <p style={{ padding: '2rem' }}>Loading...</p>;

  return (
    <div style={{ display: 'flex', gap: '2rem', padding: '2rem', flexWrap: 'wrap' }}>
      <img src={product.imageUrl} alt={product.name} style={{ width: '360px', height: '360px', objectFit: 'cover', borderRadius: '8px' }} />
      <div style={{ maxWidth: '480px' }}>
        <h1>{product.name}</h1>
        <p style={{ color: '#8a7f70', textTransform: 'capitalize' }}>{product.category} · {product.material}</p>
        <p style={{ fontSize: '1.4rem', fontWeight: 'bold' }}>${Number(product.price).toFixed(2)}</p>
        <p>{product.description}</p>
        <p style={{ color: product.stockQuantity > 0 ? 'green' : 'crimson' }}>
          {product.stockQuantity > 0 ? `${product.stockQuantity} in stock` : 'Out of stock'}
        </p>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', margin: '1rem 0' }}>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
            style={{ width: '60px', padding: '0.4rem' }}
          />
          <button
            onClick={handleAddToCart}
            disabled={product.stockQuantity === 0}
            style={{ background: '#3d3229', color: '#fff', border: 'none', padding: '0.6rem 1.2rem', borderRadius: '4px', cursor: 'pointer' }}
          >
            Add to Cart
          </button>
        </div>
        {message && <p style={{ color: 'green' }}>{message}</p>}
      </div>
    </div>
  );
}
