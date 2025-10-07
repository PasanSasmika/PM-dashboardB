// controllers/OrganizationController.js (updated with new functions)
import mongoose from 'mongoose';
import Organization from '../models/Organizations.js';

export const createOrganizationWithFile = async (req, res) => {
  let organizationData;
  try {
    organizationData = JSON.parse(req.body.organizationData);
  } catch (error) {
    return res.status(400).json({ message: 'Invalid organization data format. Must be a JSON string.' });
  }

  try {
    const uploadedFiles = req.files || [];
    
    const documents = uploadedFiles.map(file => ({
      fileName: file.originalname,
      url: `/${file.path.replace(/\\/g, '/')}`, 
      fileType: file.mimetype,
      documentType: 'Other' // Default for initial upload
    }));
    
    // No projects in create now
    const normalizedData = {
      ...organizationData,
      documents: documents,
      projects: [], // Start empty
    };
    
    const newOrganization = new Organization(normalizedData);
    
    await newOrganization.save();

    res.status(201).json({
      message: 'Organization and documents created successfully',
      organization: newOrganization,
    });

  } catch (error) {
    const statusCode = error.code === 11000 ? 409 : 400; 
    res.status(statusCode).json({
      message: 'Failed to create organization',
      error: error.message,
    });
  }
};

export const getAllOrganizations = async (req, res) => {
  try {
    const organizations = await Organization.find()
      .populate('customers');
      
    res.status(200).json(organizations);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve organizations.", error: error.message });
  }
};

export const getOrganizationById = async (req, res) => {
  try {
    const organization = await Organization.findById(req.params.id)
      .populate('customers');
      
    if (!organization) {
      return res.status(404).json({ message: 'Organization not found.' });
    }
    res.status(200).json(organization);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve organization.', error: error.message });
  }
};

export const updateOrganization = async (req, res) => {
  try {
    // Update only org fields, no projects
    const updateData = {
      ...req.body,
      // Exclude projects to avoid overwriting
    };

    const updatedOrganization = await Organization.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    if (!updatedOrganization) {
      return res.status(404).json({ message: 'Organization not found.' });
    }
    res.status(200).json({ message: 'Organization updated successfully.', organization: updatedOrganization });
  } catch (error) {
    const statusCode = error.code === 11000 ? 409 : 400;
    res.status(statusCode).json({ message: 'Failed to update organization.', error: error.message });
  }
};

export const deleteOrganization = async (req, res) => {
  try {
    const deletedOrganization = await Organization.findByIdAndDelete(req.params.id);
    if (!deletedOrganization) {
      return res.status(404).json({ message: 'Organization not found.' });
    }
    res.status(200).json({ message: 'Organization deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete organization.', error: error.message });
  }
};

export const addDocumentToOrganization = async (req, res) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: 'No files were uploaded.' });
    }

    const { documentType } = req.body; 

    try {
        const organization = await Organization.findById(req.params.id);
        if (!organization) {
            return res.status(404).json({ message: 'Organization not found.' });
        }

        const newDocuments = req.files.map(file => ({
            fileName: file.originalname,
            url: `/${file.path.replace(/\\/g, '/')}`,
            fileType: file.mimetype,
            documentType: documentType || 'Other'
        }));

        organization.documents.push(...newDocuments);
        await organization.save();

        res.status(200).json({
            message: 'Document(s) added successfully.',
            organization: organization,
        });

    } catch (error) {
        res.status(400).json({
            message: 'Failed to add document(s) to organization.',
            error: error.message,
        });
    }
};

export const addDocumentToProject = async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: 'No files were uploaded.' });
  }

  const { documentType } = req.body;
  const { id: orgId, projectId } = req.params;

  try {
    const organization = await Organization.findById(orgId);
    if (!organization) {
      return res.status(404).json({ message: 'Organization not found.' });
    }

    const project = organization.projects.id(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found.' });
    }

    const newDocuments = req.files.map(file => ({
      fileName: file.originalname,
      url: `/${file.path.replace(/\\/g, '/')}`,
      fileType: file.mimetype,
      documentType: documentType || 'Other'
    }));

    project.documents.push(...newDocuments);
    await organization.save();

    res.status(200).json({
      message: 'Document(s) added successfully to project.',
      organization: organization,
    });

  } catch (error) {
    res.status(400).json({
      message: 'Failed to add document(s) to project.',
      error: error.message,
    });
  }
};

// New: Add project to organization
export const addProjectToOrganization = async (req, res) => {
  try {
    const { name, description, status = 'Initiated', currentStage = 'Planning', done = [], todo = [], contactPerson } = req.body;

    // Validate required fields
    if (!name || !contactPerson?.role || !contactPerson?.name) {
      return res.status(400).json({ 
        message: 'Missing required fields: name, contactPerson.role, contactPerson.name' 
      });
    }

    const organization = await Organization.findById(req.params.id);
    if (!organization) {
      return res.status(404).json({ message: 'Organization not found.' });
    }

    const newProject = {
      name,
      description,
      status,
      currentStage,
      done: Array.isArray(done) ? done : [],
      todo: Array.isArray(todo) ? todo : [],
      contactPerson: {
        role: contactPerson.role.trim(),
        name: contactPerson.name.trim(),
        email: contactPerson.email?.trim() || '',
        phone: contactPerson.phone?.trim() || '',
      },
    };

    organization.projects.push(newProject);
    await organization.save();

    res.status(201).json({
      message: 'Project added successfully.',
      organization,
    });
  } catch (error) {
    res.status(400).json({ 
      message: 'Failed to add project to organization.', 
      error: error.message 
    });
  }
};

export const deleteProjectFromOrganization = async (req, res) => {
  try {
    const { id: orgId, projectId } = req.params;

    const organization = await Organization.findById(orgId);
    if (!organization) {
      return res.status(404).json({ message: 'Organization not found.' });
    }

    const projectIndex = organization.projects.findIndex(p => p._id.toString() === projectId);
    if (projectIndex === -1) {
      return res.status(404).json({ message: 'Project not found.' });
    }

    organization.projects.pull({ _id: projectId });
    await organization.save();

    res.status(200).json({ 
      message: 'Project deleted successfully.', 
      organization 
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Failed to delete project.', 
      error: error.message 
    });
  }
};

// New: Update project in organization
export const updateProjectInOrganization = async (req, res) => {
  try {
    const { id: orgId, projectId } = req.params;
    const updateData = req.body;

    // Normalize update data similar to before
    const normalizedUpdate = {
      ...updateData,
      contactPerson: {
        ...updateData.contactPerson,
        role: updateData.contactPerson?.role || '',
        name: updateData.contactPerson?.name || '',
      },
      done: updateData.done || [],
      todo: updateData.todo || [],
    };

    const organization = await Organization.findById(orgId);
    if (!organization) {
      return res.status(404).json({ message: 'Organization not found.' });
    }

    const project = organization.projects.id(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found.' });
    }

    Object.assign(project, normalizedUpdate);
    await organization.save();

    res.status(200).json({ 
      message: 'Project updated successfully.', 
      organization 
    });
  } catch (error) {
    res.status(400).json({ 
      message: 'Failed to update project.', 
      error: error.message 
    });
  }
};