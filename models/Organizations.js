// models/Organization.js (unchanged from initial, as it supports embedded projects)
import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema({
  fileName: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  fileType: {
    type: String,
  },
  documentType: {
    type: String,
    enum: ['UAT', 'PROD', 'Contract', 'Invoice', 'SOW', 'Other'],
    default: 'Other',
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

const contactDetailSchema = new mongoose.Schema({
  role: { 
    type: String,
    required: true,
    trim: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    trim: true,
  },
  phone: {
    type: String,
    trim: true,
  },
});

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  status: {
    type: String,
    enum: ['Initiated', 'In Progress', 'Completed', 'On Hold'],
    default: 'Initiated',
  },
  currentStage: {
    type: String,
    default: 'Planning',
  },
  done: [{
    type: String,
    trim: true,
  }],
  todo: [{
    type: String,
    trim: true,
  }],
  contactPerson: {
    role: { 
      type: String,
      required: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
  },
  documents: [documentSchema],
}, { timestamps: true });

const organizationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  address: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'Lead'],
    default: 'Active'
  },
  customers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer'
    }
  ],
  projects: [projectSchema],
  contactDetails: [
    contactDetailSchema
  ],
  documents: [
    documentSchema
  ]
}, { timestamps: true });

const Organization = mongoose.model('Organization', organizationSchema);

export default Organization;