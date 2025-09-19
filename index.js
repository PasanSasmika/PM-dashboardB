import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import Userrouter from './routes/UserRoute.js';
import Projectrouter from './routes/ProjectRoute.js';

dotenv.config();

const app = express();
const mongoUrl = process.env.MONGODB_URI;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

mongoose.connect(mongoUrl, {})
  .then(() => {
    console.log("Database connected");
  })
  .catch(err => {
    console.error("Database connection error:", err);
  });

app.use(cors());
app.use(bodyParser.json());

app.use((req, res, next) => {
  const token = (req.header("Authorization"))?.replace("Bearer ", "");
  
  if (token != null) {
    jwt.verify(token, process.env.SECRET, (error, decoded) => {
      if (!error) {
        req.user = decoded;
      }
    });
  }
  next();
});

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Mount the user and project routes
app.use("/api/users", Userrouter);
app.use("/api/projects", Projectrouter);

app.listen(
  5000,
  ()=>{
    console.log('Server is running on port 5000');
  }
)
