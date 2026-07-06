import { createContext, useContext, useMemo, useState } from 'react';

const AuthContext = createContext(null);

export function getNameFromEmail(email) {
  if (!email) return 'User';
  const localPart = email.split('@')[0];
  return localPart
    .split(/[\._\-]/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

const defaultUser = {
  id: 'demo-user',
  name: 'Aarav Sharma',
  role: 'student',
  email: 'aarav@placementpro.ai',
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('pp_auth_user');
    return stored ? JSON.parse(stored) : defaultUser;
  });
  const [token, setToken] = useState(() => localStorage.getItem('pp_auth_token') || 'demo-token');

  const login = (nextUser, nextToken = 'demo-token') => {
    const email = nextUser.email || `${nextUser.role}@placementpro.ai`;
    const name = nextUser.name || getNameFromEmail(email);
    const resolvedUser = {
      ...nextUser,
      email,
      name,
    };
    setUser(resolvedUser);
    setToken(nextToken);
    localStorage.setItem('pp_auth_user', JSON.stringify(resolvedUser));
    localStorage.setItem('pp_auth_token', nextToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('pp_auth_user');
    localStorage.removeItem('pp_auth_token');
  };

  const value = useMemo(() => ({ user, token, login, logout }), [user, token]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}

