import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { UserPlus, AlertCircle, CheckCircle } from 'lucide-react';
import { apiService } from '../services/api';

export const StudentRegister: React.FC = () => {
  const [formData, setFormData] = useState({
    nomeCompleto: '',
    ra: '',
    semestre: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await apiService.cadastrarAluno({
        nomeCompleto: formData.nomeCompleto,
        ra: formData.ra,
        semestre: parseInt(formData.semestre)
      });
      // o R.A do aluno tem que sempre começar com 211
      if (formData.ra[0] !== '2' || formData.ra[1] !== '1' || formData.ra[2] !== '1') {
        setError('RA inválido, por favor verifique seu RA');
        return;
      }
      else if (formData.ra.length >= 7) {
        setError('RA inválido, por favor verifique seu RA');
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        navigate(`/aluno/${formData.ra}`);
      }, 2000);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Erro ao cadastrar aluno');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-md mx-auto">
        <Card>
          <CardContent className="pt-6 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              Cadastro Realizado!
            </h2>
            <p className="text-gray-600 mb-4">
              Redirecionando para seu dashboard...
            </p>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      <Card>
        <CardHeader className="text-center">
          <UserPlus className="w-12 h-12 text-orange-500 mx-auto mb-2" />
          <CardTitle className="text-2xl">Cadastro de Aluno</CardTitle>
          <p className="text-gray-600">
            Preencha seus dados para começar a competir
          </p>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert className="mb-4" variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="nomeCompleto">Nome Completo</Label>
              <Input
                id="nomeCompleto"
                type="text"
                placeholder="Digite seu nome completo"
                value={formData.nomeCompleto}
                onChange={(e) => handleInputChange('nomeCompleto', e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="ra">R.A (Registro Acadêmico)</Label>
              <Input
                id="ra"
                type="text"
                placeholder="Digite seu R.A"
                value={formData.ra}
                onChange={(e) => handleInputChange('ra', e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="semestre">Semestre</Label>
              <Select
                value={formData.semestre}
                onValueChange={(value) => handleInputChange('semestre', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione seu semestre" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                    <SelectItem key={sem} value={sem.toString()}>
                      {sem}º Semestre
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Cadastrando...
                </>
              ) : (
                'Cadastrar'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

