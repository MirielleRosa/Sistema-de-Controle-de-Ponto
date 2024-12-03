import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Row, Col, Alert, Container, Table } from "react-bootstrap";
import {
  startTurn,
  endTurn,
  getTotalWorkedHours,
  getWorkedHoursHistory,
  getWorkedHoursToday,
} from "../services/api";
import TimeDisplay from "../components/TimeDisplay";
import TurnButton from "../components/TurnButton";
import CustomNavbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const Dashboard: React.FC = () => {
  const { userId } = useParams();
  const [turnId, setTurnId] = useState<number | null>(null);
  const [totalHours, setTotalHours] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [workedHoursToday, setWorkedHoursToday] = useState<any[]>([]);

  // Função para buscar dados do backend
  const fetchData = async () => {
    try {
      const [totalHoursResponse] = await Promise.all([
        getTotalWorkedHours(Number(userId)),
        getWorkedHoursHistory(Number(userId)),
      ]);

      const workedHoursResponse = await getWorkedHoursToday(Number(userId));
      setWorkedHoursToday(workedHoursResponse.data);

      const totalHours = totalHoursResponse.data.totalHours;
      setTotalHours(totalHours);

      const now = Date.now();

      if (localStorage.getItem("startTime") && localStorage.getItem("turnId")) {
        const restoredStartTime = Number(localStorage.getItem("startTime"));
        const elapsed = Math.floor((now - restoredStartTime) / 1000);

        setStartTime(restoredStartTime);
        setTurnId(Number(localStorage.getItem("turnId")));
        setElapsedTime(totalHours * 3600 + elapsed);
      } else {
        setElapsedTime(totalHours * 3600);
      }

      setError(null);
    } catch {
      setError("Erro ao carregar dados.");
    }
  };

  // Carregar dados iniciais ao montar o componente
  useEffect(() => {
    fetchData();
  }, [userId]);

  // Atualizar o tempo decorrido enquanto o turno está ativo
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (startTime) {
      interval = setInterval(() => {
        const now = Date.now();
        setElapsedTime(
          totalHours * 3600 + Math.floor((now - startTime) / 1000)
        );
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [startTime, totalHours]);

  const handleStartTurn = async () => {
    if (userId) {
      try {
        const response = await startTurn(Number(userId));
        const now = Date.now();
  
        setTurnId(response.data.id);
        setStartTime(now);
        updateLocalStorage("startTime", String(now));
        updateLocalStorage("turnId", String(response.data.id));
        setError(null);
  
        // Atualizar os dados após iniciar o turno
        await fetchData();
      } catch {
        setError("Erro ao iniciar o turno.");
      }
    }
  };
  
  // Finalizar um turno
  const handleEndTurn = async () => {
    if (turnId) {
      try {
        const now = Date.now();
        const totalElapsedTime = Math.floor((now - (startTime || now)) / 1000);

        await endTurn(turnId);

        setElapsedTime(totalElapsedTime + totalHours * 3600);
        setTotalHours((prev) => prev + totalElapsedTime / 3600);
        setTurnId(null);
        setStartTime(null);

        updateLocalStorage("startTime", null);
        updateLocalStorage("turnId", null);

        // Atualizar os dados após finalizar o turno
        await fetchData();

        setError(null);
      } catch {
        setError("Erro ao finalizar o turno.");
      }
    }
  };

  // Atualizar o localStorage
  const updateLocalStorage = (key: string, value: string | null) => {
    if (value) {
      localStorage.setItem(key, value);
    } else {
      localStorage.removeItem(key);
    }
  };

  // Formatar horário para exibição
  const formatTime = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}h ${minutes}m`;
  };

  // Renderizar tabela de horas trabalhadas
  const renderWorkedHoursTable = () => {
    const sortedData = workedHoursToday.sort(
      (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
    );

    return (
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Entrada</th>
            <th>Saída</th>
          </tr>
        </thead>
        <tbody>
          {sortedData.map((item, index) => (
            <tr key={index}>
              <td>{formatTime(new Date(item.startTime))}</td>
              <td>{item.endTime ? formatTime(new Date(item.endTime)) : "-"}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    );
  };

  return (
    <Row className="g-0">
      <div className="d-block d-md-none">
        <CustomNavbar />
      </div>
      <Col sm={12} md={2}>
        <div className="d-none d-md-block bg-dark">
          <Sidebar />
        </div>
      </Col>
      <Col sm={12} md={10} className="p-4 d-flex justify-content-center">
        <Container>
          {error && <Alert variant="danger">{error}</Alert>}
          <Row className="d-flex align-items-start">
            <h2 className="display-2 text-center text-md-start">Relógio de Ponto</h2>
            <Col className="mx-auto mt-4">
              <TimeDisplay elapsedTime={elapsedTime} />
              <div className="d-flex justify-content-center align-items-center mt-3">
                <TurnButton
                  turnId={turnId}
                  handleStartTurn={handleStartTurn}
                  handleEndTurn={handleEndTurn}
                />
              </div>
            </Col>
          </Row>
          <Row className="mt-4">
            <h3>Horas Trabalhadas Hoje</h3>
            {renderWorkedHoursTable()}
          </Row>
        </Container>
      </Col>
    </Row>
  );
};

export default Dashboard;
