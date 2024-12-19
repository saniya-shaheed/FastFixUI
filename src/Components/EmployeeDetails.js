import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { formatDate } from "./FormateDate";
import { API_BASE_URL } from "../apiConfig";

const EmployeeDetails = () => {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    dateOfBirth: "",
    phone: "",
    email: "",
    address: "",
    nationality: "",
    status: "",
    visaExpiry: "",
    work: {}, // Ensure nested objects are initialized
    passport: {},
    emiratesId: {},
  });

  // Fetch employee details
  useEffect(() => {
    const fetchEmployeeDetails = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/employees/${id}`
        );
        const data = response.data;

        // Ensure nested fields are initialized
        setEmployee({
          ...data,
          work: data.work || {},
          passport: data.passport || {},
          emiratesId: data.emiratesId || {},
        });

        setFormData({
          ...data,
          work: data.work || {},
          passport: data.passport || {},
          emiratesId: data.emiratesId || {},
        });
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching employee details:", error);
      }
    };

    fetchEmployeeDetails();
  }, [id]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle nested changes (e.g., work, passport, emiratesId)
  const handleNestedInputChange = (e, field) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [field]: { ...prev[field], [name]: value },
    }));
  };

  // Handle update submission
  const handleUpdate = async () => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/api/employees/${id}`,
        formData
      );

      // Update employee state with full response data
      setEmployee({
        ...response.data,
        work: response.data.work || {},
        passport: response.data.passport || {},
        emiratesId: response.data.emiratesId || {},
      });
      console.log(response.data);

      setIsEditing(false); // Exit edit mode
    } catch (error) {
      console.error("Error updating employee details:", error);
    }
  };

  if (!employee) {
    return <p>Employee Not Found</p>;
  }

  return (
    <section className="employee-details p-4 pt-sm-5 p-md-5">
      {isEditing ? (
        <div className="d-flex align-items-center justify-content-between">
          <h1 className=" col-6">{formData.name}</h1>
        </div>
      ) : (
        <div className="d-flex align-items-center justify-content-between">
          <h1 className=" col-6">{formData.name}</h1>
          <div className="col-6 d-flex justify-content-end">
            <button
              className="btn edit-btn col-4 col-md-4  "
              onClick={() => setIsEditing(true)}
            >
              Edit
            </button>
          </div>
        </div>
      )}

      <hr />
      {isEditing ? (
        <form>
          <div className="d-md-flex pt-xl-3">
            <div className="col-md-4">
              <label className="w-100 pe-2">
                Name:
                <input
                  type="text"
                  name="name"
                  value={formData.name || ""}
                  onChange={handleInputChange}
                  className="form-control"
                />
              </label>
            </div>
            <div className="col-md-4 pt-2 pt-md-0">
              <label className="w-100 pe-2">
                Phone:
                <input
                  type="text"
                  name="phone"
                  value={formData.phone || ""}
                  onChange={handleInputChange}
                  className="form-control"
                />
              </label>
            </div>
            <div className="col-md-4 pt-2 pt-md-0">
              <label className="w-100 pe-2">
                Date of Birth:
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth?.slice(0, 10) || ""}
                  onChange={handleInputChange}
                  className="form-control"
                />
              </label>
            </div>
          </div>

          <div className="d-md-flex pt-md-2">
            <div className="col-md-6 pt-2 pt-md-0">
              <label className="w-100 pe-2">
                Email:
                <input
                  type="email"
                  name="email"
                  value={formData.email || ""}
                  onChange={handleInputChange}
                  className="form-control"
                />
              </label>
            </div>
            <div className="col-md-6 pt-2 pt-md-0">
              <label className="w-100 pe-2">
                Address:
                <input
                  type="text"
                  name="address"
                  value={formData.address || ""}
                  onChange={handleInputChange}
                  className="form-control"
                />
              </label>
            </div>
          </div>

          <div className="d-md-flex pt-md-2">
            <div className="col-md-6 pt-2">
              <label className="w-100 pe-2">
                Nationality:
                <input
                  type="text"
                  name="nationality"
                  value={formData.nationality || ""}
                  onChange={handleInputChange}
                  className="form-control"
                />
              </label>
            </div>
            <div className="col-md-6 pt-2">
              <label className="w-100 pe-2">
                Status:
                <input
                  type="text"
                  name="status"
                  value={formData.status || ""}
                  onChange={handleInputChange}
                  className="form-control"
                />
              </label>
            </div>
          </div>

          <hr />

          <div className="d-md-flex pt-xl-3">
            <div className="col-md-4 pe-2">
              <label className="w-100 pt-2">
                Department:
                <input
                  type="text"
                  name="department"
                  value={formData.work?.department || ""}
                  onChange={(e) => handleNestedInputChange(e, "work")}
                  className="form-control "
                />
              </label>
            </div>
            <div className="col-md-4 pe-2">
              <label className="w-100 pt-2">
                Designation:
                <input
                  type="text"
                  name="designation"
                  value={formData.work?.designation || ""}
                  onChange={(e) => handleNestedInputChange(e, "work")}
                  className="form-control "
                />
              </label>
            </div>
            <div className="col-md-4 pe-2">
              <label className="w-100 pt-2">
                Salary{" "}
                <span className="text-secondary fw-normal">
                  {" "}
                  (AED per month){" "}
                </span>
                :
                <input
                  type="text"
                  name="salary"
                  value={formData.work?.salary || ""}
                  onChange={(e) => handleNestedInputChange(e, "work")}
                  className="form-control "
                />
              </label>
            </div>
          </div>

          <div className="d-md-flex justify-content-md-between">
            <div className="col-md-6">
              <label className="w-100 pe-2 pt-2">
                Start Date:
                <input
                  type="date"
                  name="startDate"
                  value={formData.work?.startDate?.slice(0, 10) || ""}
                  onChange={(e) => handleNestedInputChange(e, "work")}
                  className="form-control "
                />
              </label>
            </div>
            <div className="col-md-6">
              <label className="w-100 pe-2 pt-2">
                Contract End Date:
                <input
                  type="date"
                  name="contractEndDate"
                  value={formData.work?.contractEndDate?.slice(0, 10) || ""}
                  onChange={(e) => handleNestedInputChange(e, "work")}
                  className="form-control"
                />
              </label>
            </div>
          </div>

          <hr />

          <div className="d-md-flex pt-md-2 pt-xl-3">
            <div className="col-md-6 ">
              <label className="w-100 pe-2 pt-2">
                Passport Number:
                <input
                  type="text"
                  name="passportNo"
                  value={formData.passport?.passportNo || ""}
                  onChange={(e) => handleNestedInputChange(e, "passport")}
                  className="form-control"
                />
              </label>
            </div>
            <div className="col-md-6">
              <label className="w-100 pe-2 pt-2">
                Passport Expiry:
                <input
                  type="date"
                  name="expiryPassport"
                  value={formData.passport?.expiryPassport?.slice(0, 10) || ""}
                  onChange={(e) => handleNestedInputChange(e, "passport")}
                  className="form-control"
                />
              </label>
            </div>
          </div>

          <hr />
          <div className="d-md-flex pt-md-2 pt-xl-3">
            <div className="col-md-4">
              <label className="w-100 pe-2 pt-2">
                Emirates ID Number:
                <input
                  type="text"
                  name="emiratesidNo"
                  value={formData.emiratesId?.emiratesidNo || ""}
                  onChange={(e) => handleNestedInputChange(e, "emiratesId")}
                  className="form-control"
                />
              </label>
            </div>
            <div className="col-md-4">
              <label className="w-100 pe-2 pt-2">
                Emirates ID Expiry:
                <br />
                <input
                  type="date"
                  name="expiryID"
                  value={formData.emiratesId?.expiryID?.slice(0, 10) || ""}
                  onChange={(e) => handleNestedInputChange(e, "emiratesId")}
                  className="form-control"
                />
              </label>
            </div>
            <div className="col-md-4">
              <label className="w-100 pe-2 pt-2">
                Visa Expiry:
                <br />
                <input
                  type="date"
                  name="visaExpiry"
                  value={formData.visaExpiry?.slice(0, 10) || ""}
                  onChange={(e) => handleInputChange(e)}
                  className="form-control"
                />
              </label>
            </div>
          </div>

          <div className="save-cancel-button pt-4 pt-xl-5 d-flex justify-content-end">
            <button
              className="btn col-xl-2"
              style={{ padding: "1rem" }}
              type="button"
              onClick={handleUpdate}
            >
              Save Changes
            </button>
            <div className="pe-2"></div>
            <button
              className="btn col-xl-2"
              style={{ padding: "1rem" }}
              type="button"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="pt-sm-3">
          <div className="d-md-flex pt-3">
            <p className="col-md-4">
              <strong>Name:</strong> {employee.name}
            </p>
            <p className="col-md-4">
              <strong>Phone:</strong> {employee.phone}
            </p>
            <p className="col-md-4">
              <strong>Date of Birth:</strong>{" "}
              {formatDate(new Date(employee.dateOfBirth))}
            </p>
          </div>
          <div className="d-md-flex">
            <p className="col-md-6">
              <strong>Email:</strong> {employee.email}
            </p>
            <p className="col-md-6">
              <strong>Address:</strong> {employee.address}
            </p>
          </div>

          <div className="d-md-flex">
            <p className="col-md-6">
              <strong>Nationality:</strong> {employee.nationality}
            </p>
            <p className="col-md-6">
              <strong>Status:</strong> {employee.status}
            </p>
          </div>

          <hr />
          <div className="d-md-flex pt-3">
            <p className="col-md-4">
              <strong>Department:</strong>{" "}
              {employee.work?.department || "Not available"}
            </p>
            <p className="col-md-4">
              <strong>Designation:</strong>{" "}
              {employee.work?.designation || "Not available"}
            </p>
            <p className="col-md-4">
              <strong>
                Salary{" "}
                <span className="text-secondary fw-normal">
                  (AED per month)
                </span>
                :
              </strong>{" "}
              {employee.work?.salary
                ? Number(employee.work.salary).toFixed(2)
                : "Not available"}
            </p>
          </div>
          <div className="d-md-flex">
            <p className="col-md-6">
              <strong>Start Date:</strong>{" "}
              {formatDate(employee.work?.startDate)
                ? formatDate(new Date(employee.work.startDate))
                : "Not available"}
            </p>
            <p className="col-md-6">
              <strong>Contract End Date:</strong>{" "}
              {formatDate(employee.work?.contractEndDate)
                ? formatDate(new Date(employee.work.contractEndDate))
                : "Not available"}
            </p>
          </div>
          <hr />
          <div className="d-md-flex pt-3">
            <p className="col-md-6">
              <strong>Passport Number:</strong> {employee.passport?.passportNo}
            </p>
            <p className="col-md-6">
              <strong>Passport Expiry:</strong>{" "}
              {formatDate(new Date(employee.passport?.expiryPassport))}
            </p>
          </div>
          <hr />
          <div className="d-md-flex pt-3">
            <p className="col-md-4">
              <strong>Emirates ID Number:</strong>{" "}
              {employee.emiratesId?.emiratesidNo}
            </p>
            <p className="col-md-4">
              <strong>Emirates ID Expiry:</strong>{" "}
              {formatDate(new Date(employee.emiratesId?.expiryID))}
            </p>
            <p className="col-md-4">
              <strong>Visa Expiry:</strong>{" "}
              {formatDate(new Date(employee.visaExpiry))}
            </p>
          </div>
        </div>
      )}
    </section>
  );
};

export default EmployeeDetails;
