import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { formatDate } from "./FormateDate";
import "../css/Vehicles.css";
import { API_BASE_URL } from "../apiConfig";

function Vehicles() {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicles, setSelectedVehicles] = useState([]);
  const [showCheckboxes, setShowCheckboxes] = useState(false);
  const [month, setMonth] = useState(new Date().getMonth() + 1); // Default to current month (0-indexed, so +1)
  const [year, setYear] = useState(new Date().getFullYear()); // Default to current year

  // Fetch vehicles from the server
  useEffect(() => {
    function fetchVehicles() {
      axios
        .get(`${API_BASE_URL}/api/vehicles`)
        .then((response) => {
          setVehicles(response.data);
        })
        .catch((error) => {
          console.error("Error fetching vehicles", error);
        });
    }
    fetchVehicles();
  }, []);

  // Handle month and year change
  const handleMonthChange = (e) => {
    setMonth(Number(e.target.value));
  };

  const handleYearChange = (e) => {
    setYear(Number(e.target.value));
  };

  // Filter vehicles by selected month and year
  const filteredVehicles = vehicles.filter((vehicle) => {
    const vehicleDate = new Date(vehicle.date);
    return (
      vehicleDate.getMonth() + 1 === month && vehicleDate.getFullYear() === year
    ); // +1 for month adjustment
  });

  // Handle checkbox selection
  const handleCheckboxChange = (e, vehicleId) => {
    e.stopPropagation(); // Prevent the row click event from being triggered
    setSelectedVehicles((prevSelected) =>
      prevSelected.includes(vehicleId)
        ? prevSelected.filter((id) => id !== vehicleId)
        : [...prevSelected, vehicleId]
    );
  };

  // Handle delete button click
  const handleDeleteClick = () => {
    if (selectedVehicles.length === 0) {
      alert("Please select vehicles to delete");
      return;
    }

    // Show confirmation dialog
    const confirmDelete = window.confirm(
      "Are you sure you want to delete the selected vehicles?"
    );
    if (confirmDelete) {
      // Perform the delete operation for selected vehicles
      selectedVehicles.forEach((vehicleId) => {
        axios
          .delete(`${API_BASE_URL}/api/vehicles/${vehicleId}`)
          .then(() => {
            setVehicles(
              vehicles.filter((vehicle) => vehicle._id !== vehicleId)
            );
          })
          .catch((error) => {
            console.error("Error deleting vehicle", error);
          });
      });
      setSelectedVehicles([]);
      setShowCheckboxes(false); // Hide checkboxes after deletion
    }
  };

  // Handle row click event (for navigation)
  const handleRowClick = (vehicleId) => {
    if (!showCheckboxes) {
      navigate(`/vehicles/${vehicleId}`);
    }
  };

  // Get the current year for the year dropdown
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

  // Calculate total expenses
  const calculateTotalAmount = () =>
    filteredVehicles.reduce(
      (grandTotal, vehicle) => grandTotal + (vehicle.dueAmount || 0),
      0
    );
  const calculatePendingAmount = () =>
    filteredVehicles.reduce(
      (grandTotal, vehicle) => grandTotal + (vehicle.pendingAmount || 0),
      0
    );

  return (
    <section className="p-4 p-md-5 customers">
      <h1>Customers</h1>
      <hr />

      <div className="add-del-month-year pt-3 d-flex flex-column flex-sm-row justify-content-between align-items-md-center mb-4">
        <div className="d-flex  mb-3 mb-md-0 col-xl-4 add-delete-buttons">
          <button
            className="btn  me-sm-3 mb-2 mb-sm-0 w-50"
            onClick={() => navigate("/add-vehicle")}
          >
            Add Customer
          </button>
          <button
            className="btn w-50 "
            onClick={() => setShowCheckboxes(!showCheckboxes)}
          >
            {showCheckboxes ? "Cancel" : "Delete Customer"}
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
<p style={{color:"red"}}> Click on the row to get a customer's full details</p>
      <div style={{ overflowX: "auto" }} className="pt-md-3">
        <table className="table table-bordered bg-light">
          <thead className="">
            <tr className="text-center">
              {showCheckboxes && <th>Select</th>}
              <th> S.No </th>
              <th>Vehicle ID</th>

              <th style={{ width: "11%" }}>Date</th>
              <th>Customer Name</th>
              <th>Phone</th>
              <th>Vehicle</th>
              <th>Services</th>
              <th style={{ width: "10%" }}>Total Amount (AED)</th>
              <th style={{ width: "10%" }}>Pending Amount (AED) </th>
            </tr>
          </thead>
          <tbody>
            {filteredVehicles.map((vehicle, index) => (
              <tr
                key={vehicle._id}
                onClick={() => handleRowClick(vehicle._id)}
                style={{
                  cursor: showCheckboxes ? "default" : "pointer",
                  backgroundColor:
                    vehicle.pendingAmount !== 0 ? "#ddbab9" : "transparent",
                }}
              >
                {showCheckboxes && (
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedVehicles.includes(vehicle._id)}
                      onChange={(e) => handleCheckboxChange(e, vehicle._id)}
                      className="del-checkbox"
                    />
                  </td>
                )}
                <td className="text-center" style={{ width: "3%" }}>
                  {" "}
                  {index + 1}
                </td>
                <td className="text-center">{vehicle.vehicleId}</td>
                
                <td className="text-center">{formatDate(vehicle.date)}</td>
                <td>{vehicle.customerName}</td>
                <td className="text-center">{vehicle.phone}</td>
                <td>
                  {vehicle.brand} {vehicle.vehicleModel} <br />{" "}
                  {vehicle.vehicleRegNo}{" "}
                </td>
                <td>
                  <ul className="services-list list-unstyled mb-0">
                    {vehicle.services.length > 0 && (
                      <li>
                        {vehicle.services[0].serviceType}
                        {vehicle.services.length > 1 && (
                          <span>
                            {" "}
                            <a href="#">and more...</a>
                          </span>
                        )}
                      </li>
                    )}
                  </ul>
                </td>
                <td className=" text-center">
                  {vehicle.dueAmount.toLocaleString(undefined, { 
  minimumFractionDigits: 2, 
  maximumFractionDigits: 2 
})}
                </td>
                <td className=" text-center">
                  {vehicle.pendingAmount.toLocaleString(undefined, { 
  minimumFractionDigits: 2, 
  maximumFractionDigits: 2 
})}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="customer-amount d-md-flex justify-content-between align-items-center mt-4">
        <h5>
          <b>Total Amount: AED {calculateTotalAmount().toLocaleString(undefined, { 
  minimumFractionDigits: 2, 
  maximumFractionDigits: 2 
})}</b>
        </h5>
        <h5
          style={{
            color: calculatePendingAmount() !== 0 ? "red" : "transparent",
          }}
        >
          <b>
            Total Pending Amount: AED{" "}
            {calculatePendingAmount().toLocaleString(undefined, { 
  minimumFractionDigits: 2, 
  maximumFractionDigits: 2 
})}
          </b>
        </h5>
      </div>

      {showCheckboxes && (
        <div className="text-end mt-3">
          <button
            className="btn col-xl-2 del-selected"
            onClick={handleDeleteClick}
          >
            Delete Selected
          </button>
        </div>
      )}
    </section>
  );
}

export default Vehicles;
