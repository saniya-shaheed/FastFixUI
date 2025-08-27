import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../css/AddEmployee.css";
import { API_BASE_URL } from "../apiConfig";

const AddEmployee = () => {
  const navigate = useNavigate();
  const [employeeData, setEmployeeData] = useState({
    name: "",
    dateOfBirth: "",
    phone: "",
    email: "",
    address: "",
    nationality: "",
    status: "",
    visaExpiry: "",
    work: {
      department: "",
      designation: "",
      salary: "",
      startDate: "",
      contractEndDate: "",
    },
    passport: {
      passportNo: "",
      expiryPassport: "",
    },
    emiratesId: {
      emiratesidNo: "",
      expiryID: "",
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    const keys = name.split(".");

    if (keys.length === 1) {
      setEmployeeData({ ...employeeData, [name]: value });
    } else {
      setEmployeeData((prevState) => ({
        ...prevState,
        [keys[0]]: {
          ...prevState[keys[0]],
          [keys[1]]: value,
        },
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/api/employees`, employeeData);
      alert("Employee added successfully!");
      setEmployeeData({
        name: "",
        dateOfBirth: "",
        phone: "",
        email: "",
        address: "",
        nationality: "",
        status: "",
        visaExpiry: "",
        work: {
          department: "",
          designation: "",
          salary: "",
          startDate: "",
          contractEndDate: "",
        },
        passport: {
          passportNo: "",
          expiryPassport: "",
        },
        emiratesId: {
          emiratesidNo: "",
          expiryID: "",
        },
      });
      navigate("/employees");
    } catch (error) {
      console.error("Error adding employee:", error);
      alert("Failed to add employee. Please try again.");
    }
  };

  return (
    <section className="add-employee p-4 p-md-5">
      <h1>New Employee</h1>
      <hr />
      <form onSubmit={handleSubmit}>
        <div className="d-sm-flex pt-2">
          <div className="form-group col-sm-5 pt-2">
            <label>Name</label>
            <input
              type="text"
              className="form-control"
              name="name"
              value={employeeData.name}
              onChange={handleChange}
            />
          </div>
          <div className="form-group col-sm-5 pt-2">
            <label>Phone</label>
            <input
              type="text"
              className="form-control"
              name="phone"
              value={employeeData.phone}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="d-sm-flex pt-sm-2 pt-xl-3">
          <div className="form-group col-sm-5 pt-2">
            <label>Date of Birth</label>
            <input
              type="date"
              className="form-control"
              name="dateOfBirth"
              value={employeeData.dateOfBirth}
              onChange={handleChange}
            />
          </div>
          <div className="form-group col-sm-5 pt-2">
            <label>Email</label>
            <input
              type="email"
              className="form-control"
              name="email"
              value={employeeData.email}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="d-sm-flex pt-m-2 pt-xl-3">
          <div className="form-group col-12 pt-2">
            <label>Address</label>
            <textarea
              type="text"
              className="form-control"
              name="address"
              value={employeeData.address}
              onChange={handleChange}
              rows="4"
            />
          </div>
        </div>
        <div className="d-sm-flex pt-sm-2 pt-xl-3 ">
          <div className="form-group col-sm-5 pt-2">
            <label>Nationality</label>
            <input
              type="text"
              className="form-control"
              name="nationality"
              value={employeeData.nationality}
              onChange={handleChange}
            />
          </div>
          <div className="form-group col-sm-5 pt-2">
            <label>Status</label>
            <input
              type="text"
              className="form-control"
              name="status"
              value={employeeData.status}
              onChange={handleChange}
            />
          </div>
        </div>

        <hr />
        <div>
          <div className="d-sm-flex pt-sm-2 pt-xl-3">
            <div className="form-group col-sm-5 pt-2 pe-2">
              <label>Department</label>
              <input
                type="text"
                className="form-control"
                name="work.department"
                value={employeeData.work.department}
                onChange={handleChange}
              />
            </div>
            <div className="form-group col-sm-5 pt-2 pe-2">
              <label>Designation</label>
              <input
                type="text"
                className="form-control"
                name="work.designation"
                value={employeeData.work.designation}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="d-sm-flex pt-sm-2 pt-xl-3">
            <div className="form-group col-sm-4 pt-2 pe-2">
              <label>
                Salary{" "}
                <span className="text-secondary fw-normal">
                  {" "}
                  (AED per month){" "}
                </span>
              </label>
              <input
                type="number"
                className="form-control"
                name="work.salary"
                value={employeeData.work.salary}
                onChange={handleChange}
              />
            </div>
            <div className="form-group col-sm-4 pt-2">
              <label>Start Date</label>
              <input
                type="date"
                className="form-control"
                name="work.startDate"
                value={employeeData.work.startDate}
                onChange={handleChange}
              />
            </div>
            <div className="form-group col-sm-4 pt-2">
              <label>Contract End Date</label>
              <input
                type="date"
                className="form-control"
                name="work.contractEndDate"
                value={employeeData.work.contractEndDate}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <hr />
        <div>
          <div className="d-sm-flex pt-sm-2 pt-xl-3">
            <div className="form-group col-sm-5 pe-2 pt-2">
              <label>Passport No</label>
              <input
                type="text"
                className="form-control"
                name="passport.passportNo"
                value={employeeData.passport.passportNo}
                onChange={handleChange}
              />
            </div>
            <div className="form-group col-sm-5 pe-2 pt-2">
              <label>Passport Expiry</label>
              <input
                type="date"
                className="form-control"
                name="passport.expiryPassport"
                value={employeeData.passport.expiryPassport}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <div className="d-sm-flex pt-sm-2 pt-xl-3">
          <div className="form-group col-sm-4 pe-2 pt-2">
            <label>Visa Expiry</label>
            <input
              type="date"
              className="form-control"
              name="visaExpiry"
              value={employeeData.visaExpiry}
              onChange={handleChange}
            />
          </div>
          <div className="form-group col-sm-4 pe-2  pt-2">
            <label>Emirates ID No</label>
            <input
              type="text"
              className="form-control"
              name="emiratesId.emiratesidNo"
              value={employeeData.emiratesId.emiratesidNo}
              onChange={handleChange}
            />
          </div>
          <div className="form-group col-sm-4 pe-2  pt-2">
            <label>Emirates ID Expiry</label>
            <input
              type="date"
              className="form-control"
              name="emiratesId.expiryID"
              value={employeeData.emiratesId.expiryID}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="pt-3 add-employee-button pt-3 pt-xl-5">
          <button type="submit" className="btn  col-xl-2 mt-3">
            Add Employee
          </button>
        </div>
      </form>
    </section>
  );
};

export default AddEmployee;
