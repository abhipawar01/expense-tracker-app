// src/pages/Landing.js
import React from "react";
import { Link } from "react-router-dom";

function Landing() {
  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>Welcome to Expense Tracker 💰</h2>
      <p>Please login or register to continue</p>
      <Link to="/login">
        <button style={{ margin: "10px", padding: "10px 20px" }}>Login</button>
      </Link>
      <Link to="/register">
        <button style={{ margin: "10px", padding: "10px 20px" }}>Sign Up</button>
      </Link>
    </div>
  );
}

export default Landing;
