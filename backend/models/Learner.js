const mongoose = require("mongoose");
const bcrypt = require("bcryptjs"); // Use bcryptjs instead of bcrypt

const learnerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  courses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
  
}, { timestamps: true });


const Learner = mongoose.model("Learner", learnerSchema);
module.exports = Learner;
