import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await register(email, password, fullName);
      }
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong.');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '3rem auto', padding: '2rem', border: '1px solid #eee', borderRadius: '8px' }}>
      <h1>{mode === 'login' ? 'Log In' : 'Create Account'}</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {mode === 'register' && (
          <input
            placeholder="Full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            style={{ padding: '0.6rem' }}
          />
        )}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ padding: '0.6rem' }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ padding: '0.6rem' }}
        />
        {error && <p style={{ color: 'crimson' }}>{error}</p>}
        <button
          type="submit"
          style={{ background: '#3d3229', color: '#fff', border: 'none', padding: '0.7rem', borderRadius: '4px', cursor: 'pointer' }}
        >
          {mode === 'login' ? 'Log In' : 'Create Account'}
        </button>
      </form>
      <p style={{ marginTop: '1rem' }}>
        {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
        <button
          onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
          style={{ background: 'none', border: 'none', color: '#3d3229', textDecoration: 'underline', cursor: 'pointer', padding: 0 }}
        >
          {mode === 'login' ? 'Sign up' : 'Log in'}
        </button>
      </p>
    </div>
  );
}
