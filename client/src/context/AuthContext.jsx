import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => {
    const saved = localStorage.getItem('catalyst-auth');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (auth) {
      localStorage.setItem('catalyst-auth', JSON.stringify(auth));
    } else {
      localStorage.removeItem('catalyst-auth');
    }
  }, [auth]);

  const login = (token, user) => setAuth({ token, user });
  const logout = () => setAuth(null);

  return (
    <AuthContext.Provider value={{ ...auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
