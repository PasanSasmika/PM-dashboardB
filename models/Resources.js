import mongoose from 'mongoose';

const resourcesSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
 
  files: [
    {
      fileName: {
        type: String,
        required: true
      },
      url: {
        type: String,
        required: true
      },
      fileType: {
        type: String
      },
      uploadedAt: {
        type: Date,
        default: Date.now
      }
    }
  ]
}, { timestamps: true });

const Resources = mongoose.model('Resources', resourcesSchema);

export default Resources;