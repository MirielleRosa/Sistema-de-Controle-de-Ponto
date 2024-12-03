import React from 'react';
import { Table } from 'react-bootstrap';
import { WorkedHoursTableProps } from '../interface/types'; 

const WorkedHoursTable: React.FC<WorkedHoursTableProps> = ({ data }) => {
  const formatTime = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}h ${minutes}m`;
  };

  const sortedData = data.sort(
    (a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
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

export default WorkedHoursTable;
