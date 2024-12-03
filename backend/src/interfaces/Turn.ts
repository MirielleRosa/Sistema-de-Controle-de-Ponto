export interface Turn {
  id?: number; 
  userId: string;
  startTime: Date;
  endTime: Date | null;
  totalHours: number | null; 
}
