import express from 'express';
import { addUser, getAllUsers, loginUser } from '../controllers/UserController.js';

const Userrouter = express.Router();

Userrouter.post('/', addUser);

Userrouter.post('/login', loginUser);

Userrouter.get('/',  getAllUsers);

export default Userrouter;
