import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import { IoMdEye } from 'react-icons/io';

interface HistoryTableProps {
  history: { date: string; totalTime: number }[];
  onViewDetails: (date: string, totalTime: number) => void;
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const HistoryTable: React.FC<HistoryTableProps> = ({ history, onViewDetails }) => {
  const [modalShow, setModalShow] = useState(false);
  const [details] = useState<{ startTime: string; endTime: string; totalTime: string }[]>([]);

  return (
    <>
      {history.length > 0 ? (
        <div className="bg-white rounded">
          <div className="w-100">
            <div className="table-responsive" style={{ maxHeight: '700px' }}>
              <table className="table" style={{ borderCollapse: 'collapse', border: 'none' }}>
                <thead>
                  <tr className="table-header">
                    <th>Data</th>
                    <th>Total de horas</th>
                    <th>Ação</th>
                  </tr>

                </thead>
                <tbody>
                  {history.map((entry, index) => (
                    <tr key={index} style={{ border: 'none' }}>
                      <td className="table-header-tr" style={{ color: '#454B54' }}>{formatDate(entry.date)}</td>
                      <td className="table-header-tr" style={{ color: '#454B54' }}>{entry.totalTime}</td>
                      <td className="table-header-tr" style={{ color: '#454B54' }}>
                        <IoMdEye  className="fs-3"
                          onClick={() => onViewDetails(entry.date, entry.totalTime)} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow rounded">
          <div className="w-100">
            <div className="table-responsive" style={{ maxHeight: '700px' }}>
              <table className="table">
                <thead>
                  <tr>
                    <th style={{ textAlign: 'left', width: '50%' }}>Data</th>
                    <th style={{ textAlign: 'right', width: '50%' }}>Total de horas</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan={2} style={{ textAlign: 'center' }}>
                      <span>Não há histórico de horas para este usuário.</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
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
    </>
  );
};

export default HistoryTable;
