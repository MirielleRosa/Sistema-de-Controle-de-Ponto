import { IoMdEye } from 'react-icons/io';

interface HistoryTableProps {
  history: { date: string; totalTime: string }[]; 
  onViewDetails: (date: string, totalTime: string) => void;
}

const formatTime = (totalTime: string): string => {
  const [hours, minutes] = totalTime.split(':');
  return `${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m`;
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const HistoryTable: React.FC<HistoryTableProps> = ({ history, onViewDetails }) => {

  return (
    <>
      {history.length > 0 ? (
        <div className="mt-4 bg-white rounded" style={{ fontFamily: 'Roboto, sans-serif' }}>
          <div className="w-100">
            <div className="table-responsive" style={{ maxHeight: '720px' }}>
              <table className="table" style={{ borderCollapse: 'collapse', border: 'none' }}>
                <thead>
                  <tr className="table-header">
                    <th>Data</th>
                    <th>Horas Trabalhadas</th>
                    <th>Ação</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((entry, index) => (
                    <tr key={index} style={{ border: 'none' }}>
                      <td className="table-header-tr" style={{ color: '#454B54' }}>{formatDate(entry.date)}</td>
                      <td className="table-header-tr" style={{ color: '#454B54' }}>
                        {formatTime(entry.totalTime)}
                      </td>
                      <td className="table-header-tr" style={{ color: '#454B54' }}>
                        <IoMdEye className="fs-3"
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
    </>
  );
};

export default HistoryTable;
