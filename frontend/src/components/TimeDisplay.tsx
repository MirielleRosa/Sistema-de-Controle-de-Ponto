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
  <>
    <div className="d-flex justify-content-center align-items-center pt-5">
      <div className="text-center">
        <h1 className="large-text">{formatTime(elapsedTime)}</h1>
      </div>
    </div>
  </>
);


};

export default TimeDisplay;
