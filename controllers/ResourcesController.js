import multer from "multer";
import path from "path";
import Resources from "../models/Resources.js";


export const createResources = async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: 'No files were uploaded.' });
  }

  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ message: 'Name is required.' });
  }

  try {
    const uploadedFiles = req.files;

    // Create the new resources document
    const newResources = new Resources({
      name,
      files: uploadedFiles.map(file => ({
        fileName: file.originalname,
        url: `/${file.path}`,
        fileType: file.mimetype,
      })),
    });

    await newResources.save();

    res.status(201).json({
      message: 'Resources and files created successfully',
      resources: newResources,
    });
  } catch (error) {
    res.status(400).json({
      message: 'Failed to create resources and upload files',
      error: error.message,
    });
  }
};

export const getAllResources = async (req, res) => {
  try {
    const resources = await Resources.find();
    res.status(200).json(resources);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve resources.", error: error.message });
  }
};

export const deleteResources = async (req, res) => {
  try {
    const deletedResources = await Resources.findByIdAndDelete(req.params.id);
    if (!deletedResources) {
      return res.status(404).json({ message: 'Resources not found.' });
    }
    res.status(200).json({ message: 'Resources deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete resources.', error: error.message });
  }
};

export const getResourcesById = async (req, res) => {
  try {
    const resources = await Resources.findById(req.params.id);
    if (!resources) {
      return res.status(404).json({ message: 'Resources not found.' });
    }
    res.status(200).json(resources);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve resources.', error: error.message });
  }
};