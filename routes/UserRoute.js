import express from 'express';
import {  addUser, getAllUsers, login } from '../controllers/UserController.js';

const Userrouter = express.Router();

Userrouter.post('/', addUser);

Userrouter.get('/', getAllUsers);

// Userrouter.post('/signup', signup);

Userrouter.post('/login', login);

export default Userrouter;
