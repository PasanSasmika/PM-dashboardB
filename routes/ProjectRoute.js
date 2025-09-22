import express from 'express';
import multer from 'multer';
import path from 'path';

import { createProjectWithFile, deleteProject, getAllProjects, updateProject } from '../controllers/ProjectController.js';

const Projectrouter = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ storage: storage });

Projectrouter.get('/', getAllProjects);

Projectrouter.post('/', upload.single('file'), createProjectWithFile);

Projectrouter.put('/:id', updateProject);
Projectrouter.delete('/:id', deleteProject);
export default Projectrouter;