import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.brand}>Handmade &amp; Co.</Link>
      <div style={styles.links}>
        <Link to="/" style={styles.link}>Shop</Link>
        <Link to="/cart" style={styles.link}>Cart</Link>
        {user ? (
          <>
            <Link to="/orders" style={styles.link}>Orders</Link>
            <span style={styles.link}>Hi, {user.fullName || user.email}</span>
            <button onClick={handleLogout} style={styles.button}>Logout</button>
          </>
        ) : (
          <Link to="/login" style={styles.link}>Login</Link>
        )}
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 2rem',
    borderBottom: '1px solid #e5e0da',
    fontFamily: 'Georgia, serif',
  },
  brand: { fontSize: '1.4rem', textDecoration: 'none', color: '#3d3229', fontWeight: 'bold' },
  links: { display: 'flex', gap: '1.25rem', alignItems: 'center' },
  link: { textDecoration: 'none', color: '#3d3229' },
  button: {
    background: '#3d3229',
    color: '#fff',
    border: 'none',
    padding: '0.4rem 0.9rem',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};
