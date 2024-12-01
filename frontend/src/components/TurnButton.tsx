import React from 'react';
import { Button, Spinner } from 'react-bootstrap';

interface TurnButtonProps {
  turnId: number | null;
  handleStartTurn: () => void;
  handleEndTurn: () => void;
  loading: boolean;
}

const TurnButton: React.FC<TurnButtonProps> = ({ turnId, handleStartTurn, handleEndTurn, loading }) => {
  return turnId ? (
    <Button
      variant="danger"
      onClick={handleEndTurn}
      disabled={loading}
    >
      {loading ? <Spinner animation="border" size="sm" /> : 'Finalizar Turno'}
    </Button>
  ) : (
    <Button
      variant="success"
      onClick={handleStartTurn}
      disabled={loading}
    >
      {loading ? <Spinner animation="border" size="sm" /> : 'Iniciar Turno'}
    </Button>
  );
};

export default TurnButton;
