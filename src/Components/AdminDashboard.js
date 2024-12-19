import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import "../css/AdminDashboard.css";
import { useNavigate } from "react-router-dom";
import { formatDate } from "./FormateDate";
import { API_BASE_URL } from "../apiConfig";

// Register required Chart.js components
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

function AdminDashboard() {
  const [month, setMonth] = useState(new Date().getMonth() + 1); // Current month
  const [year, setYear] = useState(new Date().getFullYear()); // Current year
  const [expenses, setExpenses] = useState(0);
  const [revenue, setRevenue] = useState(0);
  const [vehicleCount, setVehicleCount] = useState(0);
  const [monthlyRevenues, setMonthlyRevenues] = useState(Array(12).fill(0));
  const [monthlyTargets, setMonthlyTargets] = useState(Array(12).fill(0));
  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const navigate = useNavigate();

  // Fetch data for the selected month and year
  const fetchRevenueAndExpenses = async () => {
    try {
      const [expensesResponse, vehiclesResponse, employeeResponse] =
        await Promise.all([
          axios.get(`${API_BASE_URL}/api/expenses`),
          axios.get(`${API_BASE_URL}/api/vehicles`),
          axios.get(`${API_BASE_URL}/api/employees`),
        ]);

      const expenses = expensesResponse.data;
      const revenues = vehiclesResponse.data;
      const employees = employeeResponse.data;

      // Filter and calculate for the selected month and year
      const filteredExpenses = expenses.filter((expense) => {
        const date = new Date(expense.date);
        return date.getMonth() + 1 === month && date.getFullYear() === year;
      });

      const filteredRevenues = revenues.filter((vehicle) => {
        const date = new Date(vehicle.date);
        return date.getMonth() + 1 === month && date.getFullYear() === year;
      });

      const totalExpenses = filteredExpenses.reduce(
        (total, expense) => total + (expense.amount || 0),
        0
      );

      const totalRevenue = filteredRevenues.reduce(
        (total, vehicle) => total + (vehicle.totalAmount || 0),
        0
      );

      setExpenses(totalExpenses);
      setRevenue(totalRevenue);
      setVehicleCount(filteredRevenues.length);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Fetch monthly revenues and targets
  const fetchMonthlyData = async () => {
    try {
      const [expensesResponse, vehiclesResponse] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/expenses`),
        axios.get(`${API_BASE_URL}/api/vehicles`),
      ]);

      const expenses = expensesResponse.data;
      const revenues = vehiclesResponse.data;

      const revenuesPerMonth = Array(12).fill(0);
      const targetsPerMonth = Array(12).fill(0);

      for (let i = 0; i < 12; i++) {
        const monthExpenses = expenses.filter((expense) => {
          const date = new Date(expense.date);
          return date.getMonth() === i && date.getFullYear() === year;
        });

        const monthRevenues = revenues.filter((vehicle) => {
          const date = new Date(vehicle.date);
          return date.getMonth() === i && date.getFullYear() === year;
        });

        const totalExpenses = monthExpenses.reduce(
          (total, expense) => total + (expense.amount || 0),
          0
        );

        const totalRevenues = monthRevenues.reduce(
          (total, vehicle) => total + (vehicle.totalAmount || 0),
          0
        );

        revenuesPerMonth[i] = totalRevenues;

        // Calculate target based on last month's revenue
        if (i === 0) {
          targetsPerMonth[i] = 0; // No target for the first month
        } else {
          targetsPerMonth[i] =
            revenuesPerMonth[i - 1] + revenuesPerMonth[i - 1] * 0.25;
        }
      }

      setMonthlyRevenues(revenuesPerMonth);
      setMonthlyTargets(targetsPerMonth);
    } catch (error) {
      console.error("Error fetching monthly data:", error);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();

    try {
      const [
        vehiclesResponse,
        expensesResponse,
        employeesResponse,
        orderResponse,
      ] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/vehicles`),
        axios.get(`${API_BASE_URL}/api/expenses`),
        axios.get(`${API_BASE_URL}/api/employees`),
        axios.get(`${API_BASE_URL}/api/part-orders`),
      ]);

      // Search vehicles
      const vehicles = vehiclesResponse.data
        .filter((vehicle) => {
          // Check if any vehicle details match the search input
          const vehicleMatches =
            vehicle.vehicleId?.toString().includes(searchInput) ||
            vehicle.vehicleRegNo
              ?.toLowerCase()
              .includes(searchInput.toLowerCase()) ||
            vehicle.customerName
              ?.toLowerCase()
              .includes(searchInput.toLowerCase()) ||
            vehicle.phone?.includes(searchInput) ||
            vehicle.brand?.toLowerCase().includes(searchInput.toLowerCase()) ||
            vehicle.vehicleModel
              ?.toLowerCase()
              .includes(searchInput.toLowerCase());

          // Check if any service matches the search input
          const serviceMatches =
            vehicle.services?.some((service) =>
              service.serviceType
                ?.toLowerCase()
                .includes(searchInput.toLowerCase())
            ) || false; // Handle undefined services gracefully

          // Return true if either vehicle details or services match
          return vehicleMatches || serviceMatches;
        })
        .map((vehicle) => ({
          ...vehicle,
          type: "vehicle", // Add type for differentiation
        }));

      // Search expenses
      const expenses = expensesResponse.data
        .filter((expense) =>
          expense.expense?.toLowerCase().includes(searchInput.toLowerCase())
        )
        .map((expense) => ({
          ...expense,
          type: "expense", // Add type for differentiation
        }));

      // Search employees
      const employees = employeesResponse.data
        .filter(
          (employee) =>
            employee.name?.toLowerCase().includes(searchInput.toLowerCase()) ||
            employee.phone?.toString().includes(searchInput) ||
            employee.nationality
              ?.toLowerCase()
              .includes(searchInput.toLowerCase()) ||
            employee.work.department
              ?.toLowerCase()
              .includes(searchInput.toLowerCase()) ||
            employee.work.designation
              ?.toLowerCase()
              .includes(searchInput.toLowerCase()) ||
            employee.passport.passportNo
              ?.toLowerCase()
              .includes(searchInput.toLowerCase()) ||
            employee.emiratesId.emiratesidNo
              ?.toLowerCase()
              .includes(searchInput.toLowerCase())
        )
        .map((employee) => ({
          ...employee,
          type: "employee", // Add type for differentiation
        }));

      const partOrders = orderResponse.data
        .filter((order) => {
          const orderMatches =
            order.phone?.toString().includes(searchInput) ||
            order.supplier?.toLowerCase().includes(searchInput.toLowerCase()) ||
            order.targetVehicle
              ?.toLowerCase()
              .includes(searchInput.toLowerCase());

          const partItemMatches =
            order.parts?.some((part) =>
              part.item?.toLowerCase().includes(searchInput.toLowerCase())
            ) || false; // Handle undefined services gracefully

          // Return true if either vehicle details or services match
          return orderMatches || partItemMatches;
        })
        .map((order) => ({
          ...order,
          type: "order", // Add type for differentiation
        }));

      // Combine all results
      const searchResults = [
        ...vehicles,
        ...expenses,
        ...employees,
        ...partOrders,
      ];

      setSearchResults([...vehicles, ...expenses, ...employees, ...partOrders]);
      setIsSearchActive(true);
    } catch (error) {
      console.error("Error searching:", error);
    }
  };

  const handleResetSearch = () => {
    setSearchInput("");
    setIsSearchActive(false);
    setSearchResults([]);
  };

  useEffect(() => {
    fetchRevenueAndExpenses();
    fetchMonthlyData();
  }, [month, year]);

  // Dropdown options for year and month
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

  const screenWidth = window.innerWidth;

  // Dynamically calculate font size based on screen width
  const fontSize = screenWidth > 2560 ? 100 : screenWidth > 1920 ? 16 : 12;

  const data = {
    labels: months,
    datasets: [
      {
        label: "Revenue",
        data: monthlyRevenues,
        backgroundColor: "blue",
        borderColor: "blue",
        borderWidth: 1,
      },
      {
        label: "Target",
        data: monthlyTargets,
        backgroundColor: "red",
        borderColor: "red",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top",
        labels: {
          font: {
            size: fontSize, // Responsive font size for legend
          },
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => `$${context.raw.toLocaleString()}`,
        },
        bodyFont: {
          size: fontSize, // Responsive font size for tooltips
        },
        titleFont: {
          size: fontSize + 2, // Slightly larger for tooltip titles
        },
      },
    },
    layout: {
      padding: {
        top: 10,
        bottom: 10,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: fontSize, // Responsive font size for x-axis ticks
          },
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1000,
          callback: (value) => `$${value}`,
          font: {
            size: fontSize, // Responsive font size for y-axis ticks
          },
        },
        suggestedMax: 10000,
      },
    },
  };

  return (
    <section className="p-3 p-md-5 ">
      <div className="search-input col-12 col-md-6 pb-3">
        <form onSubmit={handleSearch}>
          <input
            className="form-control w-100"
            placeholder="Type here and press Enter to search"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </form>
      </div>

      {isSearchActive ? (
        <div className="">
          <div className="back-to-dashboard p-4 ps-0 pb-xl-5">
            <button className="btn col-xl-4" onClick={handleResetSearch}>
              Back to Dashboard
            </button>
          </div>
          <div className="table-responsive">
            <table className="search-table table table-bordered ">
              <thead>
                <tr>
                  <th> S. No </th>
                  <th>*****</th>
                  <th>*****</th>
                  <th>*****</th>
                  <th>*****</th>
                  <th>*****</th>
                  <th>*****</th>
                  <th>*****</th>
                </tr>
              </thead>
              <tbody>
                {searchResults.map((result, index) => (
                  <tr
                    key={index}
                    onClick={() => {
                      // Navigate to the detail page based on the type and ID
                      if (result.type === "vehicle") {
                        navigate(`/vehicles/${result._id}`);
                      } else if (result.type === "employee") {
                        navigate(`/employees/${result._id}`);
                      } else if (result.type === "expense") {
                        navigate(`/expenses`);
                      } else if (result.type === "order") {
                        navigate(`/part-orders/${result._id}`);
                      }
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    <td> {index + 1}</td>
                    {/* ID Field */}
                    <td>
                      {result.type === "vehicle"
                        ? result.vehicleId
                        : result.type === "employee"
                        ? result.passport?.passportNo
                        : result.type === "order"
                        ? result.phone
                        : "N/A"}
                    </td>

                    {/* Name Field */}
                    <td>
                      {result.type === "vehicle"
                        ? result.customerName
                        : result.type === "employee"
                        ? result.name
                        : result.type === "expense"
                        ? result.expense
                        : result.type === "order"
                        ? result.supplier
                        : "N/A"}
                    </td>

                    {/* Registration/Emirates ID/Amount */}
                    <td>
                      {result.type === "vehicle"
                        ? result.vehicleRegNo
                        : result.type === "employee"
                        ? result.emiratesId?.emiratesidNo
                        : result.type === "expense"
                        ? result.amount
                        : result.type === "order"
                        ? formatDate(result.date)
                        : "N/A"}
                    </td>

                    {/* Brand/Designation */}
                    <td>
                      {result.type === "vehicle"
                        ? result.brand
                        : result.type === "employee"
                        ? result.work?.designation
                        : result.type === "expense"
                        ? formatDate(result.date)
                        : "N/A"}
                    </td>

                    {/* Model */}
                    <td>{result.vehicleModel || "N/A"}</td>

                    {/* Service Type */}
                    <td>
                      {result.type === "vehicle" && result.services?.length
                        ? result.services
                            .map((service) => service.serviceType)
                            .join(", ")
                        : result.type === "order" && result.parts?.length
                        ? result.parts.map((part) => part.item).join(", ")
                        : "N/A"}
                    </td>

                    {/* Total Amount */}
                    <td>{result.totalAmount || "N/A"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="dashboard">
          <h1 className="">Dashboard</h1>
          <hr />
          <div className=" dropdown  month-year-dashboard">
            <div className="today-date col-6">
              <h4>
                {" "}
                {new Date().toLocaleDateString("en-US", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}{" "}
              </h4>
            </div>
            {/* Dropdowns for Month and Year */}
            <div className="month-year-dropdown d-flex flex-column flex-sm-row text-end">
              <label className="pe-2">
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

              <label className="ps-3 pe-2 ">
                <b>Year: </b>{" "}
              </label>
              <select
                className="btn dropdown-toggle "
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

          <div class="container-fluid py-4">
            <div class="row">
              <div class="col-12 col-md-6 mb-3">
                <div class="border-box-graph p-3 rounded-3">
                  <div className="graph-container rounded-3">
                    <span>
                      {/* Chart */}
                      <div style={{ margin: "0 auto" }}>
                        <Bar
                          data={data}
                          options={options}
                          className="graph-canvas p-2"
                        />
                      </div>
                    </span>
                  </div>
                </div>
              </div>

              <div class="col-12 col-md-6">
                <div class="row revenue-expense-target-nofveh">
                  <div class="col-6 mb-3 revenue-dashboard">
                    <div class="border-box-colour rounded-3 p-3 bg-light text-center">
                      <h5>Revenue</h5>
                      <h3
                        style={{
                          color:
                            revenue > monthlyTargets[month - 1]
                              ? "green"
                              : "red",
                        }}
                      >
                        AED {revenue.toLocaleString()}
                      </h3>
                    </div>
                  </div>
                  <div class="col-6 target-dashboard">
                    <div class="border-box-colour rounded-3 p-3 bg-light text-center">
                      <h5> Target Revenue </h5>
                      <h3>AED {monthlyTargets[month - 1].toFixed(2)}</h3>
                    </div>
                  </div>
                  <div class="col-6 mb-3 expense-dashboard">
                    <div class="border-box-colour rounded-3 p-3 bg-light text-center">
                      <h5>Expense</h5>
                      <h3>AED {expenses.toLocaleString()}</h3>
                    </div>
                  </div>
                  <div class="col-6 noofvehicles-dashboard">
                    <div class="border-box-colour rounded-3 p-3 bg-light text-center">
                      <h5>No. of Vehicles</h5>
                      <h3>{vehicleCount}</h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="row mt-4 dashboard-buttons">
              <div class="col-4 text-center">
                <button
                  class="btn btn-primary w-100"
                  onClick={() => navigate("/add-vehicle")}
                >
                  Add Customer
                </button>
              </div>
              <div class="col-4 text-center">
                <button
                  class="btn btn-primary w-100"
                  onClick={() => navigate("/expenses/add-expense")}
                >
                  Add Expense
                </button>
              </div>
              <div class="col-4 text-center">
                <button
                  class="btn btn-primary w-100"
                  onClick={() => navigate("/add-employee")}
                >
                  Add Employee
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default AdminDashboard;
