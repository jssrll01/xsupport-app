import React, { createContext, useContext, useEffect, useState } from 'react';

const KEY = 'xsupport_access';
const CODE = '1010';

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem(KEY);
    setUser(saved === 'ok' ? { role: 'admin' } : null);
    setLoading(false);
  }, []);

  const signIn = (code) => {
    if (code === CODE) {
      localStorage.setItem(KEY, 'ok');
      setUser({ role: 'admin' });
      return { ok: true };
    }
    return { ok: false, error: 'Invalid access code' };
  };

  const signOut = () => {
    localStorage.removeItem(KEY);
    setUser(null);
  };

  return (
    <AuthCtx.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthCtx.Provider>
  );
}

export const useAuth = () => useContext(AuthCtx);
