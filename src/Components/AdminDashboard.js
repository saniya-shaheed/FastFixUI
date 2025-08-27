import { useState, useEffect, useMemo } from "react";
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
import { useNavigate } from "react-router-dom";
import "../css/AdminDashboard.css";
import { formatDate } from "./FormateDate"; // keep this if you already have
import { API_BASE_URL } from "../apiConfig";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

function AdminDashboard() {
  const navigate = useNavigate();

  // --- State ---
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [vehicles, setVehicles] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [partOrders, setPartOrders] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchActive, setIsSearchActive] = useState(false);

  // --- Fetch All Data Once ---
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [vehiclesRes, expensesRes, employeesRes, ordersRes] =
          await Promise.all([
            axios.get(`${API_BASE_URL}/api/vehicles`),
            axios.get(`${API_BASE_URL}/api/expenses`),
            axios.get(`${API_BASE_URL}/api/employees`),
            axios.get(`${API_BASE_URL}/api/part-orders`),
          ]);
        setVehicles(vehiclesRes.data);
        setExpenses(expensesRes.data);
        setEmployees(employeesRes.data);
        setPartOrders(ordersRes.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };
    fetchAllData();
  }, []);

  // --- Filtered Monthly Data ---
  const filteredVehicles = useMemo(
    () =>
      vehicles.filter(
        (v) =>
          new Date(v.date).getMonth() + 1 === month &&
          new Date(v.date).getFullYear() === year
      ),
    [vehicles, month, year]
  );

  const filteredExpenses = useMemo(
    () =>
      expenses.filter(
        (e) =>
          new Date(e.date).getMonth() + 1 === month &&
          new Date(e.date).getFullYear() === year
      ),
    [expenses, month, year]
  );

  const totalRevenue = useMemo(
    () =>
      filteredVehicles.reduce((sum, v) => sum + (v.dueAmount || 0), 0),
    [filteredVehicles]
  );
  const totalExpenses = useMemo(
    () => filteredExpenses.reduce((sum, e) => sum + (e.amount || 0), 0),
    [filteredExpenses]
  );
  const vehicleCount = filteredVehicles.length;

  // --- Monthly Revenue & Target ---
  const { monthlyRevenues, monthlyTargets } = useMemo(() => {
    const revenues = Array(12).fill(0);
    const targets = Array(12).fill(0);
    for (let i = 0; i < 12; i++) {
      const monthVehicles = vehicles.filter(
        (v) =>
          new Date(v.date).getMonth() === i &&
          new Date(v.date).getFullYear() === year
      );
      revenues[i] = monthVehicles.reduce((sum, v) => sum + (v.dueAmount || 0), 0);
      targets[i] = i === 0 ? 0 : revenues[i - 1] * 1.25;
    }
    return { monthlyRevenues: revenues, monthlyTargets: targets };
  }, [vehicles, year]);

  // --- Search Handler ---
  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchInput.trim()) return;

    const input = searchInput.toLowerCase();
    const results = [];

    // Vehicles
    vehicles.forEach((v) => {
      const vehicleMatches =
        v.vehicleId?.toString().includes(input) ||
        v.vehicleRegNo?.toLowerCase().includes(input) ||
        v.customerName?.toLowerCase().includes(input) ||
        v.phone?.includes(input) ||
        v.brand?.toLowerCase().includes(input) ||
        v.vehicleModel?.toLowerCase().includes(input);
      const serviceMatches =
        v.services?.some((s) => s.serviceType?.toLowerCase().includes(input)) ||
        false;
      if (vehicleMatches || serviceMatches) results.push({ ...v, type: "vehicle" });
    });

    // Expenses
    expenses.forEach((e) => {
      if (e.expense?.toLowerCase().includes(input)) results.push({ ...e, type: "expense" });
    });

    // Employees
    employees.forEach((emp) => {
      const empMatches =
        emp.name?.toLowerCase().includes(input) ||
        emp.phone?.toString().includes(input) ||
        emp.work?.designation?.toLowerCase().includes(input) ||
        emp.passport?.passportNo?.toLowerCase().includes(input) ||
        emp.emiratesId?.emiratesidNo?.toLowerCase().includes(input);
      if (empMatches) results.push({ ...emp, type: "employee" });
    });

    // Part Orders
    partOrders.forEach((order) => {
      const orderMatches =
        order.phone?.toString().includes(input) ||
        order.supplier?.toLowerCase().includes(input) ||
        order.targetVehicle?.toLowerCase().includes(input) ||
        order.parts?.some((p) => p.item?.toLowerCase().includes(input));
      if (orderMatches) results.push({ ...order, type: "order" });
    });

    setSearchResults(results);
    setIsSearchActive(true);
  };

  const handleResetSearch = () => {
    setSearchInput("");
    setIsSearchActive(false);
    setSearchResults([]);
  };

  // --- Dropdowns ---
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i);
  const months = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];

  const screenWidth = window.innerWidth;
  const fontSize = screenWidth > 2560 ? 100 : screenWidth > 1920 ? 16 : 12;

  const chartData = {
    labels: months,
    datasets: [
      { label: "Revenue", data: monthlyRevenues, backgroundColor: "blue", borderColor: "blue", borderWidth: 1 },
      { label: "Target", data: monthlyTargets, backgroundColor: "red", borderColor: "red", borderWidth: 1 },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true, position: "top", labels: { font: { size: fontSize } } },
      tooltip: {
        callbacks: { label: (ctx) => `$${ctx.raw.toLocaleString()}` },
        bodyFont: { size: fontSize },
        titleFont: { size: fontSize + 2 },
      },
    },
    layout: { padding: { top: 10, bottom: 10 } },
    scales: {
      x: { grid: { display: false }, ticks: { font: { size: fontSize } } },
      y: { beginAtZero: true, ticks: { stepSize: 1000, callback: (v) => `$${v}`, font: { size: fontSize } }, suggestedMax: 10000 },
    },
  };

  return (
    <section className="p-3 p-md-5">
      {/* Search */}
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
        <div>
          <div className="back-to-dashboard p-4 ps-0 pb-xl-5">
            <button className="btn col-xl-4" onClick={handleResetSearch}>Back to Dashboard</button>
          </div>
          <div className="table-responsive">
            <table className="search-table table table-bordered">
              <thead>
                <tr>
                  <th>S. No</th>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Reg/EmiratesID/Amount</th>
                  <th>Brand/Designation</th>
                  <th>Model</th>
                  <th>Service/Parts</th>
                  <th>Total Amount</th>
                </tr>
              </thead>
              <tbody>
                {searchResults.map((result, index) => (
                  <tr key={index} style={{ cursor: "pointer" }}
                      onClick={() => {
                        if (result.type === "vehicle") navigate(`/vehicles/${result._id}`);
                        else if (result.type === "employee") navigate(`/employees/${result._id}`);
                        else if (result.type === "expense") navigate(`/expenses`);
                        else if (result.type === "order") navigate(`/part-orders/${result._id}`);
                      }}>
                    <td>{index + 1}</td>
                    <td>
                      {result.type === "vehicle" ? result.vehicleId :
                       result.type === "employee" ? result.passport?.passportNo :
                       result.type === "order" ? result.phone : "N/A"}
                    </td>
                    <td>
                      {result.type === "vehicle" ? result.customerName :
                       result.type === "employee" ? result.name :
                       result.type === "expense" ? result.expense :
                       result.type === "order" ? result.supplier : "N/A"}
                    </td>
                    <td>
                      {result.type === "vehicle" ? result.vehicleRegNo :
                       result.type === "employee" ? result.emiratesId?.emiratesidNo :
                       result.type === "expense" ? result.amount :
                       result.type === "order" ? formatDate(result.date) : "N/A"}
                    </td>
                    <td>
                      {result.type === "vehicle" ? result.brand :
                       result.type === "employee" ? result.work?.designation :
                       result.type === "expense" ? formatDate(result.date) : "N/A"}
                    </td>
                    <td>{result.vehicleModel || "N/A"}</td>
                    <td>
                      {result.type === "vehicle" && result.services?.length
                        ? result.services.map((s) => s.serviceType).join(", ")
                        : result.type === "order" && result.parts?.length
                        ? result.parts.map((p) => p.item).join(", ")
                        : "N/A"}
                    </td>
                    <td>{result.totalAmount || "N/A"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="dashboard">
          <h1>Dashboard</h1>
          <hr />
          <div className="dropdown month-year-dashboard d-flex justify-content-between align-items-center">
            <div className="today-date">
              <h4>{new Date().toLocaleDateString("en-US", { day: "2-digit", month: "long", year: "numeric" })}</h4>
            </div>
            <div className="month-year-dropdown d-flex">
              <label className="pe-2"><b>Month:</b></label>
              <select className="btn dropdown-toggle" value={month} onChange={(e) => setMonth(Number(e.target.value))}>
                {months.map((name, idx) => <option key={idx} value={idx + 1}>{name}</option>)}
              </select>
              <label className="ps-3 pe-2"><b>Year:</b></label>
              <select className="btn dropdown-toggle" value={year} onChange={(e) => setYear(Number(e.target.value))}>
                {years.map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
          </div>

          {/* Graph and summary */}
          <div className="container-fluid py-4">
            <div className="row">
              <div className="col-12 col-md-6 mb-3 border-box-graph p-3 rounded-3">
                <div className="graph-container rounded-3">
                  <Bar data={chartData} options={chartOptions} className="graph-canvas p-2" />
                </div>
              </div>
              <div className="col-12 col-md-6 row revenue-expense-target-nofveh">
                <div className="col-6 mb-3 revenue-dashboard border-box-colour rounded-3 p-3 bg-light text-center">
                  <h5>Revenue</h5>
                  <h3 style={{ color: totalRevenue > monthlyTargets[month - 1] ? "green" : "red" }}>
                    AED {totalRevenue.toLocaleString()}
                  </h3>
                </div>
                <div className="col-6 target-dashboard border-box-colour rounded-3 p-3 bg-light text-center">
                  <h5>Target Revenue</h5>
                  <h3>AED {monthlyTargets[month - 1].toFixed(2)}</h3>
                </div>
                <div className="col-6 mb-3 expense-dashboard border-box-colour rounded-3 p-3 bg-light text-center">
                  <h5>Expense</h5>
                  <h3>AED {totalExpenses.toLocaleString()}</h3>
                </div>
                <div className="col-6 noofvehicles-dashboard border-box-colour rounded-3 p-3 bg-light text-center">
                  <h5>No. of Vehicles</h5>
                  <h3>{vehicleCount}</h3>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="row mt-4 dashboard-buttons">
              <div className="col-4 text-center">
                <button className="btn w-100" onClick={() => navigate("/add-vehicle")}>Add Customer</button>
              </div>
              <div className="col-4 text-center">
                <button className="btn w-100" onClick={() => navigate("/expenses/add-expense")}>Add Expense</button>
              </div>
              <div className="col-4 text-center">
                <button className="btn w-100" onClick={() => navigate("/add-employee")}>Add Employee</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default AdminDashboard;
