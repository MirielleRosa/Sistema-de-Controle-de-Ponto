import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Row, Col, Alert, Container } from "react-bootstrap";
import {
  startTurn,
  endTurn,
  getTotalWorkedHours,
  getWorkedHoursToday,
} from "../services/api";
import TimeDisplay from "../components/TimeDisplay";
import TurnButton from "../components/TurnButton";
import CustomNavbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import WorkedHoursTable from "../components/WorkedHoursTable";

const Dashboard: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [turnId, setTurnId] = useState<number | null>(null); 
  const [totalHours, setTotalHours] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [workedHoursToday, setWorkedHoursToday] = useState<any[]>([]);

  const updateLocalStorage = (key: string, value: string | null) => {
    if (value) {
      localStorage.setItem(key, value);
    } else {
      localStorage.removeItem(key);
    }
  };

  const fetchData = async (userId: string) => {
    try {
      console.log("userId", userId)
      const [totalHoursResponse] = await Promise.all([getTotalWorkedHours(userId),]);
      const workedHoursResponse = await getWorkedHoursToday(userId);
      setWorkedHoursToday(workedHoursResponse.data);

      const totalHours = totalHoursResponse.data.totalHours;
      setTotalHours(totalHours);

      console.log("totalHours", totalHours)

      const now = Date.now();

      if (localStorage.getItem("startTime") && localStorage.getItem("turnId")) {
        const restoredStartTime = Number(localStorage.getItem("startTime"));

        if (!isNaN(restoredStartTime) && restoredStartTime > 0) {
          const elapsed = Math.floor((now - restoredStartTime) / 1000);
          setStartTime(restoredStartTime);
          setTurnId(Number(localStorage.getItem("turnId")));
          setElapsedTime(totalHours * 3600 + elapsed);
        } else {
          localStorage.removeItem("startTime");
          localStorage.removeItem("turnId");
          setElapsedTime(totalHours * 3600);
        }
      } else {
        setElapsedTime(totalHours * 3600);
      }

      setError(null);
    } catch {
      setError("Erro ao carregar dados.");
    }
  };

  useEffect(() => {
    if (userId) {
      fetchData(userId);
    }
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
    if (!userId) return;  
  
    try {
      const response = await startTurn(userId);  
  
      if (response?.data?.startTime && response?.data?.id) {
        const serverStartTime = new Date(response.data.startTime).getTime();
  
        setTurnId(Number(response.data.id));  
        setStartTime(serverStartTime);
        updateLocalStorage("startTime", String(serverStartTime));
        updateLocalStorage("turnId", String(response.data.id));
        setError(null);
  
        await fetchData(userId);
      } else {
        throw new Error("Dados inválidos recebidos do servidor.");
      }
    } catch (error) {
      console.error("Erro ao iniciar o turno:", error);
      setError("Erro ao iniciar o turno.");
    }
  };
  
  const handleEndTurn = async () => {
    if (turnId === null || !userId) return; 
  
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
  
      await fetchData(userId); 
  
      setError(null);
    } catch (error) {
      console.error("Erro ao finalizar o turno:", error);
      setError("Erro ao finalizar o turno.");
    }
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
            <Col className="">
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
          <WorkedHoursTable workedHoursToday={workedHoursToday} />
          </Row>
        </Container>
      </Col>
    </Row>
  );
};

export default Dashboard;
