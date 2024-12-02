import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api', 
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const startTurn = async (userId: number) => {
  return await api.post('/start', { userId });
};

export const endTurn = async (turnId: number) => {
  return await api.post(`/end/${turnId}`);
};

export const getTotalWorkedHours = async (userId: number) => {
  return await api.get(`/total/${userId}`);
};

export const getWorkedHoursHistory = async (userId: number) => {
  return await api.get(`/history/${userId}`);
};

export const getDetailsByDate = async (userId: number, date: string) => {
  return await api.get(`/turn-details/${userId}/${date}`);
};

export default api;