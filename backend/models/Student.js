const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  feesPaid: { type: Number, default: 0 },
  feesDue: { type: Number, default: 0 },
  clerkId: { type: String, required: true }, // associate student with Clerk user
}, { timestamps: true });

module.exports = mongoose.model("Student", studentSchema);
