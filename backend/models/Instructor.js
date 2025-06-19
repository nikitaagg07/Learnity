const mongoose = require("mongoose");

const instructorSchema = new mongoose.Schema({
  Salutation: { 
    type: String, 
    required: true,
    enum: ['Mr.', 'Mrs.', 'Ms.', 'Dr.']
  },
  FName: { type: String, required: true },
  LName: { type: String, required: true },
  DOB: { type: Date, required: true },
  Email: {
    type: String,
    required: true,
    unique: true,
    match: /^[^\s@]+@[^\s@]+$/,
  },
  Mobile: {
    type: String,
    required: true,
    unique: true,
    match: /^\d{10}$/,
  },
  AddressLine1: { type: String, required: true },
  AddressLine2: { type: String },
  City: { type: String, required: true },
  State: { type: String, required: true },
  Country: { type: String, required: true },
  Qualification: { type: String, required: true },
  Experience: { type: String, required: true },
  Password: { type: String, required: true, select: false },
  Courses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
  ApprovalStatus: { 
    type: String, 
    enum: ['pending', 'approved'], 
    default: 'pending' 
  }
}, { timestamps: true });

const Instructor = mongoose.model("Instructor", instructorSchema);
module.exports = Instructor;
