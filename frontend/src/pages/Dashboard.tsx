import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Row, Col, Alert } from 'react-bootstrap';
import { startTurn, endTurn, getTotalWorkedHours, getWorkedHoursHistory } from '../services/api';
import TimeDisplay from '../components/TimeDisplay';
import TurnButton from '../components/TurnButton';
import HistoryTable from '../components/HistoryTable';
import 'bootstrap/dist/css/bootstrap.min.css';

const Dashboard: React.FC = () => {
  const { userId } = useParams();
  const [turnId, setTurnId] = useState<number | null>(null); 
  const [totalHours, setTotalHours] = useState<number | null>(null);  
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<number | null>(null); 
  const [elapsedTime, setElapsedTime] = useState<number>(0); 
  const [history, setHistory] = useState<{ date: string, totalTime: number }[]>([]);

  useEffect(() => {
    if (userId) {
      getTotalWorkedHours(Number(userId))
        .then(response => {
          const totalHours = response.data.totalHours;
          if (totalHours === 0) {
            setTotalHours(0);
            setElapsedTime(0);
          } else {
            const totalSecs = totalHours * 3600;
            setTotalHours(totalHours);
            setElapsedTime(totalSecs);
            setError('');
          }
        })
        .catch(() => {
          setError('Erro ao carregar total de horas trabalhadas.');
        });

      getWorkedHoursHistory(Number(userId))
        .then(response => {
          setHistory(response.data);
        })
        .catch(() => {
          setError('Erro ao carregar histórico de horas trabalhadas.');
        });
    }
  }, [userId]);

  useEffect(() => {
    const resetAtMidnight = () => {
      const now = new Date();
      const nextMidnight = new Date();
      nextMidnight.setHours(24, 0, 0, 0);

      const timeUntilMidnight = nextMidnight.getTime() - now.getTime();
      
      setTimeout(() => {
        setElapsedTime(0);
        setStartTime(null);
        setTotalHours(0);
      }, timeUntilMidnight);
    };

    resetAtMidnight();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (startTime) {
      interval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000) + (totalHours || 0) * 3600); 
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [startTime, totalHours]);

  const handleStartTurn = async () => {
    if (userId) {
      setLoading(true);
      try {
        const response = await startTurn(Number(userId));
        setTurnId(response.data.id);
        setStartTime(Date.now());
        setError(null);
      } catch {
        setError('Erro ao iniciar o turno.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEndTurn = async () => {
    if (turnId) {
      setLoading(true);
      try {
        await endTurn(turnId);
        setTurnId(null);
        setStartTime(null);
        setError(null);
      } catch {
        setError('Erro ao finalizar o turno.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Row className="justify-content-md-center">
      <Col md={6} className="shadow p-4">
        <h1 className="text-center mb-4">Dashboard - Controle de Ponto</h1>

        {error && <Alert variant="danger">{error}</Alert>}

        <TimeDisplay elapsedTime={elapsedTime} />
        
        <div className="d-flex justify-content-between mt-3">
          <TurnButton
            turnId={turnId}
            handleStartTurn={handleStartTurn}
            handleEndTurn={handleEndTurn}
            loading={loading}
          />
        </div>

        <h4 className="mt-4">Histórico de Horas Trabalhadas</h4>
        <HistoryTable history={history} />
      </Col>
    </Row>
  );
};

export default Dashboard;
