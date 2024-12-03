import React from 'react';
import { Button } from 'react-bootstrap';

interface TurnButtonProps {
  turnId: number | null;
  handleStartTurn: () => void;
  handleEndTurn: () => void;
}

const TurnButton: React.FC<TurnButtonProps> = ({ turnId, handleStartTurn, handleEndTurn }) => {
  return turnId ? (
    <Button
      variant="danger"
      className='bg-secondary w-50'
      onClick={handleEndTurn}
      style={{ border: 'none' }}
    >Hora de Saída
    </Button>
  ) : (
    <Button
      variant="success"
      className="bg-secondary w-50"
      onClick={handleStartTurn}
      style={{ border: 'none' }}
    >Hora de entrada
    </Button>
  );
};

export default TurnButton;