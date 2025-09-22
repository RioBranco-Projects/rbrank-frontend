import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, AlertCircle } from 'lucide-react';
import { apiService } from '../services/api';
import { StatusResponse } from '../types';

interface PlatformStatusProps {
  children: React.ReactNode;
}

export const PlatformStatus: React.FC<PlatformStatusProps> = ({ children }) => {
  const [status, setStatus] = useState<StatusResponse | null>(null);
  const [timeUntilNext, setTimeUntilNext] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const statusData = await apiService.getStatus();
        setStatus(statusData);
      } catch (error) {
        console.error('Erro ao verificar status:', error);
      } finally {
        setLoading(false);
      }
    };

    checkStatus();
    const interval = setInterval(checkStatus, 60000); // Verificar a cada minuto

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!status || status.isAvailable || !status.nextAvailableTime) return;

    const updateCountdown = () => {
      const now = new Date().getTime();
      const nextTime = new Date(status.nextAvailableTime!).getTime();
      const difference = nextTime - now;

      if (difference > 0) {
        const hours = Math.floor(difference / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeUntilNext(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
      } else {
        setTimeUntilNext('00:00:00');
        // Recarregar a página quando o tempo chegar
        window.location.reload();
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [status]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!status?.isAvailable) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-orange-600" />
            </div>
            <CardTitle className="text-xl text-gray-800">
              Plataforma Indisponível
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-gray-600">
              {status?.message}
            </p>
            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Clock className="w-5 h-5 text-orange-600" />
                <span className="font-semibold text-orange-800">
                  Tempo para abertura:
                </span>
              </div>
              <div className="text-2xl font-mono font-bold text-orange-600">
                {timeUntilNext}
              </div>
            </div>
            <p className="text-sm text-gray-500">
              A plataforma estará disponível das 19h às 23h
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};

