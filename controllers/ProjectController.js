import Project from "../models/Projects.js";

export const createProjectWithFile = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file was uploaded.' });
  }

  // Parse the project data from the form-data field
  let projectData;
  try {
    projectData = JSON.parse(req.body.projectData);
  } catch (error) {
    return res.status(400).json({ message: 'Invalid project data format. Must be a JSON string.' });
  }
  
  try {
    const filePath = req.file.path;
    
    // Create the new project document
    const newProject = new Project({
      ...projectData,
      files: [{
        fileName: req.file.originalname,
        url: `/${filePath}`,
        fileType: req.file.mimetype,
      }],
    });
    
    await newProject.save();

    res.status(201).json({
      message: 'Project and file created successfully',
      project: newProject,
    });

  } catch (error) {
    res.status(400).json({
      message: 'Failed to create project and upload file',
      error: error.message,
    });
  }
};




export const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find();
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve projects.", error: error.message });
  }
};