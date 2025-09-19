import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['Planned', 'Ongoing', 'On Hold', 'Completed'],
    default: 'Planned'
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  budget: {
    allocated: {
      type: Number,
      default: 0
    },
    currency: {
      type: String,
      default: 'LKR'
    },
    costIncurred: {
      type: Number,
      default: 0
    }
  },
  teamMembers: [
    {
      name: {
        type: String,
        trim: true
      }
    }
  ],
  milestones: [
    {
      name: {
        type: String,
        required: true,
        trim: true
      },
      date: {
        type: Date,
        required: true
      },
      completed: {
        type: Boolean,
        default: false
      }
    }
  ],
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

const Project = mongoose.model('Project', projectSchema);

export default Project;