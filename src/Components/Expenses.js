import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { formatDate } from "./FormateDate";
import "../css/Expenses.css";
import { API_BASE_URL } from "../apiConfig";

function Expenses() {
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState([]);
  const [selectedExpenses, setSelectedExpenses] = useState([]);
  const [showCheckbox, setShowCheckbox] = useState(false);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [editingCell, setEditingCell] = useState(null);
  const [editValue, setEditValue] = useState("");

  const calculateTotalAmount = () =>
    filteredExpenses.reduce(
      (total, expense) => total + (expense.amount || 0),
      0
    );

  useEffect(() => {
    // Fetch expenses from the server
    const fetchExpenses = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/expenses`);
        setExpenses(response.data);
      } catch (error) {
        console.error("Error fetching expenses", error);
      }
    };
    fetchExpenses();
  }, []);

  // Handle deleting selected expenses
  const toggleCheckboxView = () => setShowCheckbox((prev) => !prev);

  const toggleExpenseSelection = (expenseId) => {
    setSelectedExpenses((prev) =>
      prev.includes(expenseId)
        ? prev.filter((id) => id !== expenseId)
        : [...prev, expenseId]
    );
  };

  const deleteSelectedExpenses = async () => {
    if (selectedExpenses.length === 0) {
      alert("Please select expenses to delete");
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete the selected expenses?"
    );
    if (!confirmDelete) return;

    try {
      await Promise.all(
        selectedExpenses.map((expenseId) =>
          axios.delete(`${API_BASE_URL}/api/expenses/${expenseId}`)
        )
      );
      setExpenses((prev) =>
        prev.filter((expense) => !selectedExpenses.includes(expense._id))
      );
      setSelectedExpenses([]);
      setShowCheckbox(false);
    } catch (error) {
      console.error("Error deleting expenses", error);
    }
  };

  // Filter expenses by month and year
  const filterExpensesByDate = () =>
    expenses.filter((expense) => {
      const expenseDate = new Date(expense.date);
      return (
        expenseDate.getMonth() + 1 === month &&
        expenseDate.getFullYear() === year
      );
    });

  const filteredExpenses = filterExpensesByDate();

  // Options for month and year dropdowns
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i);
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const handleCellClick = (expense, field) => {
    setEditingCell({ id: expense._id, field });
    setEditValue(expense[field]); // Set existing value for editing
  };

  const handleKeyDown = async (event, expenseId, field) => {
    if (event.key === "Enter") {
      try {
        // Determine the correct data type for the updated field
        const updatedExpense = {
          [field]: field === "amount" ? Number(editValue) : editValue,
        };

        // Update the expense in the database
        await axios.put(
          `${process.env.API_URL}/api/expenses/${expenseId}`,
          updatedExpense
        );

        // Update the state
        setExpenses((prev) =>
          prev.map((expense) =>
            expense._id === expenseId
              ? { ...expense, ...updatedExpense }
              : expense
          )
        );

        setEditingCell(null); // Exit editing mode
      } catch (error) {
        console.error("Error updating expense:", error);
      }
    }
  };

  return (
    <section className="expenses p-3 p-md-5">
      <h1>Expenses</h1>
      <hr />

      <div className="add-del-month-year pt-3 d-flex flex-column flex-sm-row justify-content-between align-items-md-center mb-4">
        <div className="d-flex  mb-3 mb-md-0 col-xl-4 add-delete-buttons">
          <button
            className="btn  w-50 me-sm-3 mb-2 mb-sm-0"
            onClick={() => navigate("/expenses/add-expense")}
          >
            Add Expense
          </button>
          <button className="btn w-50" onClick={toggleCheckboxView}>
            {showCheckbox ? "Cancel" : "Delete Expense"}
          </button>
        </div>

        {/* Dropdowns for Month and Year */}
        <div className="d-flex flex-column flex-sm-row year-month-dropdowns">
          <label className="">
            <b>Month: </b>{" "}
          </label>
          <select
            className="btn dropdown-toggle  "
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
          >
            {months.map((monthName, index) => (
              <option key={index} value={index + 1}>
                {monthName}
              </option>
            ))}
          </select>
          <label className="ps-sm-3">Year:</label>
          <select
            className="btn dropdown-toggle"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
          >
            {years.map((yearOption) => (
              <option key={yearOption} value={yearOption}>
                {yearOption}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div style={{ overflowX: "auto" }} className="pt-md-3">
        <table className="table table-bordered bg-light">
          <thead className="table text-center">
            <tr>
              {showCheckbox && <th>Select</th>}
              <th style={{ width: "5%" }}>Serial No.</th>
              <th style={{ width: "15%" }}>Date</th>
              <th>Expense</th>
              <th>Amount (AED)</th>
            </tr>
          </thead>
          <tbody>
            {filteredExpenses.map((expense, index) => (
              <tr key={expense._id}>
                {showCheckbox && (
                  <td className="text-center">
                    <input
                      type="checkbox"
                      checked={selectedExpenses.includes(expense._id)}
                      onChange={() => toggleExpenseSelection(expense._id)}
                      className="del-checkbox"
                    />
                  </td>
                )}
                <td className="text-center">{index + 1}</td>
                <td className="text-center">{formatDate(expense.date)}</td>
                <td
                  onClick={() => handleCellClick(expense, "expense")}
                  className="editable-cell"
                >
                  {editingCell?.id === expense._id &&
                  editingCell?.field === "expense" ? (
                    <input
                      type="text"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onKeyDown={(e) =>
                        handleKeyDown(e, expense._id, "expense")
                      }
                      className="form-control"
                    />
                  ) : (
                    expense.expense
                  )}
                </td>
                <td
                  onClick={() => handleCellClick(expense, "amount")}
                  className="editable-cell text-center"
                >
                  {editingCell?.id === expense._id &&
                  editingCell?.field === "amount" ? (
                    <input
                      type="number"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e, expense._id, "amount")}
                      className="form-control"
                    />
                  ) : (
                    expense.amount
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h4 className="total-expense">
        <b>Total Expense: AED {calculateTotalAmount()} </b>
      </h4>
      {showCheckbox && (
        <div className="del-selected-expense pt-3">
          <button onClick={deleteSelectedExpenses} className="col-xl-3 btn">
            Delete Selected
          </button>
        </div>
      )}
    </section>
  );
}

export default Expenses;
