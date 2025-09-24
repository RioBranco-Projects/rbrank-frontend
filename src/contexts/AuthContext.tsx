import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Professor } from '../types';

interface AuthContextType {
  professor: Professor | null;
  login: (professor: Professor) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [professor, setProfessor] = useState<Professor | null>(null);

  useEffect(() => {
    // Verificar se há um professor logado no localStorage
    const savedProfessor = localStorage.getItem('professor');
    const savedToken = localStorage.getItem('professorToken');

    if (savedProfessor && savedToken) {
      try {
        const professorData = JSON.parse(savedProfessor);
        setProfessor({ ...professorData, token: savedToken });
      } catch (error) {
        console.error('Erro ao carregar dados do professor:', error);
        localStorage.removeItem('professor');
        localStorage.removeItem('professorToken');
      }
    }
  }, []);

  const login = (professorData: Professor) => {
    setProfessor(professorData);
    localStorage.setItem('professor', JSON.stringify({
      _id: professorData._id,
      nome: professorData.nome
    }));
    if (professorData.token) {
      localStorage.setItem('professorToken', professorData.token);
    }
  };

  const logout = () => {
    setProfessor(null);
    localStorage.removeItem('professor');
    localStorage.removeItem('professorToken');
  };

  const value = {
    professor,
    login,
    logout,
    isAuthenticated: !!professor
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

