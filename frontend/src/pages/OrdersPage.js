import { useEffect, useState } from 'react';
import * as api from '../api';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api.getOrders().then((res) => setOrders(res.data));
  }, []);

  return (
    <div style={{ padding: '2rem', maxWidth: '700px' }}>
      <h1>Order History</h1>
      {orders.length === 0 ? (
        <p>You haven't placed any orders yet.</p>
      ) : (
        orders.map((order) => (
          <div key={order.id} style={{ border: '1px solid #eee', borderRadius: '8px', padding: '1rem', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <strong>Order #{order.id}</strong>
              <span>{order.status}</span>
            </div>
            <p style={{ color: '#8a7f70' }}>{new Date(order.createdAt).toLocaleString()}</p>
            <ul>
              {order.items.map((item) => (
                <li key={item.id}>{item.product.name} × {item.quantity}</li>
              ))}
            </ul>
            <p style={{ fontWeight: 'bold' }}>Total: ${Number(order.totalAmount).toFixed(2)}</p>
          </div>
        ))
      )}
    </div>
  );
}
