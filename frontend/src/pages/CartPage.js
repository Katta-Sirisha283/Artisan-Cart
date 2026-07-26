import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as api from '../api';
import { useAuth } from '../context/AuthContext';

export default function CartPage() {
  const [items, setItems] = useState([]);
  const [address, setAddress] = useState('');
  const [message, setMessage] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  const loadCart = () => {
    if (!user) return;
    api.getCart().then((res) => setItems(res.data));
  };

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleRemove = async (cartItemId) => {
    await api.removeFromCart(cartItemId);
    loadCart();
  };

  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const handleCheckout = async () => {
    if (!address.trim()) {
      setMessage('Please enter a shipping address.');
      return;
    }
    try {
      await api.checkout(address);
      setMessage('Order placed! Check your order history.');
      setItems([]);
    } catch (e) {
      setMessage(e.response?.data?.message || 'Checkout failed.');
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '700px' }}>
      <h1>Your Cart</h1>
      {items.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          {items.map((item) => (
            <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid #eee' }}>
              <div>
                <strong>{item.product.name}</strong> × {item.quantity}
              </div>
              <div>
                ${(item.product.price * item.quantity).toFixed(2)}
                <button onClick={() => handleRemove(item.id)} style={{ marginLeft: '1rem', cursor: 'pointer' }}>Remove</button>
              </div>
            </div>
          ))}
          <h3 style={{ textAlign: 'right' }}>Total: ${total.toFixed(2)}</h3>

          <input
            placeholder="Shipping address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            style={{ width: '100%', padding: '0.6rem', margin: '1rem 0' }}
          />
          <button
            onClick={handleCheckout}
            style={{ background: '#3d3229', color: '#fff', border: 'none', padding: '0.7rem 1.4rem', borderRadius: '4px', cursor: 'pointer' }}
          >
            Place Order
          </button>
        </>
      )}
      {message && <p style={{ marginTop: '1rem' }}>{message}</p>}
    </div>
  );
}
