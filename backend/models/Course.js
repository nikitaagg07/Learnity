const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String },
  status: { type: String, required: true, enum: ["draft", "published"], default: "draft" },
  level: { type: String },
  primaryLanguage: { type: String },
  subtitle: { type: String },
  description: { type: String },
  pricing: { type: Number, required: true },
  objectives: { type: String },
  welcomeMessage: { type: String },
  image: { type: String }, // ✅ Ensure image is a String
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Instructor',
    required: true
  },
  date: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
  // ✅ Updated Curriculum Schema
  curriculum: [
    {
      title: { type: String, required: true },
      videoUrl: { type: String, required: true },
      resources: [{ title: String, link: String }],
      quiz: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz" },
      freePreview: { type: Boolean, default: false },
      public_id: { type: String, default: "" } // Optional field for cloud storage reference
    }
  ],
  isPublished: { type: Boolean, default: false },
  enrolledLearners: [{ type: mongoose.Schema.Types.ObjectId, ref: "Learner" }],
}, { timestamps: true });

module.exports = mongoose.model("Course", courseSchema);
