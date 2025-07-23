// client/src/components/ExpenseChart.js
import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const ExpenseChart = ({ expenses }) => {
  // Group amounts by category
  const categoryMap = {};

  expenses.forEach(exp => {
    categoryMap[exp.category] = (categoryMap[exp.category] || 0) + exp.amount;
  });

  const data = {
    labels: Object.keys(categoryMap),
    datasets: [
      {
        label: "Expense Breakdown",
        data: Object.values(categoryMap),
        backgroundColor: [
          "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40"
        ],
      }
    ]
  };

  return (
    <div style={{ maxWidth: "400px", margin: "auto" }}>
      <h3>Expenses by Category</h3>
      <Pie data={data} />
    </div>
  );
};

export default ExpenseChart;
