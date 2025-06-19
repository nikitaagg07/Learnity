const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "Learner", required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  courseTitle: { type: String, required: true },  // Add this field
  amount: { type: Number, required: true },
  paymentMethod: { type: String, required: true },
  paymentStatus: { type: String, enum: ["Pending", "Success", "Failed", "Refunded"], default: "Pending" },
  transactionId: { type: String, required: true, unique: true },
}, { timestamps: true });

module.exports = mongoose.model("Payment", PaymentSchema);
