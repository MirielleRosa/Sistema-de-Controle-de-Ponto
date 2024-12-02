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
    <div className="bg-dark">
      <Container className="min-vh-100 d-flex align-items-center justify-content-center">
        <Row className="justify-content-center w-100">
          <Col md={6} xs={9} className="shadow p-4 rounded">
            <div className="d-flex gap-3 text-center text-secondary align-items-center m-2 mb-4">
              <img
                loading="lazy"
                src="/img/ilumeo-logo.png"
                alt="Ilumeo Logo"
                className="img-fluid"
                style={{ width: "3rem", aspectRatio: "0.96" }}
              />
              <div className="text-muted text-gray fs-3">
                Ponto <span className="fw-bold text-gray">Ilumeo</span>
              </div>
            </div>
            {error && (
              <Alert variant="danger" className="mb-4 w-100">
                {error}
              </Alert>
            )}
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="userId" className="mb-3">
                <Form.Label style={{ color: 'white' }}>Código do usuário:</Form.Label>
                <Form.Control
                  type="text"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  placeholder="4SXXFMf"
                  required
                  className="custom-placeholder"
                />
              </Form.Group>
              <Button type="submit" className="w-100 mt-3 btn-secondary">
                Confirmar
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default LoginPage;
