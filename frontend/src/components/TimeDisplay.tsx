import React from 'react';

interface TimeDisplayProps {
  elapsedTime: number;
}

const TimeDisplay: React.FC<TimeDisplayProps> = ({ elapsedTime }) => {
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const sec = Math.floor(seconds % 60); 

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  return (
    <h4>Tempo Trabalhado Hoje: {formatTime(elapsedTime)}</h4>
  );
};

export default TimeDisplay;
