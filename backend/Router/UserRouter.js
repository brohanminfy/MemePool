// routes/meme.js
import express from 'express';
import signUp from '../controller/signUp'
import login from '../controller/login'

const urouter = express.Router();

urouter.post('/signup', signUp);
urouter.post('/login', login)

export default urouter;