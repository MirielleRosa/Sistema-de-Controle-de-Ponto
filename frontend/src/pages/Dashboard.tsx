import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Row, Col, Alert, Container } from "react-bootstrap";
import {
  startTurn,
  endTurn,
  getTotalWorkedHours,
  getWorkedHoursHistory,
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

  useEffect(() => {
    const savedStartTime = localStorage.getItem("startTime");
    const savedTurnId = localStorage.getItem("turnId");

    const fetchData = async () => {
      try {
        const [totalHoursResponse] = await Promise.all([
          getTotalWorkedHours(Number(userId)),
          getWorkedHoursHistory(Number(userId)),
        ]);

        const totalHours = totalHoursResponse.data.totalHours;
        setTotalHours(totalHours);

        const now = Date.now();

        if (savedStartTime && savedTurnId) {
          const restoredStartTime = Number(savedStartTime);
          const elapsed = Math.floor((now - restoredStartTime) / 1000);

          setStartTime(restoredStartTime);
          setTurnId(Number(savedTurnId));
          setElapsedTime(totalHours * 3600 + elapsed);
        } else {
          setElapsedTime(totalHours * 3600);
        }

        setError(null);
      } catch {
        setError("Erro ao carregar dados.");
      }
    };
    fetchData();
  }, [userId]);

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
      } catch {
        setError("Erro ao iniciar o turno.");
      }
    }
  };

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

        setError(null);
      } catch {
        setError("Erro ao finalizar o turno.");
      }
    }
  };

  const updateLocalStorage = (key: string, value: string | null) => {
    if (value) {
      localStorage.setItem(key, value);
    } else {
      localStorage.removeItem(key);
    }
  };

  return (
    <Row className="g-0 ">
      <div className="d-block d-md-none ">
        <CustomNavbar />
      </div>
      <Col sm={12} md={2}>
        <div className="d-none d-md-block bg-dark ">
          <Sidebar />
        </div>
      </Col>
      <Col sm={12} md={10} className="p-4 d-flex justify-content-center">
        <Container>
          {error && <Alert variant="danger">{error}</Alert>}
          <Row className="d-flex align-items-start">
            <h2 className="display-2 text-center text-md-start text-xl-start text-lg-start">
              Relógio de Ponto
            </h2>
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
        </Container>
      </Col>
    </Row>
  );
};

export default Dashboard;
