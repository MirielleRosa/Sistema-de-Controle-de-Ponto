import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL ;

console.log("apiUrl", apiUrl)
const api = axios.create({
  baseURL: apiUrl,
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const startTurn = async (userId: string) => {
  return await api.post('/start', { userId });
};

export const endTurn = async (turnId: number) => { 
  return await api.post(`/end/${turnId}`);
};

export const getTotalWorkedHours = async (userId: string) => {
  return await api.get(`/total/${userId}`);
};

export const getWorkedHoursHistory = async (userId: string) => {
  return await api.get(`/history/${userId}`);
};

export const getDetailsByDate = async (userId: string, date: string) => {
  return await api.get(`/turn-details/${userId}/${date}`);
};

export const getWorkedHoursToday = async (userId: string) => {
  return await api.get(`/hours-today/${userId}`);
};


export default api;
