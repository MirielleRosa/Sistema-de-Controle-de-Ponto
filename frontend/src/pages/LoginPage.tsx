import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Container, Form, Row, Col, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const LoginPage: React.FC = () => {
  const [userId, setUserId] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (userId.trim() === '') {
      setError('O campo User ID é obrigatório.');
      return;
    }

    navigate(`/${userId}`);
  };

  return (
    <Container className="">
      <Row className="justify-content-md-center">
        <Col md={6} className="shadow p-4">
          <h1 className="text-center mb-4">Controle de Ponto</h1>

          {/* Exibe mensagem de erro, caso haja */}
          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="userId">
              <Form.Label>User ID:</Form.Label>
              <Form.Control
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="Digite seu User ID"
              />
            </Form.Group>

            <Button type="submit" className="w-100 mt-3">Entrar</Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginPage;
