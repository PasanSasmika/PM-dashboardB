import Project from "../models/Projects.js";

export const createProjectWithFile = async (req, res) => {
  // Parse the project data from the form-data field
  let projectData;
  try {
    projectData = JSON.parse(req.body.projectData);
  } catch (error) {
    return res.status(400).json({ message: 'Invalid project data format. Must be a JSON string.' });
  }
  
  try {
    // Handle multiple files
    const uploadedFiles = req.files || [];
    
    // Create the new project document
    const newProject = new Project({
      ...projectData,
      files: uploadedFiles.map(file => ({
        fileName: file.originalname,
        url: `/${file.path}`,
        fileType: file.mimetype,
      })),
    });
    
    await newProject.save();

    res.status(201).json({
      message: 'Project and files created successfully',
      project: newProject,
    });

  } catch (error) {
    res.status(400).json({
      message: 'Failed to create project and upload files',
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


// Update a project
export const updateProject = async (req, res) => {
 try {
 const updatedProject = await Project.findByIdAndUpdate(
 req.params.id,
 req.body,
 { new: true, runValidators: true }
 );
 if (!updatedProject) {
 return res.status(404).json({ message: 'Project not found.' });
}
res.status(200).json({ message: 'Project updated successfully.', project: updatedProject });
} catch (error) {
res.status(400).json({ message: 'Failed to update project.', error: error.message });
}
};


export const deleteProject = async (req, res) => {
 try {
 const deletedProject = await Project.findByIdAndDelete(req.params.id);
if (!deletedProject) {
 return res.status(404).json({ message: 'Project not found.' });
 }
 res.status(200).json({ message: 'Project deleted successfully.' });
 } catch (error) {
 res.status(500).json({ message: 'Failed to delete project.', error: error.message });
}
};