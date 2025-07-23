const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const Expense = require("../models/Expense");

// ✅ Create a new expense
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { category, amount, comments } = req.body;

    if (!category || !amount) {
      return res.status(400).json({ msg: "Category and amount are required" });
    }

    const newExpense = new Expense({
      userId: req.user.id,
      category,
      amount,
      comments,
    });

    const savedExpense = await newExpense.save();
    res.status(201).json(savedExpense);
  } catch (err) {
    console.error("Error adding expense:", err.message);
    res.status(500).json({ msg: "Server error while adding expense" });
  }
});

// ✅ Get all expenses for the logged-in user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(expenses);
  } catch (err) {
    console.error("Error fetching expenses:", err.message);
    res.status(500).json({ msg: "Server error while fetching expenses" });
  }
});

// ✅ Update an existing expense
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const updatedExpense = await Expense.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    );

    if (!updatedExpense) {
      return res.status(404).json({ msg: "Expense not found" });
    }

    res.json(updatedExpense);
  } catch (err) {
    console.error("Error updating expense:", err.message);
    res.status(500).json({ msg: "Server error while updating expense" });
  }
});

// ✅ Delete an expense
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const deleted = await Expense.findOneAndDelete({ _id: req.params.id, userId: req.user.id });

    if (!deleted) {
      return res.status(404).json({ msg: "Expense not found" });
    }

    res.json({ msg: "Expense deleted successfully" });
  } catch (err) {
    console.error("Error deleting expense:", err.message);
    res.status(500).json({ msg: "Server error while deleting expense" });
  }
});

module.exports = router;
