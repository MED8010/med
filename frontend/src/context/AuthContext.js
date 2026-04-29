import React, { createContext, useState, useEffect } from 'react';
import apiClient from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Vérifier le token au chargement
    if (token) {
      apiClient.get('/auth/profile')
        .then(response => {
          setUser(response.data);
        })
        .catch(error => {
          console.error('Erreur de profil:', error);
          localStorage.removeItem('token');
          setToken(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = async (email, password) => {
    try {
      const response = await apiClient.post('/auth/login', { email, password });
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      setToken(token);
      setUser(user);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur de connexion' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const register = async (email, password, nom, prenom, matricule, service, uap, prix_heure) => {
    try {
      const response = await apiClient.post('/auth/register', {
        email,
        password,
        nom,
        prenom,
        matricule,
        service,
        uap,
        prix_heure,
      });
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      setToken(token);
      setUser(user);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur d\'inscription' };
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, register, setUser, setToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  return context;
};

// FOR TESTING ONLY: Mock auth state
if (process.env.REACT_APP_MOCK_AUTH === 'true') {
  window.mockAuth = (role) => {
    const mockUser = {
      role: role || 'admin',
      email: 'admin@rh.app',
      employe: { prenom: 'Admin', nom: 'System', matricule: 'ADM001' }
    };
    localStorage.setItem('token', 'mock-token');
    // We would need to trigger a re-render or state update here
    console.log('Mock auth set for role:', role);
  };
}
