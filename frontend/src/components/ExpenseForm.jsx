import React, { useState, useEffect } from 'react';
import axios from 'axios';

const categories = ['Food', 'Transport', 'Entertainment', 'Shopping'];

const ExpenseForm = ({ fetchExpenses, selectedExpense, setSelectedExpense }) => {
  const [form, setForm] = useState({
    amount: '',
    category: 'Food', // default
    description: '',
    date: '',
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedExpense) {
      // Format the date to "yyyy-MM-dd"
      const formattedDate = new Date(selectedExpense.date).toISOString().split('T')[0];
      
      setForm({
        amount: selectedExpense.amount,
        category: selectedExpense.category,
        description: selectedExpense.description,
        date: formattedDate,  // Use the formatted date here
      });
    }
  }, [selectedExpense]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (selectedExpense) {
        // If there's a selected expense, update it
        await axios.put(`http://localhost:5000/api/expenses/${selectedExpense._id}`, form);
        alert('Expense updated successfully!');
      } else {
        // Otherwise, create a new expense
        await axios.post('http://localhost:5000/api/expenses', form);
        alert('Expense added successfully!');
      }
      setForm({ amount: '', category: 'Food', description: '', date: '' });
      setSelectedExpense(null);  // Reset the selected expense after form submission
      fetchExpenses();  // Refresh the expenses list
    } catch (error) {
      console.error('Error handling expense:', error);
      alert('Something went wrong!');
    }
    setLoading(false);
  };

  return (
    <form className="expense-form" onSubmit={handleSubmit}>
      <h2>{selectedExpense ? 'Edit Expense' : 'Add New Expense'}</h2>

      <input
        type="number"
        name="amount"
        placeholder="Enter Amount (₹)"
        value={form.amount}
        onChange={handleChange}
        required
      />

      <select
        name="category"
        value={form.category}
        onChange={handleChange}
        required
      >
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>

      <input
        type="text"
        name="description"
        placeholder="Expense Description"
        value={form.description}
        onChange={handleChange}
        required
      />

      <input
        type="date"
        name="date"
        value={form.date}
        onChange={handleChange}
        required
      />

      <button type="submit" disabled={loading}>
        {loading ? 'Adding...' : selectedExpense ? 'Update Expense' : 'Add Expense'}
      </button>
    </form>
  );
};

export default ExpenseForm;
