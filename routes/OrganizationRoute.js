// routes/Organizationrouter.js (updated with new routes)
import express from 'express';
import multer from 'multer';
import path from 'path';
import { 
  addDocumentToOrganization, 
  addDocumentToProject, 
  createOrganizationWithFile, 
  deleteOrganization, 
  getAllOrganizations, 
  getOrganizationById, 
  updateOrganization,
  addProjectToOrganization,
  deleteProjectFromOrganization,
  updateProjectInOrganization
} from '../controllers/OrganizationController.js';

const Organizationrouter = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); 
  },
  filename: function (req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ storage: storage });

Organizationrouter.get('/', getAllOrganizations);

Organizationrouter.post('/', upload.array('files', 10), createOrganizationWithFile);

Organizationrouter.get('/:id', getOrganizationById);

Organizationrouter.put('/:id', updateOrganization);

Organizationrouter.delete('/:id', deleteOrganization);

Organizationrouter.post('/:id/documents', upload.array('files', 10), addDocumentToOrganization);

Organizationrouter.post('/:id/projects/:projectId/documents', upload.array('files', 10), addDocumentToProject);

Organizationrouter.post('/:id/projects', addProjectToOrganization);
Organizationrouter.delete('/:id/projects/:projectId', deleteProjectFromOrganization);
Organizationrouter.put('/:id/projects/:projectId', updateProjectInOrganization);

export default Organizationrouter;