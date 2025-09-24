
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Code, Trophy, AlertCircle, CheckCircle } from 'lucide-react';
import { apiService } from '../services/api';
import { Problema } from '../types';
import Editor from "@monaco-editor/react";

// Hook de bloqueio
function useCooldownLock(defaultSeconds = 10) {
  const [locked, setLocked] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const timerRef = useRef<number | null>(null);

  const triggerLock = (seconds = defaultSeconds) => {
    if (locked) return;
    setLocked(true);
    setSecondsLeft(seconds);

    timerRef.current = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          timerRef.current = null;
          setLocked(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return { locked, secondsLeft, triggerLock };
}

export const ProblemsPage: React.FC = () => {
  const [problemas, setProblemas] = useState<Problema[]>([]);
  const [selectedProblem, setSelectedProblem] = useState<Problema | null>(null);
  const [showSolution, setShowSolution] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [codigo, setCodigo] = useState("// escreva seu código abaixo:\n");
  const [ra, setRa] = useState("");

  const { locked, secondsLeft, triggerLock } = useCooldownLock(10);

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

  // Eventos globais de infração
  useEffect(() => {
    const onPaste = (e: ClipboardEvent) => {
      e.preventDefault();
      triggerLock();
    };

    const onKeyDown = (e: KeyboardEvent) => {
      const isPaste = (e.ctrlKey || e.metaKey) && (e.key === 'v' || e.key === 'V');
      if (isPaste) {
        e.preventDefault();
        triggerLock();
      }
    };

    const handleVisibility = () => {
      if (document.hidden) triggerLock();
    };

    const handleBlur = () => {
      triggerLock();
    };

    window.addEventListener('keydown', onKeyDown);
    document.addEventListener('paste', onPaste);
    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('blur', handleBlur);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('paste', onPaste);
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('blur', handleBlur);
    };
  }, [triggerLock]);

  const getNivelBadge = (nivel: number) => {
    const configs = {
      1: { label: 'Fácil', color: 'bg-green-100 text-green-800' },
      2: { label: 'Médio', color: 'bg-yellow-100 text-yellow-800' },
      3: { label: 'Difícil', color: 'bg-red-100 text-red-800' }
    };
    const config = configs[nivel as keyof typeof configs];
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 relative">
      {/* Overlay de bloqueio */}
      {locked && (
        <div className="absolute inset-0 bg-black bg-opacity-60 z-50 flex flex-col items-center justify-center text-white">
          <h3 className="text-lg font-bold">É amigo, tentando colar é? Bloqueado por {secondsLeft}s</h3>
          <p className="text-sm">Você tentou copiar, colar código ou saiu da aba. Tenta de novo!</p>
        </div>
      )}

      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Problemas de Algoritmos</h1>
        <p className="text-gray-600">Resolva os desafios e ganhe pontos na competição</p>
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

      {/* Solution Form com input RA e Monaco */}
      {showSolution && selectedProblem && !locked && (
        <div className="space-y-4">
          <div>
            <Label htmlFor="ra">Registro Acadêmico (RA)</Label>
            <Input
              id="ra"
              value={ra}
              onChange={(e: any) => setRa(e.target.value)}
              placeholder="Digite seu RA"
              className="max-w-xs"
            />
          </div>

          <Editor
            height="400px"
            language="python"
            theme="vs-dark"
            value={codigo}
            onChange={(value) => setCodigo(value || "")}
            options={{
              readOnly: locked,
              minimap: { enabled: false },
              fontSize: 14,
              automaticLayout: true,
            }}
          />

          <Button
            onClick={async () => {
              if (!ra) {
                setError("Por favor, insira seu RA antes de enviar.");
                return;
              }
              try {
                await apiService.criarSubmissao({
                  ra,
                  challengeId: selectedProblem._id,
                  code: codigo
                });
                setSuccess(`Boa, vc concluiu o desafio ${selectedProblem.titulo} e ganhou ${selectedProblem.pontos} pontos!`);
                setShowSolution(false);
                setSelectedProblem(null);
                setRa("");
                setCodigo("// comece o código abaixo:");
              } catch (err: any) {
                setError(err.response?.data?.message || 'Erro ao submeter solução');
              }
            }}
          >
            Enviar Solução
          </Button>
        </div>
      )}

      {/* Problems List */}
      <div className="grid gap-6">
        {problemas.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <Code className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Nenhum problema disponível no momento</p>
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
                    disabled={showSolution || locked}
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

