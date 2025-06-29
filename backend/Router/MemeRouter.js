// routes/meme.js
import express from 'express';
import upload from '../middleware/uploadMiddleware.js';
import Meme from '../models/MemeModel.js';
import uploadMeme from '../controller/uploadMeme.js';
import getAllMeme from '../controller/getAllMeme.js';

const mrouter = express.Router();

mrouter.post('/upload', upload.array('memes', 10), uploadMeme);
mrouter.get('/getmeme',getAllMeme)

export default mrouter;
