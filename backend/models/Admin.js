const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  AdminID: {
    type: String,
    unique: true,
    default: function () {
      return `ADMIN-${Date.now()}`;
    },
  },
  
  name: { type: String, required: true },
  
  email: {
    type: String,
    required: true,
    unique: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  password: { type: String, required: true },
});

const Admin = mongoose.model("Admin", adminSchema);
module.exports = Admin;
