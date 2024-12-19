import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { formatDate } from "./FormateDate";
import "../css/PartOrders.css";
import { API_BASE_URL } from "../apiConfig";

const PartOrders = () => {
  const navigate = useNavigate();
  const [partOrders, setPartOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState([]);
  const [showCheckbox, setShowCheckbox] = useState(false);
  const [month, setMonth] = useState(new Date().getMonth() + 1); // Default to current month (0-indexed, so +1)
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    // Fetch the employees list
    const fetchParts = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/part-orders`
        );
        console.log("API Response:", response.data); // Log the response
        if (Array.isArray(response.data)) {
          setPartOrders(response.data);
        } else {
          console.error("Data is not an array:", response.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchParts();
  }, []);

  const handleMonthChange = (e) => {
    setMonth(Number(e.target.value));
  };

  const handleYearChange = (e) => {
    setYear(Number(e.target.value));
  };

  const filteredOrders = partOrders.filter((order) => {
    const orderDate = new Date(order.date);
    return (
      orderDate.getMonth() + 1 === month && orderDate.getFullYear() === year
    ); // +1 for month adjustment
  });

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i); // Get the last 10 years

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

  const toggleCheckboxView = () => setShowCheckbox((prev) => !prev);

  const toggleOrderSelection = (orderId) => {
    setSelectedOrder((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId]
    );
  };

  const deleteSelectedOrder = async () => {
    if (selectedOrder.length === 0) {
      alert("Please select an item to delete");
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete the selected item?"
    );
    if (!confirmDelete) return;

    try {
      await Promise.all(
        selectedOrder.map((orderId) =>
          axios.delete(`${API_BASE_URL}/api/part-orders/${orderId}`)
        )
      );
      setPartOrders((prev) =>
        prev.filter((order) => !selectedOrder.includes(order._id))
      );
      setSelectedOrder([]);
      setShowCheckbox(false);
    } catch (error) {
      console.error("Error deleting item", error);
    }
  };

  const handleRowClick = (orderId) => {
    if (!showCheckbox) {
      navigate(`/part-orders/${orderId}`);
    }
  };

  return (
    <section className="part-orders p-3 p-md-5">
      <h1>Spare Parts Orders </h1>
      <hr />

      <div className="pt-3 d-flex flex-column flex-sm-row justify-content-between align-items-md-center mb-4">
        <div className="d-flex  mb-3 mb-md-0 employee-add-delete-button pt-sm-3">
          <button
            className="btn col-xl-9 me-sm-3 mb-2 mb-sm-0"
            onClick={() => navigate("/add-spare-parts")}
          >
            New Order
          </button>
          <button className="btn  col-xl-9" onClick={toggleCheckboxView}>
            {showCheckbox ? "Cancel" : "Delete Order"}
          </button>
        </div>

        <div className="d-flex flex-column flex-sm-row year-month-dropdowns">
          <label className="">
            <b>Month: </b>{" "}
          </label>
          <select
            className="btn dropdown-toggle  "
            value={month}
            onChange={handleMonthChange}
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
            onChange={handleYearChange}
          >
            {years.map((yearOption) => (
              <option key={yearOption} value={yearOption}>
                {yearOption}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div style={{ overflowX: "auto" }} className="pt-sm-4 ">
        <table className="table table-bordered bg-light">
          <thead className="table text-center">
            <tr>
              {showCheckbox && <th>Select</th>}
              <th style={{ width: "5%" }}> S.No </th>
              <th>Date</th>
              <th>Item</th>
              <th> Amount (AED) </th>
              <th>Supplier</th>
              <th>Phone</th>
              <th> Vehicle </th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order, index) => (
              <tr
                key={order._id}
                onClick={() => handleRowClick(order._id)}
                style={{ cursor: "pointer" }}
              >
                <td className="text-center"> {index + 1} </td>
                {showCheckbox && (
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedOrder.includes(order._id)}
                      onChange={() => toggleOrderSelection(order._id)}
                      className="del-checkbox"
                    />
                  </td>
                )}
                <td>{formatDate(order.date)}</td>
                <td>
                  <ul className="items-list list-unstyled mb-0">
                    {order.parts.length > 0 && (
                      <li>
                        {order.parts[0].item}
                        {order.parts.length > 1 && (
                          <span>
                            {" "}
                            <a href="#">and more...</a>
                          </span>
                        )}
                      </li>
                    )}
                  </ul>
                </td>
                <td className="text-center">{order.totalAmount}</td>
                <td>{order.supplier}</td>
                <td>{order.phone}</td>
                <td>{order.targetVehicle}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showCheckbox && (
        <button className="btn delete-employee" onClick={deleteSelectedOrder}>
          Delete Selected Order
        </button>
      )}
    </section>
  );
};

export default PartOrders;
