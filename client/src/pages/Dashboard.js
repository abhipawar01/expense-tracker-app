import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Dashboard.css";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [newExpense, setNewExpense] = useState({
    category: "",
    amount: "",
    comments: "",
  });
  const [editingId, setEditingId] = useState(null);

  const fetchExpenses = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/expenses", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setExpenses(res.data);
    } catch (err) {
      alert("Failed to load expenses");
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleChange = (e) => {
    setNewExpense({ ...newExpense, [e.target.name]: e.target.value });
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      if (editingId) {
        await axios.put(`http://localhost:5000/api/expenses/${editingId}`, newExpense, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("Expense updated!");
      } else {
        await axios.post("http://localhost:5000/api/expenses", newExpense, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("Expense added!");
      }

      setNewExpense({ category: "", amount: "", comments: "" });
      setEditingId(null);
      fetchExpenses();
    } catch (err) {
      alert(err.response?.data?.msg || "Failed to save expense");
    }
  };

  const handleEdit = (exp) => {
    setNewExpense({
      category: exp.category,
      amount: exp.amount,
      comments: exp.comments,
    });
    setEditingId(exp._id);
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this expense?");
    if (!confirm) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/expenses/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Expense deleted!");
      fetchExpenses();
    } catch (err) {
      alert("Failed to delete expense");
    }
  };

  const pieData = {
    labels: [...new Set(expenses.map((e) => e.category))],
    datasets: [
      {
        data: expenses.reduce((acc, curr) => {
          const index = acc.findIndex((item) => item.category === curr.category);
          if (index !== -1) {
            acc[index].amount += curr.amount;
          } else {
            acc.push({ category: curr.category, amount: curr.amount });
          }
          return acc;
        }, []).map((item) => item.amount),
        backgroundColor: [
          "#ff6384", "#36a2eb", "#ffce56", "#4bc0c0", "#9966ff", "#ff9f40",
        ],
      },
    ],
  };

  return (
    <div className="dashboard-container">
      <h2>Dashboard</h2>

      <form className="add-expense-form" onSubmit={handleAddExpense}>
        <input
          type="text"
          name="category"
          placeholder="Category"
          value={newExpense.category}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="amount"
          placeholder="Amount"
          value={newExpense.amount}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="comments"
          placeholder="Comments"
          value={newExpense.comments}
          onChange={handleChange}
        />
        <button type="submit">{editingId ? "Update" : "Add"}</button>
      </form>

      <div className="dashboard-content">
        <div className="expense-table">
          <h3>Expenses</h3>
          <table border="1" cellPadding="10" width="100%">
            <thead>
              <tr>
                <th>Category</th>
                <th>Amount</th>
                <th>Comments</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((exp) => (
                <tr key={exp._id}>
                  <td>{exp.category}</td>
                  <td>₹{exp.amount}</td>
                  <td>{exp.comments}</td>
                  <td>{new Date(exp.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button onClick={() => handleEdit(exp)} style={{ marginRight: "10px" }}>
                      ✏️
                    </button>
                    <button onClick={() => handleDelete(exp._id)}>🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="pie-chart">
          <h3>Category-wise Chart</h3>
          <Pie data={pieData} />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
