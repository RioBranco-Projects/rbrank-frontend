import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Plus, Code, Edit, Trash2, AlertCircle, CheckCircle } from 'lucide-react';
import { apiService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import SubmissionPanel from '../components/teacher/SubmissionPanel';
import { Problema } from '../types';

export const TeacherDashboard: React.FC = () => {
  const [problemas, setProblemas] = useState<Problema[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    nivel: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [selectedProblem, setSelectedProblem] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login-professor');
      return;
    }
    fetchProblemas();
  }, [isAuthenticated, navigate]);

  const fetchProblemas = async () => {
    try {
      const problemasData = await apiService.listarProblemasDoProfesor();
      setProblemas(problemasData);
    } catch (error: any) {
      setError('Erro ao carregar problemas');
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await apiService.criarProblema({
        titulo: formData.titulo,
        descricao: formData.descricao,
        nivel: parseInt(formData.nivel),
      });

      setSuccess('Problema criado com sucesso!');
      setFormData({ titulo: '', descricao: '', nivel: '' });
      setShowForm(false);
      fetchProblemas();

      setTimeout(() => setSuccess(''), 3000);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Erro ao criar problema');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja deletar este problema?')) return;

    try {
      await apiService.deletarProblema(id);
      setSuccess('Problema deletado com sucesso!');
      fetchProblemas();
      setTimeout(() => setSuccess(''), 3000);
    } catch (error: any) {
      setError('Erro ao deletar problema');
    }
  };

  const getNivelBadge = (nivel: number) => {
    const configs = {
      1: { label: 'Fácil', variant: 'default' as const, color: 'bg-green-100 text-green-800' },
      2: { label: 'Médio', variant: 'secondary' as const, color: 'bg-yellow-100 text-yellow-800' },
      3: { label: 'Difícil', variant: 'destructive' as const, color: 'bg-red-100 text-red-800' }
    };
    const config = configs[nivel as keyof typeof configs];
    return (
      <Badge className={config.color}>
        {config.label}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Dashboard do Professor</h1>
          <p className="text-gray-600">Gerencie os problemas da competição</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="w-4 h-4 mr-2" />
          Novo Problema
        </Button>
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

      {/* Create Problem Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Criar Novo Problema</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="titulo">Título do Problema</Label>
                <Input
                  id="titulo"
                  type="text"
                  placeholder="Ex: Soma de Dois Números"
                  value={formData.titulo}
                  onChange={(e) => handleInputChange('titulo', e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="descricao">Descrição</Label>
                <Textarea
                  id="descricao"
                  placeholder="Descreva o problema detalhadamente..."
                  value={formData.descricao}
                  onChange={(e) => handleInputChange('descricao', e.target.value)}
                  rows={4}
                  required
                />
              </div>

              <div>
                <Label htmlFor="nivel">Nível de Dificuldade</Label>
                <Select
                  value={formData.nivel}
                  onValueChange={(value) => handleInputChange('nivel', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o nível" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Nível 1 - Fácil (1 ponto)</SelectItem>
                    <SelectItem value="2">Nível 2 - Médio (3 pontos)</SelectItem>
                    <SelectItem value="3">Nível 3 - Difícil (5 pontos)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={loading}>
                  {loading ? 'Criando...' : 'Criar Problema'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowForm(false)}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Problems List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="w-5 h-5" />
            Meus Problemas ({problemas.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {problemas.length === 0 ? (
            <div className="text-center py-8">
              <Code className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">
                Você ainda não criou nenhum problema
              </p>
              <Button onClick={() => setShowForm(true)}>
                Criar Primeiro Problema
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {problemas.map((problema) => (
                <div
                  key={problema._id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{problema.titulo}</h3>
                      <p className="text-gray-600 text-sm mb-2">
                        {problema.descricao.substring(0, 100)}...
                      </p>
                      <div className="flex items-center gap-2">
                        {getNivelBadge(problema.nivel)}
                        <Badge variant="outline">
                          {problema.pontos} pontos
                        </Badge>
                        <span className="text-sm text-gray-500">
                          Criado em {new Date(problema.createdAt).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(problema._id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="default"
                        onClick={() => setSelectedProblem(problema._id)}
                      >
                        Ver Submissões
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      {selectedProblem && (
        <SubmissionPanel challengeId={selectedProblem} />
      )}
    </div>
  );
};

