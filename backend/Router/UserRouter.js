// routes/meme.js
import express from 'express';
import signUp from '../controller/signUp'
import login from '../controller/login'
import authminfy from '../minfyauth/authminfy';

const urouter = express.Router();

urouter.post('/signup', authminfy,signUp);
urouter.post('/login', authminfy,login)

export default urouter;