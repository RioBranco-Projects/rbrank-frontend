import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LogOut, Trophy, Code, Users } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const Navbar: React.FC = () => {
  const { professor, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-lg border-b-2 border-orange-500">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <img
              src=""
              alt="Rio Branco Logo"
              className="h-10 w-auto"
            />
            <div>
              <h1 className="text-xl font-bold text-gray-800">RioBrancoRank</h1>
              <p className="text-xs text-gray-600">Competição de Algoritmos</p>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/problemas"
              className="flex items-center space-x-1 text-gray-700 hover:text-orange-600 transition-colors"
            >
              <Code className="w-4 h-4" />
              <span>Problemas</span>
            </Link>
            <Link
              to="/ranking"
              className="flex items-center space-x-1 text-gray-700 hover:text-orange-600 transition-colors"
            >
              <Trophy className="w-4 h-4" />
              <span>Ranking</span>
            </Link>
            {isAuthenticated && (
              <Link
                to="/professor/dashboard"
                className="flex items-center space-x-1 text-gray-700 hover:text-orange-600 transition-colors"
              >
                <Users className="w-4 h-4" />
                <span>Dashboard</span>
              </Link>
            )}
          </div>

          {/* Auth Section */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-700">
                  Olá, <span className="font-semibold">{professor?.nome}</span>
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="flex items-center space-x-1"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sair</span>
                </Button>
              </div>
            ) : (
              <Link to="/login-professor">
                <Button variant="default" size="sm">
                  Login Professor
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

