import React from 'react';
import { deleteExpense } from '../services/expenseService';

const ExpenseList = ({ expenses, fetchExpenses, setSelectedExpense }) => {
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await deleteExpense(id);
        fetchExpenses();
        alert('Expense deleted successfully!');
      } catch (error) {
        console.error('Error deleting expense:', error);
        alert('Failed to delete expense!');
      }
    }
  };

  return (
    <div className="expense-list">
      <h2>Your Expenses</h2>

      {expenses && expenses.length > 0 ? (
        <table className="expense-table">
          <thead>
            <tr>
              <th>Expense</th>
              <th>Date</th>
              <th>Description</th>
              <th>Category</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense) => (
              <tr key={expense._id}>
                <td>₹{expense.amount}</td>
                <td>{new Date(expense.date).toLocaleDateString()}</td>
                <td>{expense.description}</td>
                <td>{expense.category}</td>
                <td>
                  <button onClick={() => setSelectedExpense(expense)}>Edit</button>
                  <button onClick={() => handleDelete(expense._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="no-data">
          <h3>No expenses yet! Start adding some 🚀</h3>
        </div>
      )}
    </div>
  );
};

export default ExpenseList;
