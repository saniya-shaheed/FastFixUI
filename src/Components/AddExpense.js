import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Expenses.css";
import { API_BASE_URL } from "../apiConfig";

function AddExpense() {
  const [expenseData, setExpenseData] = useState({
    expense: "",
    amount: "",
  });
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    const expenseToAdd = {
      ...expenseData,
    };
    axios
      .post(`${API_BASE_URL}/api/expenses`, expenseToAdd)
      .then((response) => {
        console.log("Expense added", expenseData);
        navigate("/expenses");
      })
      .catch((error) => {
        console.error("Error adding expense", error);
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setExpenseData({ ...expenseData, [name]: value });
  };
  return (
    <section className="add-expense p-3 p-md-5">
      <h1> New Expense </h1>
      <hr />
      <form onSubmit={handleSubmit}>
        <div className="d-flex flex-column add-expense-form pt-5">
          <div className="expense-label ">
            <label> Expense: </label>
            <input
              name="expense"
              id="expense"
              value={expenseData.expense}
              onChange={handleChange}
              required
            />
          </div>
          <div className="pt-1">
            <label> Amount (AED): </label>
            <input
              name="amount"
              id="amount"
              value={expenseData.amount}
              onChange={handleChange}
              required
            />
          </div>
          <div className="pt-2 add-expense-button w-sm-100 d-flex justify-content-center">
            <button type="submit" className="btn w-sm-25">
              {" "}
              Add Expense{" "}
            </button>
          </div>
        </div>
      </form>
    </section>
  );
}

export default AddExpense;
