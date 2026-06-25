import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

const normalizeUser = (userData) => {
  if (!userData) {
    return null;
  }

  const source = userData.user && typeof userData.user === 'object' ? userData.user : userData;

  return {
    ...source,
    _id: source._id || source.userId || null,
    name: source.name || '',
    email: source.email || '',
    role: source.role || 'user',
    verified: Boolean(source.verified),
    token: source.token || '',
  };
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(
    localStorage.getItem('userInfo') ? normalizeUser(JSON.parse(localStorage.getItem('userInfo'))) : null
  );

  const login = (userData) => {
    const normalizedUser = normalizeUser(userData);
    setUser(normalizedUser);
    localStorage.setItem('userInfo', JSON.stringify(normalizedUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('userInfo');
    localStorage.removeItem('cartItems');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
