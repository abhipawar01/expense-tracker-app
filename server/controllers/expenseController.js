const Expense = require("../models/Expense");

// @desc    Create new expense
// @route   POST /api/expenses
// @access  Private
const createExpense = async (req, res) => {
  const { category, amount, comments } = req.body;

  if (!category || !amount) {
    return res.status(400).json({ msg: "Category and amount are required" });
  }

  try {
    const newExpense = new Expense({
      user: req.user.id, // coming from auth middleware
      category,
      amount,
      comments,
    });

    const savedExpense = await newExpense.save();
    res.status(201).json(savedExpense);
  } catch (err) {
    console.error("Error saving expense:", err);
    res.status(500).json({ msg: "Server error while saving expense" });
  }
};

// @desc    Get all expenses for a user
// @route   GET /api/expenses
// @access  Private
const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(expenses);
  } catch (err) {
    console.error("Error fetching expenses:", err);
    res.status(500).json({ msg: "Server error while fetching expenses" });
  }
};

module.exports = { createExpense, getExpenses };
