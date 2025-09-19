import express from 'express';
import multer from 'multer';
import path from 'path';

import { createProjectWithFile, getAllProjects } from '../controllers/ProjectController.js';

const Projectrouter = express.Router();

// Configure Multer for local disk storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ storage: storage });

// This is the correct GET route to fetch all projects
Projectrouter.get('/', getAllProjects);

// The POST route remains the same
Projectrouter.post('/', upload.single('file'), createProjectWithFile);

export default Projectrouter;