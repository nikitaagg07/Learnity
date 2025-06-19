// import mongoose from "mongoose";

// const assignmentSchema = new mongoose.Schema({
//   title: {
//     type: String,
//     required: true,
//   },
//   section: {
//     type: String,
//     required: true,
//   },
//   description: {
//     type: String,
//   },
//   totalMarks: {
//     type: Number,
//     required: true,
//   },
//   dueDate: {
//     type: Date,
//     required: true,
//   },
//   maxWords: {
//     type: Number,
//   },
//   instructions: {
//     type: String,
//   },
//   cutOffDate: {
//     type: Date,
//   },
//   enableResubmission: {
//     type: Boolean,
//     default: false,
//   },
//   supportFiles: [{
//     type: String,
//   }],
// }, {
//   timestamps: true,
// });

// const Assignment = mongoose.model("Assignment", assignmentSchema);

// export default Assignment;


const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    section: { type: String, required: true },
    totalMarks: { type: Number, required: true },
    date: { type: Date, required: true },
    cutOffDate: { type: Date, default: null },
    description: { type: String, default: "" },
    maxWords: { type: Number, default: null },
    instructions: { type: String, default: "" },
    enableResubmission: { type: Boolean, default: false },
    supportFiles: { type: [String], default: [] },
  },
  { timestamps: true } // ✅ Enables `createdAt` and `updatedAt`
);

const Assignment = mongoose.model("Assignment", assignmentSchema);

module.exports = Assignment;
