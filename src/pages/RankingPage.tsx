import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '../components/ui/badge';
import { Trophy, Medal, Award, Users } from 'lucide-react';
import { apiService } from '../services/api';
import { Aluno } from '../types';

export const RankingPage: React.FC = () => {
  const [ranking, setRanking] = useState<Aluno[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRanking();
  }, []);

  const fetchRanking = async () => {
    try {
      const rankingData = await apiService.obterRanking();
      setRanking(rankingData);
    } catch (error: any) {
      setError('Erro ao carregar ranking');
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Trophy className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Award className="w-6 h-6 text-amber-600" />;
      default:
        return <span className="w-6 h-6 flex items-center justify-center text-gray-600 font-bold">{position}</span>;
    }
  };

  const getRankBadge = (position: number) => {
    if (position === 1) return <Badge className="bg-yellow-100 text-yellow-800">1º Lugar</Badge>;
    if (position === 2) return <Badge className="bg-gray-100 text-gray-800">2º Lugar</Badge>;
    if (position === 3) return <Badge className="bg-amber-100 text-amber-800">3º Lugar</Badge>;
    return <Badge variant="outline">{position}º Lugar</Badge>;
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
          Ranking da Competição
        </h1>
        <p className="text-gray-600">
          Classificação dos melhores competidores
        </p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="text-center">
            <Users className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <CardTitle>Total de Participantes</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-3xl font-bold text-blue-600">
              {ranking.length}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="text-center">
            <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
            <CardTitle>Maior Pontuação</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-3xl font-bold text-yellow-600">
              {ranking.length > 0 ? ranking[0].pontuacao : 0}
            </p>
            <p className="text-sm text-gray-600">pontos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="text-center">
            <Award className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <CardTitle>Problemas Resolvidos</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-3xl font-bold text-green-600">
            </p>
            {ranking.length}
            <p className="text-sm text-gray-600">total</p>
          </CardContent>
        </Card>
      </div>

      {/* Ranking Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5" />
            Classificação Geral
          </CardTitle>
        </CardHeader>
        <CardContent>
          {ranking.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">
                Nenhum participante no ranking ainda
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {ranking.map((aluno, index) => {
                const position = index + 1;
                return (
                  <div
                    key={aluno._id}
                    className={`flex items-center justify-between p-4 rounded-lg border transition-colors ${position <= 3
                        ? 'bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200'
                        : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white shadow-sm">
                        {getRankIcon(position)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{aluno.nomeCompleto}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <span>R.A: {aluno.ra}</span>
                          <span>•</span>
                          <span>{aluno.semestre}º Semestre</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="flex items-center gap-3 mb-1">
                        {getRankBadge(position)}
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="text-center">
                          <p className="font-bold text-lg text-orange-600">{aluno.pontuacao}</p>
                          <p className="text-gray-600">pontos</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Podium for Top 3 */}
      {ranking.length >= 3 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Pódio dos Campeões</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center items-end gap-4">
              {/* 2nd Place */}
              <div className="text-center">
                <div className="w-20 h-16 bg-gray-200 rounded-t-lg flex items-end justify-center pb-2">
                  <Medal className="w-8 h-8 text-gray-500" />
                </div>
                <div className="bg-gray-100 p-3 rounded-b-lg">
                  <p className="font-semibold text-sm">{ranking[1].nomeCompleto}</p>
                  <p className="text-xs text-gray-600">{ranking[1].pontuacao} pts</p>
                </div>
              </div>

              {/* 1st Place */}
              <div className="text-center">
                <div className="w-20 h-20 bg-yellow-200 rounded-t-lg flex items-end justify-center pb-2">
                  <Trophy className="w-10 h-10 text-yellow-600" />
                </div>
                <div className="bg-yellow-100 p-3 rounded-b-lg">
                  <p className="font-semibold text-sm">{ranking[0].nomeCompleto}</p>
                  <p className="text-xs text-gray-600">{ranking[0].pontuacao} pts</p>
                </div>
              </div>

              {/* 3rd Place */}
              <div className="text-center">
                <div className="w-20 h-12 bg-amber-200 rounded-t-lg flex items-end justify-center pb-2">
                  <Award className="w-6 h-6 text-amber-600" />
                </div>
                <div className="bg-amber-100 p-3 rounded-b-lg">
                  <p className="font-semibold text-sm">{ranking[2].nomeCompleto}</p>
                  <p className="text-xs text-gray-600">{ranking[2].pontuacao} pts</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

