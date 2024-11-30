import express from 'express';
import turnRoutes from './routes/turn';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config()

const app = express();

app.use(express.json());
app.use(cors({
    origin: '*',
    allowedHeaders: '*'
}));
app.use('/api', turnRoutes);


export default app;
