const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  category: { type: String, required: true },
  amount: { type: Number, required: true },
  comments: { type: String },
}, { timestamps: true });

module.exports = mongoose.model("Expense", expenseSchema);
