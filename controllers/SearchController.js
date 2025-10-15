import Customer from "../models/Customers.js";
import Organization from "../models/Organizations.js";
import Project from "../models/Projects.js";
import Resources from "../models/Resources.js";

// Global search across projects, customers, resources, and organizations
export const searchAll = async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q || q.trim() === "") {
      return res.status(200).json({
        projects: [],
        customers: [],
        resources: [],
        organizations: [],
      });
    }

    const pattern = q.trim(); // Use string pattern for consistency
    const regexOptions = "i"; // Case-insensitive

    // Parallel queries for efficiency
    const [projects, customers, resources, organizations] = await Promise.all([
      // Search Projects: name or description
      Project.find({
        $or: [
          { name: { $regex: pattern, $options: regexOptions } },
          { description: { $regex: pattern, $options: regexOptions } },
        ],
      }).lean(),

      // Search Customers: name, contactPerson, email, phone, address
      Customer.find({
        $or: [
          { name: { $regex: pattern, $options: regexOptions } },
          { contactPerson: { $regex: pattern, $options: regexOptions } },
          { email: { $regex: pattern, $options: regexOptions } },
          { phone: { $regex: pattern, $options: regexOptions } },
          { address: { $regex: pattern, $options: regexOptions } },
        ],
      }).lean(),

      // Search Resources: name or any fileName in files array
      Resources.find({
        $or: [
          { name: { $regex: pattern, $options: regexOptions } },
          { files: { $elemMatch: { fileName: { $regex: pattern, $options: regexOptions } } } },
        ],
      }).lean(),

      // Search Organizations: name, address, embedded projects (name/description), contactDetails (name/role/email/phone), documents (fileName)
      Organization.find({
        $or: [
          { name: { $regex: pattern, $options: regexOptions } },
          { address: { $regex: pattern, $options: regexOptions } },
          { "projects.name": { $regex: pattern, $options: regexOptions } },
          { "projects.description": { $regex: pattern, $options: regexOptions } },
          { "contactDetails.name": { $regex: pattern, $options: regexOptions } },
          { "contactDetails.role": { $regex: pattern, $options: regexOptions } },
          { "contactDetails.email": { $regex: pattern, $options: regexOptions } },
          { "contactDetails.phone": { $regex: pattern, $options: regexOptions } },
          { "documents.fileName": { $regex: pattern, $options: regexOptions } },
        ],
      }).lean(),
    ]);

    res.status(200).json({
      projects,
      customers,
      resources,
      organizations,
    });
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ message: "Failed to search.", error: error.message });
  }
};