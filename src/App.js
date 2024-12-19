import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Vehicles from "./Components/Vehicles";
import AddVehicle from "./Components/AddVehicle";
import Expenses from "./Components/Expenses";
import AddExpense from "./Components/AddExpense";
import Layout from "./Components/Layout"; // Import your Layout component
import VehicleDetails from "./Components/VehicleDetails";
import AdminHome from "./Pages/AdminHome";
import AdminDashboard from "./Components/AdminDashboard";
import Employees from "./Components/Employees";
import AddEmployee from "./Components/AddEmployee";
import EmployeeDetails from "./Components/EmployeeDetails";
import { useEffect, useState } from "react";
import "./App.css";
import PartOrders from "./Components/PartOrders";
import AddPartsOrder from "./Components/AddPartsOrder";
import PartDetails from "./Components/PartDetails";
import Dealers from "./Components/Dealers";
import Documents from "./Components/Documents";
import Account from "./Components/Account";
import Notifications from "./Components/Notifications";
import SignUp from "./Components/SignUp";

function App() {
  const [username, setUsername] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check authToken and initialize login state
    const token = localStorage.getItem("authToken");
    const storedUsername = localStorage.getItem("username");

    if (token && storedUsername) {
      setIsLoggedIn(true);
      setUsername(storedUsername);
    }
  }, []);

  const handleLogout = () => {
    // Clear authentication tokens and related session data
    localStorage.removeItem("authToken");
    localStorage.removeItem("username");
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/adminFF/signUp/971581259330-971528473582"
          element={<SignUp />}
        />
        {/* Login Route */}
        <Route
          path="/adminFF"
          element={
            <AdminHome
              setIsLoggedIn={setIsLoggedIn}
              setUsername={setUsername}
            />
          }
        />

        {/* Protected Routes */}
        {isLoggedIn ? (
          <>
            <Route
              path="/notifications"
              element={
                <Layout
                  username={username}
                  setIsLoggedIn={setIsLoggedIn}
                  setUsername={setUsername}
                >
                  <Notifications />
                </Layout>
              }
            />
            <Route
              path="/dashboard"
              element={
                <Layout
                  username={username}
                  setIsLoggedIn={setIsLoggedIn}
                  setUsername={setUsername}
                >
                  <AdminDashboard />
                </Layout>
              }
            />
            <Route
              path="/expenses"
              element={
                <Layout
                  username={username}
                  setIsLoggedIn={setIsLoggedIn}
                  setUsername={setUsername}
                >
                  <Expenses />
                </Layout>
              }
            />
            <Route
              path="/vehicles"
              element={
                <Layout
                  username={username}
                  setIsLoggedIn={setIsLoggedIn}
                  setUsername={setUsername}
                >
                  <Vehicles />
                </Layout>
              }
            />
            <Route
              path="/add-vehicle"
              element={
                <Layout
                  username={username}
                  setIsLoggedIn={setIsLoggedIn}
                  setUsername={setUsername}
                >
                  <AddVehicle />
                </Layout>
              }
            />
            <Route
              path="/vehicles/:id"
              element={
                <Layout
                  username={username}
                  setIsLoggedIn={setIsLoggedIn}
                  setUsername={setUsername}
                >
                  <VehicleDetails />
                </Layout>
              }
            />
            <Route
              path="/expenses"
              element={
                <Layout
                  username={username}
                  setIsLoggedIn={setIsLoggedIn}
                  setUsername={setUsername}
                >
                  <Expenses />
                </Layout>
              }
            />
            <Route
              path="/expenses/add-expense"
              element={
                <Layout
                  username={username}
                  setIsLoggedIn={setIsLoggedIn}
                  setUsername={setUsername}
                >
                  <AddExpense />
                </Layout>
              }
            />
            <Route
              path="/employees"
              element={
                <Layout
                  username={username}
                  setIsLoggedIn={setIsLoggedIn}
                  setUsername={setUsername}
                >
                  <Employees />
                </Layout>
              }
            />
            <Route
              path="/add-employee"
              element={
                <Layout
                  username={username}
                  setIsLoggedIn={setIsLoggedIn}
                  setUsername={setUsername}
                >
                  <AddEmployee />
                </Layout>
              }
            />
            <Route
              path="/employees/:id"
              element={
                <Layout
                  username={username}
                  setIsLoggedIn={setIsLoggedIn}
                  setUsername={setUsername}
                >
                  <EmployeeDetails />
                </Layout>
              }
            />
            <Route
              path="/part-orders"
              element={
                <Layout
                  username={username}
                  setIsLoggedIn={setIsLoggedIn}
                  setUsername={setUsername}
                >
                  <PartOrders />
                </Layout>
              }
            />
            <Route
              path="/add-spare-parts"
              element={
                <Layout
                  username={username}
                  setIsLoggedIn={setIsLoggedIn}
                  setUsername={setUsername}
                >
                  <AddPartsOrder />
                </Layout>
              }
            />

            <Route
              path="/part-orders/:id"
              element={
                <Layout
                  username={username}
                  setIsLoggedIn={setIsLoggedIn}
                  setUsername={setUsername}
                >
                  <PartDetails />
                </Layout>
              }
            />
            <Route
              path="/dealers"
              element={
                <Layout
                  username={username}
                  setIsLoggedIn={setIsLoggedIn}
                  setUsername={setUsername}
                >
                  <Dealers />
                </Layout>
              }
            />
            <Route
              path="/documents"
              element={
                <Layout
                  username={username}
                  setIsLoggedIn={setIsLoggedIn}
                  setUsername={setUsername}
                >
                  <Documents />
                </Layout>
              }
            />
            <Route
              path="/account"
              element={
                <Layout
                  username={username}
                  setIsLoggedIn={setIsLoggedIn}
                  setUsername={setUsername}
                >
                  <Account />
                </Layout>
              }
            />
          </>
        ) : (
          <Route path="*" element={<Navigate to="/adminFF" />} />
        )}
      </Routes>
    </Router>
  );
}

export default App;
