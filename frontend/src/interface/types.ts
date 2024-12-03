export interface TurnButtonProps {
  userId: string | undefined;
  fetchData: () => void;
}

export default interface WorkedHoursHistory {
  date: string; 
  totalHours: number;
}

export interface WorkedHours {
  startTime: string;
  endTime: string | null;
}

export interface WorkedHoursTableProps {
  workedHoursToday: {
    startTime: string; // Ajuste o tipo conforme necessário (string, Date, etc.)
    endTime: string | null;
    startDate: string; // Data da entrada
  }[];
}

export interface HistoryEntry {
  date: string;    
  totalTime: string;  
}

export interface WorkedDetails {
  startTime: string;  
  endTime: string | null;  
  totalTime: string; 
}

export interface HistoryPageState {
  history: HistoryEntry[]; 
  error: string | null;    
  modalShow: boolean;      
  details: WorkedDetails[];
}

export interface TimeDisplayProps {
  elapsedTime: number;
}
