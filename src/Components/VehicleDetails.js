import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { formatDate } from "./FormateDate";
import "../css/PrintCustomer.css";
import "../css/VehicleDetails.css";
import { API_BASE_URL } from "../apiConfig";

function VehicleDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [vehicle, setVehicle] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/api/vehicles/${id}`)
      .then((response) => {
        setVehicle(response.data);
        setFormData(response.data); // Set initial form data
        setLoading(false);
      })
      .catch((err) => {
        setError("Error fetching vehicle details");
        setLoading(false);
      });
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleServiceChange = (index, field, value) => {
    const updatedServices = [...formData.services];
    updatedServices[index][field] = value;
    setFormData({ ...formData, services: updatedServices });
  };

  const addService = () => {
    const newService = { serviceType: "", amount: 0, quantity: 1 };
    setFormData({
      ...formData,
      services: [...formData.services, newService],
    });
  };

  const deleteService = (index) => {
    const updatedServices = formData.services.filter((_, i) => i !== index);
    setFormData({ ...formData, services: updatedServices });
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    navigate("/vehicles");
    axios
      .put(`${API_BASE_URL}/api/vehicles/${id}`, formData)
      .then((response) => {
        setVehicle(response.data);
        setIsEditing(false); // Exit edit mode after successful update
      })
      .catch((err) => {
        console.error("Error updating vehicle details", err);
        setError("Error updating vehicle details");
      });
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <section className="vehicle-details p-4 pt-sm-5 p-md-5">
      <header className="print-header d-print-block d-none">
        <div className="">
          <div className="">
            <img
              src="/images/fastfix_printheader.png"
              alt="FastFix Automaintenance Logo"
              className=" print-logo"
            />

            <p className="ps-3">
              Industrial Area 5, Sharjah
              <br />
              0529479330, 055656616
            </p>
          </div>
          <div className="ps-3 d-flex social-icons">
            <p className="align-items-center d-flex">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                className="pe-1"
              >
                <path d="M64 112c-8.8 0-16 7.2-16 16l0 22.1L220.5 291.7c20.7 17 50.4 17 71.1 0L464 150.1l0-22.1c0-8.8-7.2-16-16-16L64 112zM48 212.2L48 384c0 8.8 7.2 16 16 16l384 0c8.8 0 16-7.2 16-16l0-171.8L322 328.8c-38.4 31.5-93.7 31.5-132 0L48 212.2zM0 128C0 92.7 28.7 64 64 64l384 0c35.3 0 64 28.7 64 64l0 256c0 35.3-28.7 64-64 64L64 448c-35.3 0-64-28.7-64-64L0 128z" />
              </svg>
              <span>fastfixautoMaint@gmail.com </span>
            </p>

            <p className="align-items-center d-flex">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
                className="pe-1"
              >
                <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" />
              </svg>
              <span>fastfixautomaint </span>
            </p>

            <p className="align-items-center d-flex">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                className="pe-1"
              >
                <path d="M512 256C512 114.6 397.4 0 256 0S0 114.6 0 256C0 376 82.7 476.8 194.2 504.5V334.2H141.4V256h52.8V222.3c0-87.1 39.4-127.5 125-127.5c16.2 0 44.2 3.2 55.7 6.4V172c-6-.6-16.5-1-29.6-1c-42 0-58.2 15.9-58.2 57.2V256h83.6l-14.4 78.2H287V510.1C413.8 494.8 512 386.9 512 256h0z" />
              </svg>
              <span> Faast Fix Auto Maintanence </span>
            </p>
          </div>
        </div>
        <hr />
      </header>

      <h1 className="details-heading">{vehicle.customerName}</h1>
      <hr />

      {!isEditing ? (
        <div className="pt-sm-3">
          <div className="d-md-flex labels-at-top">
            <div className="col-md-6">
              <p>
                <strong>Customer Name:</strong> {vehicle.customerName}
              </p>
              <p>
                <strong>Phone:</strong> {vehicle.phone}
              </p>
            </div>
            <div className="col-md-6 date-id">
              <p>
                <strong>Date:</strong> {formatDate(vehicle.date)}
              </p>
              <p>
                <strong>Customer ID:</strong> {vehicle.vehicleId}
              </p>
            </div>
          </div>
          <div className="d-md-flex labels-at-top regno-brand pb-2">
            <p className="col-md-4">
              <strong>Vehicle Reg No:</strong> {vehicle.vehicleRegNo}
            </p>
            <p className="col-md-4">
              <strong>Brand & Model:</strong> {vehicle.brand}{" "}
              {vehicle.vehicleModel}{" "}
            </p>
            <p className="col-md-4">
              <strong>Mileage: </strong> {vehicle.mileage}
            </p>
          </div>

          <div className="d-md-flex labels-at-top regno-brand pb-2">
            {vehicle.vehicleAnalysis && (
              <p className="col-md-6">
                <strong>Vehicle Analysis:</strong> {vehicle.vehicleAnalysis}
              </p>
            )}
            {vehicle.spareParts && (
              <p className="col-md-6">
                <strong>Parts & Supplies:</strong> {vehicle.spareParts}
              </p>
            )}
          </div>
          <div className="table-responsive pt-2 pb-2 pt-xl-4 pb-xl-4">
            <table className=" table table-bordered">
              <thead>
                <tr>
                  <th>Service</th>
                  <th>Amount (AED)</th>
                  <th>Quantity</th>
                  <th>Total (AED)</th>
                </tr>
              </thead>
              <tbody>
                {vehicle.services.map((service, index) => (
                  <tr key={index}>
                    <td>{service.serviceType}</td>
                    <td>{service.amount}</td>
                    <td>{service.quantity}</td>
                    <td>{service.totalPrice}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="amounts d-sm-flex">
            <p>
              <strong>Total Amount:</strong> AED {vehicle.totalAmount}
            </p>
            <p>
              <strong>Paid Amount:</strong> AED {vehicle.paidAmount}
            </p>
            <p>
              <strong>Pending Amount:</strong> AED {vehicle.pendingAmount}
            </p>
          </div>
          <div className="d-sm-flex date-status">
            <p className="col-sm-6">
              <strong>Status:</strong> {vehicle.statusOfWork}
            </p>
            {vehicle.pendingAmount === 0 && (
              <p className="col-sm-6">
                <strong>Date Finished:</strong> {formatDate(vehicle.finishDate)}
              </p>
            )}
          </div>

          <div className="pt-3 pb-5 d-flex edit-print-buttons">
            <button className="btn col-6 col-sm-4 " onClick={handleEditToggle}>
              Edit Details
            </button>
            <button className="btn col-6 col-sm-4" onClick={handlePrint}>
              Print
            </button>
          </div>

          <div className="print-footer">
            <hr />
            <div className="d-flex">
              <div className="col-6"> FastFix Automaintanence </div>
              <div className="col-6 d-flex justify-content-center"> Admin </div>
            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={handleFormSubmit} className="edit-form">
          <div className="d-md-flex justify-content-md-between">
            <p>
              <strong>Date:</strong> {formatDate(vehicle.date)}
            </p>
            <p>
              <strong>Vehicle ID:</strong> {vehicle.vehicleId}
            </p>
          </div>
          <div className="edit-group d-md-flex justify-content-md-between">
            <div className="mb-3 col-md-6 pe-2">
              <label className="form-label">Customer Name</label>
              <input
                type="text"
                className="form-control"
                name="customerName"
                value={formData.customerName || ""}
                onChange={handleInputChange}
              />
            </div>

            <div className="mb-3 col-md-6 ">
              <label className="form-label">Phone</label>
              <input
                type="text"
                className="form-control"
                name="phone"
                value={formData.phone || ""}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="edit-group d-md-flex justify-content-md-between">
            <div className="mb-3 col-md-3 pe-2">
              <label className="form-label">Vehicle Reg No</label>
              <input
                type="text"
                className="form-control"
                name="vehicleRegNo"
                value={formData.vehicleRegNo || ""}
                onChange={handleInputChange}
              />
            </div>

            <div className="mb-3 col-md-3 pe-2">
              <label className="form-label">Brand</label>
              <input
                type="text"
                className="form-control"
                name="brand"
                value={formData.brand || ""}
                onChange={handleInputChange}
              />
            </div>

            <div className="mb-3 col-md-3 pe-2">
              <label className="form-label">Model</label>
              <input
                type="text"
                className="form-control"
                name="vehicleModel"
                value={formData.vehicleModel || ""}
                onChange={handleInputChange}
              />
            </div>

            <div className="mb-3 col-md-3 ">
              <label className="form-label">Mileage </label>
              <input
                type="number"
                className="form-control"
                name="mileage"
                value={formData.mileage || ""}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="edit-group d-md-flex justify-content-md-between">
            <div className="mb-3 col-md-6 pe-2">
              <label className="form-label">Analysis: </label>
              <input
                type="text"
                className="form-control"
                name="vehicleAnalysis"
                value={formData.vehicleAnalysis || ""}
                onChange={handleInputChange}
              />
            </div>

            <div className="mb-3 col-md-6 ">
              <label className="form-label">Parts & Supplies: </label>
              <input
                type="text"
                className="form-control"
                name="spareParts"
                value={formData.spareParts || ""}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <hr />

          <div className="edit-services pb-2 d-flex justify-content-between">
            <h6> SERVICES </h6>
            <button
              type="button"
              className="btn  col-xl-2"
              onClick={addService}
            >
              Add Service
            </button>
          </div>

          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th scope="">Service Type</th>
                  <th scope="col">Amount</th>
                  <th scope="col">Quantity</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {formData.services.map((service, index) => (
                  <tr key={index}>
                    <td>
                      <input
                        type="text"
                        className="form-control"
                        value={service.serviceType}
                        onChange={(e) =>
                          handleServiceChange(
                            index,
                            "serviceType",
                            e.target.value
                          )
                        }
                        placeholder="Service Type"
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        className="form-control"
                        value={service.amount}
                        onChange={(e) =>
                          handleServiceChange(index, "amount", e.target.value)
                        }
                        placeholder="Amount"
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        className="form-control"
                        value={service.quantity}
                        onChange={(e) =>
                          handleServiceChange(index, "quantity", e.target.value)
                        }
                        placeholder="Quantity"
                      />
                    </td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-danger w-100"
                        onClick={() => deleteService(index)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <hr />

          <div className="paid-amount-edit mb-3 pt-3 d-flex justify-content-between">
            <label className="form-label col-md-4">Paid Amount</label>
            <input
              type="number"
              className="form-control "
              name="paidAmount"
              value={formData.paidAmount || ""}
              onChange={handleInputChange}
            />
          </div>

          <div className="d-flex pt-3 ">
            <button type="submit" className=" col-xl-2 btn">
              Save Changes
            </button>
            <div className="pe-1"> </div>
            <button
              type="button"
              className=" col-xl-2 btn"
              onClick={handleEditToggle}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </section>
  );
}

export default VehicleDetails;
