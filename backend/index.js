import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import router from './controller/MemeControllar.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/api/meme', router);

await connectDB()

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });

