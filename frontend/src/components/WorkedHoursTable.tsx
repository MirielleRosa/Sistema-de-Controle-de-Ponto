import React from 'react';
import { Col } from 'react-bootstrap';
import { WorkedHoursTableProps } from '../interface/types';

const WorkedHoursTable: React.FC<WorkedHoursTableProps> = ({ workedHoursToday }) => {

  const formatTime = (date: Date) => {
    
    const localDate = new Date(date); 
    const hours = localDate.getHours().toString().padStart(2, "0");
    const minutes = localDate.getMinutes().toString().padStart(2, "0");
    return `${hours}h ${minutes}m`;
  };

  const renderWorkedHoursTable = () => {
    const sortedData = workedHoursToday.sort(
      (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
    );

    return (
      <>
        <Col className="d-flex justify-content-center mt-2">
          <Col md={9} xl={7} sm={12} xs={12}>
            <h3>Horas Trabalhadas Hoje</h3>
            {sortedData.length > 0 ? (
              <div className="mt-4 bg-white rounded" style={{ fontFamily: 'Roboto, sans-serif' }}>
                <div className="w-100">
                  <div className="table-responsive" style={{ maxHeight: '490px' }}>
                    <table className="table" style={{ borderCollapse: 'collapse', border: 'none' }}>
                      <thead>
                        <tr className="table-header">
                          <th style={{ textAlign: 'left', width: '50%' }}>Entrada</th>
                          <th style={{ textAlign: 'right', width: '50%' }}>Saída</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sortedData.map((item, index) => (
                          <tr key={index} style={{ border: 'none' }}>
                            <td className="table-header-tr" style={{ color: '#454B54' }}>
                              {formatTime(new Date(item.startTime))}
                            </td>
                            <td className="table-header-tr" style={{ color: '#454B54', textAlign: 'right', width: '50%' }}>
                              {item.endTime ? formatTime(new Date(item.endTime)) : "-"}
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
                  <div className="table-responsive">
                    <table className="table">
                      <thead>
                        <tr>
                          <th style={{ textAlign: 'left', width: '50%' }}>Entrada</th>
                          <th style={{ textAlign: 'right', width: '50%' }}>Saída</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td colSpan={2} style={{ textAlign: 'center' }}>
                            <span>Você ainda não iniciou o dia.</span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </Col>
        </Col>
      </>
    );
  };

  return renderWorkedHoursTable(); 
};

export default WorkedHoursTable;
