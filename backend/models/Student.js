const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  name: String,
  feesPaid: { type: Number, default: 0 },
  feesDue: { type: Number, default: 0 },
});

module.exports = mongoose.model("Student", studentSchema);
