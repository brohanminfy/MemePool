import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import mrouter from './Router/MemeRouter.js';
import urouter from './Router/UserRouter.js'

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/api/meme', mrouter);
app.use('/api/verify',urouter)

await connectDB()

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });

