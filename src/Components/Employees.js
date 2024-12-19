import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../css/Employees.css";
import { API_BASE_URL } from "../apiConfig";

const Employees = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState([]);
  const [showCheckbox, setShowCheckbox] = useState(false);

  useEffect(() => {
    // Fetch the employees list
    const fetchEmployees = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/employees`);
        console.log("API Response:", response.data); // Log the response
        if (Array.isArray(response.data)) {
          setEmployees(response.data);
        } else {
          console.error("Data is not an array:", response.data);
        }
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };
    fetchEmployees();
  }, []);

  const toggleCheckboxView = () => setShowCheckbox((prev) => !prev);

  const toggleEmployeeSelection = (employeeId) => {
    setSelectedEmployee((prev) =>
      prev.includes(employeeId)
        ? prev.filter((id) => id !== employeeId)
        : [...prev, employeeId]
    );
  };

  const deleteSelectedEmployee = async () => {
    if (selectedEmployee.length === 0) {
      alert("Please select employee to delete");
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete the selected employee?"
    );
    if (!confirmDelete) return;

    try {
      await Promise.all(
        selectedEmployee.map((employeeId) =>
          axios.delete(`${API_BASE_URL}/api/employees/${employeeId}`)
        )
      );
      setEmployees((prev) =>
        prev.filter((employee) => !selectedEmployee.includes(employee._id))
      );
      setSelectedEmployee([]);
      setShowCheckbox(false);
    } catch (error) {
      console.error("Error deleting employee", error);
    }
  };

  const handleRowClick = (employeeId) => {
    if (!showCheckbox) {
      navigate(`/employees/${employeeId}`);
    }
  };

  return (
    <section className="employees p-3 p-md-5">
      <h1>Employees </h1>
      <hr />

      <div className="d-flex  mb-3 mb-md-0 employee-add-delete-button pt-sm-3">
        <button
          className="btn col-xl-2 me-sm-3 mb-2 mb-sm-0"
          onClick={() => navigate("/add-employee")}
        >
          Add Employee
        </button>
        <button className="btn  col-xl-2" onClick={toggleCheckboxView}>
          {showCheckbox ? "Cancel" : "Delete Employee"}
        </button>
      </div>

      <div style={{ overflowX: "auto" }} className="employee-table pt-sm-4 ">
        <table className="table table-bordered bg-light">
          <thead className="table text-center">
            <tr>
              {showCheckbox && <th>Select</th>}
              <th> S.No </th>
              <th>Name</th>
              <th>Phone</th>
              <th> Department </th>
              <th>Designation</th>
              <th style={{ width: "15%" }}>
                {" "}
                Salary <br />
                <span className="text-secondary fw-normal">
                  {" "}
                  (AED per month){" "}
                </span>{" "}
              </th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee, index) => (
              <tr
                key={employee._id}
                onClick={() => handleRowClick(employee._id)}
              >
                {showCheckbox && (
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedEmployee.includes(employee._id)}
                      onChange={() => toggleEmployeeSelection(employee._id)}
                      className="del-checkbox"
                    />
                  </td>
                )}
                <td className="text-center"> {index + 1}</td>
                <td>{employee.name}</td>
                <td className="text-center">{employee.phone}</td>
                <td>{employee.work.department}</td>
                <td>{employee.work.designation}</td>
                <td className="text-center">{employee.work.salary}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showCheckbox && (
        <div className="pt-3 ">
          <button
            className="btn delete-employee"
            onClick={deleteSelectedEmployee}
          >
            Delete Selected Employee
          </button>
        </div>
      )}
    </section>
  );
};

export default Employees;
