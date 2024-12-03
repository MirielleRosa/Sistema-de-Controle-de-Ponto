import axios from 'axios';

const api = axios.create({
  baseURL: 'https://sistema-de-controle-de-ponto-ilumeo.onrender.com/api', 
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
