import { createContext, useContext, useState } from 'react';
import * as api from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const email = localStorage.getItem('userEmail');
    const fullName = localStorage.getItem('userFullName');
    return email ? { email, fullName } : null;
  });

  const login = async (email, password) => {
    const res = await api.login({ email, password });
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('userEmail', res.data.email);
    localStorage.setItem('userFullName', res.data.fullName);
    setUser({ email: res.data.email, fullName: res.data.fullName });
  };

  const register = async (email, password, fullName) => {
    const res = await api.register({ email, password, fullName });
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('userEmail', res.data.email);
    localStorage.setItem('userFullName', res.data.fullName);
    setUser({ email: res.data.email, fullName: res.data.fullName });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userFullName');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
