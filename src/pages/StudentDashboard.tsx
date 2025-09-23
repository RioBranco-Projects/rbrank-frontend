import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { User, Trophy, Code, Calendar, AlertCircle } from 'lucide-react';
import { apiService } from '../services/api';
import { Aluno } from '../types';

export const StudentDashboard: React.FC = () => {
  const { ra } = useParams<{ ra: string }>();
  const [aluno, setAluno] = useState<Aluno | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAluno = async () => {
      if (!ra) return;

      try {
        const alunoData = await apiService.buscarAlunoPorRA(ra);
        setAluno(alunoData);
      } catch (error: any) {
        setError(error.response?.data?.message || 'Aluno não encontrado');
      } finally {
        setLoading(false);
      }
    };

    fetchAluno();
  }, [ra]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <div className="mt-4 text-center">
          <Link to="/cadastro-aluno">
            <Button>Cadastrar-se</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!aluno) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Dashboard do Aluno
        </h1>
        <p className="text-gray-600">
          Acompanhe seu progresso na competição
        </p>
      </div>

      {/* Student Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Informações Pessoais
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600">Nome Completo</p>
              <p className="font-semibold">{aluno.nomeCompleto}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">R.A</p>
              <p className="font-semibold">{aluno.ra}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Semestre</p>
              <p className="font-semibold">{aluno.semestre}º</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="text-center">
            <Trophy className="w-8 h-8 text-orange-500 mx-auto mb-2" />
            <CardTitle>Pontuação Total</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-3xl font-bold text-orange-600">
              {aluno.pontuacao}
            </p>
            <p className="text-sm text-gray-600">pontos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="text-center">
            <Code className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <CardTitle>Problemas Resolvidos</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-3xl font-bold text-green-600">
              {aluno.problemasResolvidos.length}
            </p>
            <p className="text-sm text-gray-600">problemas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="text-center">
            <Calendar className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <CardTitle>Membro desde</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-lg font-semibold text-blue-600">
              {new Date(aluno.createdAt).toLocaleDateString('pt-BR')}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Problems Solved */}
      <Card>
        <CardHeader>
          <CardTitle>Problemas Resolvidos</CardTitle>
        </CardHeader>
        <CardContent>
          {aluno.problemasResolvidos.length === 0 ? (
            <div className="text-center py-8">
              <Code className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">
                Você ainda não resolveu nenhum problema
              </p>
              <Link to="/problemas">
                <Button>Ver Problemas Disponíveis</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {aluno.problemasResolvidos.map((problema, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium">Problema #{index + 1}</p>
                    <p className="text-sm text-gray-600">
                      Resolvido em {new Date(problema.dataResolucao).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <Badge variant="secondary">
                    Concluído
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-4">
        <Link to="/problemas">
          <Button className="w-full" size="lg">
            <Code className="w-5 h-5 mr-2" />
            Resolver Problemas
          </Button>
        </Link>
        <Link to="/ranking">
          <Button variant="outline" className="w-full" size="lg">
            <Trophy className="w-5 h-5 mr-2" />
            Ver Ranking
          </Button>
        </Link>
      </div>
    </div>
  );
};

