import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Code, Trophy, User, AlertCircle, CheckCircle, Send } from 'lucide-react';
import ProblemSubmitter from '@/components/student/ProblemSubmitter';
import { apiService } from '../services/api';
import { Problema } from '../types';

export const ProblemsPage: React.FC = () => {
  const [problemas, setProblemas] = useState<Problema[]>([]);
  const [selectedProblem, setSelectedProblem] = useState<Problema | null>(null);
  const [showSolution, setShowSolution] = useState(false);
  const [solutionData, setSolutionData] = useState({
    ra: '',
    solucao: ''
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchProblemas();
  }, []);

  const fetchProblemas = async () => {
    try {
      const problemasData = await apiService.listarProblemas();
      setProblemas(problemasData);
    } catch (error: any) {
      setError('Erro ao carregar problemas');
    } finally {
      setLoading(false);
    }
  };

  const handleSolutionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProblem) return;

    setSubmitting(true);
    setError('');

    try {
      const result = await apiService.resolverProblema({
        ra: solutionData.ra,
        problemaId: selectedProblem._id,
        solucao: solutionData.solucao
      });

      setSuccess(`${result.message} Você ganhou ${result.pontosGanhos} pontos!`);
      setSolutionData({ ra: '', solucao: '' });
      setShowSolution(false);
      setSelectedProblem(null);

      setTimeout(() => setSuccess(''), 5000);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Erro ao submeter solução');
    } finally {
      setSubmitting(false);
    }
  };

  const getNivelBadge = (nivel: number) => {
    const configs = {
      1: { label: 'Fácil', color: 'bg-green-100 text-green-800' },
      2: { label: 'Médio', color: 'bg-yellow-100 text-yellow-800' },
      3: { label: 'Difícil', color: 'bg-red-100 text-red-800' }
    };
    const config = configs[nivel as keyof typeof configs];
    return (
      <Badge className={config.color}>
        {config.label}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Problemas de Algoritmos
        </h1>
        <p className="text-gray-600">
          Resolva os desafios e ganhe pontos na competição
        </p>
      </div>

      {/* Alerts */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">{success}</AlertDescription>
        </Alert>
      )}

      {/* Solution Form */}
      {showSolution && selectedProblem && <ProblemSubmitter problema={selectedProblem} />}

      {/* Problems List */}
      <div className="grid gap-6">
        {problemas.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <Code className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">
                Nenhum problema disponível no momento
              </p>
            </CardContent>
          </Card>
        ) : (
          problemas.map((problema) => (
            <Card key={problema._id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-2">{problema.titulo}</CardTitle>
                    <div className="flex items-center gap-2 mb-2">
                      {getNivelBadge(problema.nivel)}
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Trophy className="w-3 h-3" />
                        {problema.pontos} pontos
                      </Badge>
                    </div>
                  </div>
                  <Button
                    onClick={() => {
                      setSelectedProblem(problema);
                      setShowSolution(true);
                      setError('');
                    }}
                    disabled={showSolution}
                  >
                    Resolver
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <pre className="whitespace-pre-wrap text-sm bg-gray-50 p-4 rounded-lg">
                    {problema.descricao}
                  </pre>
                </div>
                <div className="mt-4 text-sm text-gray-500">
                  Criado em {new Date(problema.createdAt).toLocaleDateString('pt-BR')}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

