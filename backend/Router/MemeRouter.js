// routes/meme.js
import express from 'express';
import upload from '../middleware/uploadMiddleware.js';
import Meme from '../models/MemeModel.js';
import uploadMeme from '../controller/uploadMeme.js';
import getAllMeme from '../controller/getAllMeme.js';
import auth from '../authentication/auth.js'
import likeMeme from '../controller/Like.js';
import deleteMeme from '../controller/deleteMeme.js';

const mrouter = express.Router();

mrouter.post('/upload',auth, upload.array('memes', 1), uploadMeme);
mrouter.get('/getmeme',auth, getAllMeme)
mrouter.put('/likes/:id',auth,likeMeme)
mrouter.delete('/delete/:id',auth,deleteMeme)


export default mrouter;
