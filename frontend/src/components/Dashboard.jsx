import React from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';

const Dashboard = ({ expenses = [] }) => {
  if (!expenses.length) return <div>No data to display yet.</div>;

  // Utility function to group expenses
  const groupExpenses = (data, keyFn) => {
    return Object.values(data.reduce((acc, curr) => {
      const key = keyFn(curr);
      acc[key] = acc[key] || { name: key, value: 0 };
      acc[key].value += curr.amount;
      return acc;
    }, {}));
  };

  const categoryData = groupExpenses(expenses, expense => expense.category);
  const monthData = groupExpenses(expenses, expense => new Date(expense.date).toLocaleString('default', { month: 'short' }));

  // Group expenses by date for Pie chart per day
  const expensesByDate = expenses.reduce((acc, curr) => {
    const dateKey = new Date(curr.date).toISOString().split('T')[0];
    acc[dateKey] = acc[dateKey] || [];
    acc[dateKey].push(curr);
    return acc;
  }, {});

  // Prepare pie data by category
  const preparePieData = (expensesForDate) => {
    return groupExpenses(expensesForDate, expense => expense.category);
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AA336A', '#6600CC'];

  return (
    <div>
      <h2>Dashboard</h2>

      {/* Render PieChart for each date */}
      {Object.entries(expensesByDate).map(([date, expensesOnDate]) => {
        const pieData = preparePieData(expensesOnDate);

        return (
          <div key={date} style={{ marginBottom: '40px', textAlign: 'center' }}>
            <h3>Expenses for {date}</h3>
            <PieChart width={400} height={300}>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {pieData.map((entry, idx) => (
                  <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </div>
        );
      })}

      {/* Render BarChart for expenses by month */}
      <BarChart width={500} height={300} data={monthData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="value" fill="#8884d8" />
        <Legend />
      </BarChart>
    </div>
  );
};

export default Dashboard;
