export interface Turn {
  id?: number; 
  userId: number;
  startTime: Date;
  endTime: Date | null;
  totalHours: number | null; 
}
