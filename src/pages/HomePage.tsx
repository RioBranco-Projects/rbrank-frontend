import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Code, Trophy, Users, Search } from 'lucide-react';

export const HomePage: React.FC = () => {
  const [raSearch, setRaSearch] = useState('');
  const navigate = useNavigate();

  const handleSearchStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (raSearch.trim()) {
      navigate(`/aluno/${raSearch.trim()}`);
    }
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center py-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg text-white">
        <h1 className="text-4xl font-bold mb-4">RioBrancoRank</h1>
        <p className="text-xl mb-6">Plataforma de Competição de Algoritmos</p>
        <p className="text-lg opacity-90">
          Desenvolva suas habilidades de programação e compete com seus colegas!
        </p>
      </div>

      {/* Quick Access Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="text-center">
            <Users className="w-12 h-12 text-orange-500 mx-auto mb-2" />
            <CardTitle>Cadastro de Aluno</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 mb-4">
              Registre-se na plataforma para começar a resolver problemas
            </p>
            <Link to="/cadastro-aluno">
              <Button className="w-full">Cadastrar-se</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="text-center">
            <Code className="w-12 h-12 text-orange-500 mx-auto mb-2" />
            <CardTitle>Problemas</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 mb-4">
              Explore os desafios de programação disponíveis
            </p>
            <Link to="/problemas">
              <Button variant="outline" className="w-full">Ver Problemas</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="text-center">
            <Trophy className="w-12 h-12 text-orange-500 mx-auto mb-2" />
            <CardTitle>Ranking</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 mb-4">
              Veja a classificação dos melhores competidores
            </p>
            <Link to="/ranking">
              <Button variant="outline" className="w-full">Ver Ranking</Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Student Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Buscar Aluno
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearchStudent} className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="ra">R.A do Aluno</Label>
              <Input
                id="ra"
                type="text"
                placeholder="Digite o R.A do aluno"
                value={raSearch}
                onChange={(e) => setRaSearch(e.target.value)}
                required
              />
            </div>
            <div className="flex items-end">
              <Button type="submit">
                <Search className="w-4 h-4 mr-2" />
                Buscar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Info Section */}
      <div className="bg-orange-50 p-6 rounded-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Como Funciona</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">Para Alunos:</h3>
            <ul className="space-y-1 text-gray-600">
              <li>• Cadastre-se com seu nome, R.A e semestre</li>
              <li>• Resolva problemas de algoritmos</li>
              <li>• Ganhe pontos baseados na dificuldade</li>
              <li>• Compete no ranking geral</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">Sistema de Pontuação:</h3>
            <ul className="space-y-1 text-gray-600">
              <li>• Nível 1 (Fácil): 1 ponto</li>
              <li>• Nível 2 (Médio): 3 pontos</li>
              <li>• Nível 3 (Difícil): 5 pontos</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

