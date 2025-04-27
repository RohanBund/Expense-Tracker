const Expense = require('../models/Expense');

// Get expenses for the authenticated user
const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching expenses', error });
  }
};

// Create an expense for the authenticated user
const createExpense = async (req, res) => {
  const { category, amount, description, date } = req.body;

  const expense = new Expense({
    user: req.user, // Associate the expense with the logged-in user
    category,
    amount,
    description,
    date,
  });

  try {
    await expense.save();
    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({ message: 'Error creating expense', error });
  }
};

// Update an expense for the authenticated user
const updateExpense = async (req, res) => {
  const { id } = req.params;
  const { category, amount, description, date } = req.body;

  try {
    const expense = await Expense.findOne({ _id: id, user: req.user }); // Ensure the expense belongs to the logged-in user
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    expense.category = category || expense.category;
    expense.amount = amount || expense.amount;
    expense.description = description || expense.description;
    expense.date = date || expense.date;

    await expense.save();
    res.json(expense);
  } catch (error) {
    res.status(500).json({ message: 'Error updating expense', error });
  }
};

// Delete an expense for the authenticated user
const deleteExpense = async (req, res) => {
  const { id } = req.params;

  try {
    const expense = await Expense.findOneAndDelete({ _id: id, user: req.user }); // Ensure the expense belongs to the logged-in user
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }
    res.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting expense', error });
  }
};

module.exports = {
  getExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
};
