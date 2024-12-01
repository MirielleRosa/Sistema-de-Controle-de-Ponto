import React from 'react';
import { Table } from 'react-bootstrap';

interface HistoryTableProps {
  history: { date: string, totalTime: number }[];
}

  const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); 
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const HistoryTable: React.FC<HistoryTableProps> = ({ history }) => (
  history.length > 0 ? (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Data</th>
          <th>Total de Horas Trabalhadas</th>
        </tr>
      </thead>
      <tbody>
        {history.map((entry, index) => (
          <tr key={index}>
            <td>{formatDate(entry.date)}</td>
            <td>{entry.totalTime}</td> 
          </tr>
        ))}
      </tbody>
    </Table>
  ) : (
    <p>Não há histórico de horas para este usuário.</p>
  )
);

export default HistoryTable;
