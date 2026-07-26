import { useEffect, useState } from 'react';
import * as api from '../api';
import ProductCard from '../components/ProductCard';

export default function ShopPage() {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.getProducts(category ? { category } : {})
      .then((res) => setProducts(res.data))
      .finally(() => setLoading(false));
  }, [category]);

  return (
    <div style={{ padding: '1.5rem 2rem' }}>
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
        {['', 'ceramics', 'jewelry'].map((c) => (
          <button
            key={c || 'all'}
            onClick={() => setCategory(c)}
            style={{
              padding: '0.4rem 0.9rem',
              borderRadius: '999px',
              border: '1px solid #3d3229',
              background: category === c ? '#3d3229' : 'transparent',
              color: category === c ? '#fff' : '#3d3229',
              cursor: 'pointer',
              textTransform: 'capitalize',
            }}
          >
            {c || 'All'}
          </button>
        ))}
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.25rem' }}>
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
