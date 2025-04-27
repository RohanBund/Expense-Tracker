import React, { useState, useEffect } from 'react';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import Dashboard from './components/Dashboard';
import axios from 'axios';
import './App.css';

function App() {
  const [selectedScreen, setSelectedScreen] = useState('expenses');
  const [expenses, setExpenses] = useState([]);
  const [selectedExpense, setSelectedExpense] = useState(null); // Track selected expense

  // Function to fetch expenses from backend
  const fetchExpenses = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/expenses');
      setExpenses(response.data);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };

  // Fetch expenses when the component mounts
  useEffect(() => {
    fetchExpenses();
  }, []);

  // Handle screen change
  const handleScreenChange = (event) => {
    setSelectedScreen(event.target.value);
  };

  return (
    <div className="App">
      <div className="container">
        <h1>Expense Tracker</h1>

        <div className="radio-buttons">
          <label>
            <input
              type="radio"
              value="expenses"
              checked={selectedScreen === 'expenses'}
              onChange={handleScreenChange}
            />
            Expenses
          </label>

          <label>
            <input
              type="radio"
              value="dashboard"
              checked={selectedScreen === 'dashboard'}
              onChange={handleScreenChange}
            />
            Dashboard
          </label>
        </div>

        {selectedScreen === 'expenses' && (
          <>
            <ExpenseForm
              fetchExpenses={fetchExpenses}
              selectedExpense={selectedExpense}  // Pass selectedExpense to ExpenseForm
              setSelectedExpense={setSelectedExpense}  // Pass setSelectedExpense to ExpenseForm
            />
            <ExpenseList
              expenses={expenses}
              fetchExpenses={fetchExpenses}
              setSelectedExpense={setSelectedExpense}  // Pass setSelectedExpense to ExpenseList
            />
          </>
        )}

        {selectedScreen === 'dashboard' && <Dashboard expenses={expenses} />} {/* Pass expenses to Dashboard */}
      </div>
    </div>
  );
}

export default App;
