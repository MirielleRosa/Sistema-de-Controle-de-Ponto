import dotenv from 'dotenv';
dotenv.config();  
import app from './app';
import sequelize from './config/database';

const PORT = process.env.PORT;

app.listen(PORT, async () => {
    await sequelize.sync();
    console.log(`Server is running on port ${PORT}`);
});