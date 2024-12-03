import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Row, Col, Alert, Container, Modal } from 'react-bootstrap';
import { getWorkedHoursHistory, getDetailsByDate } from '../services/api';
import Sidebar from '../components/Sidebar';
import HistoryTable from '../components/HistoryTable';
import CustomNavbar from '../components/Navbar';

const HistoryPage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>(); 
  const [history, setHistory] = useState<{ date: string; totalTime: string }[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [modalShow, setModalShow] = useState(false);
  const [details, setDetails] = useState<{ startTime: string; endTime: string; totalTime: string }[]>([]);

  useEffect(() => {
    if (userId){
    const fetchHistory = async () => {
        try {
          const response = await getWorkedHoursHistory(userId);
          setHistory(response.data);
          setError(null);
        } catch {
          setError('Erro ao carregar histórico.');
        } 
      };
      fetchHistory();
      }
  }, [userId]);

  const handleViewDetails = async (date: string) => {
    if (userId) {
      try {
        const response = await getDetailsByDate(userId, date);
        setDetails(response.data);
        setModalShow(true);
        setError(null);
      } catch {
        setError('Erro ao carregar detalhes.');
      } 
    };
    }

  return (
    <Row className="g-0">
    <div className="d-block d-md-none">
      <CustomNavbar />
    </div>
    <Col sm={12} md={2} >
    <div className="d-none d-md-block">
      <Sidebar  />
    </div>
      </Col>
    <Col sm={12} md={10} className="p-4 d-flex justify-content-center">
        <Container>
          {error && <Alert variant="danger">{error}</Alert>}
          <h1 className='display-2'>Dias Anteriores</h1>
          <HistoryTable history={history} onViewDetails={handleViewDetails} />
        </Container>
      </Col>
      <Modal show={modalShow} onHide={() => setModalShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Detalhes do Turno</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <table className="table">
            <thead>
              <tr>
                <th>Entrada</th>
                <th>Saída</th>
                <th>Horas Trabalhadas</th>
              </tr>
            </thead>
            <tbody>
              {details.map((detail, index) => (
                <tr key={index}>
                  <td>{detail.startTime}</td>
                  <td>{detail.endTime}</td>
                  <td>{detail.totalTime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Modal.Body>
      </Modal>
    </Row>
  );
};

export default HistoryPage;