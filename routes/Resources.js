import express from 'express';
import multer from 'multer';
import path from 'path';
import { createResources, deleteResources, getAllResources, getResourcesById } from '../controllers/ResourcesController.js';


const ResourcesRouter = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ storage: storage });

ResourcesRouter.get('/', getAllResources);

ResourcesRouter.post('/', upload.array('files'), createResources);

ResourcesRouter.delete('/:id', deleteResources);

ResourcesRouter.get('/:id', getResourcesById);
export default ResourcesRouter;