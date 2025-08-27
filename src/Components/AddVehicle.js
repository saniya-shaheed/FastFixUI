import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { formatDate } from "./FormateDate";
import "../css/AddVehicle.css";
import { API_BASE_URL } from "../apiConfig";

function AddVehicle() {
  const navigate = useNavigate();
  const [vehicleData, setVehicleData] = useState({
    customerName: "",
    phone: "",
    vehicleRegNo: "",
    brand: "",
    vehicleModel: "",
    mileage: "",
    paymentMethod: "",
    paidAmount: 0,
    vehicleAnalysis: "",
    services: [
      {
        serviceType: "",
        unitPrice: 0,
        quantity: 1,
        vat: 0,
        subTotal: 0,
      },
    ],
    spareParts: "",
    discount: 0,
  });

  const [totalAmount, setTotalAmount] = useState(0);
  const [dueAmount, setDueAmount] = useState(0);
  const [pendingAmount, setPendingAmount] = useState(0);
  const [completionDate, setCompletionDate] = useState(null);
  const [statusOfWork, setStatusOfWork] = useState("PROGRESS");

  useEffect(() => {
    const updatedServices = vehicleData.services.map((service) => {
      const calculatedVAT = 0.05 * service.unitPrice * service.quantity;
      const calculatedSubTotal = calculatedVAT + service.unitPrice * service.quantity;
      return {
        ...service,
        vat: service.vat !== undefined ? service.vat : calculatedVAT, // Explicitly allow 0 as a valid VAT value
      subTotal: (service.vat !== undefined ? service.vat : calculatedVAT) + service.unitPrice * service.quantity,
      };
    });

    const calculatedTotalAmount = updatedServices.reduce(
      (sum, service) => sum + service.subTotal,
      0
    );

    setVehicleData((prevState) => ({ ...prevState, services: updatedServices }));
    setTotalAmount(calculatedTotalAmount);

    const calculatedDueAmount = calculatedTotalAmount - vehicleData.discount;
    const calculatedPendingAmount = calculatedDueAmount - vehicleData.paidAmount;

    setDueAmount(calculatedDueAmount);
    setPendingAmount(calculatedPendingAmount);

    if (calculatedPendingAmount === 0 && calculatedTotalAmount > 0) {
      setCompletionDate(new Date().toLocaleDateString());
      setStatusOfWork("DONE");
    }
  }, [vehicleData.services, vehicleData.discount, vehicleData.paidAmount]);

  const statusStyle = {
    color: statusOfWork === "DONE" ? "green" : "red",
    fontWeight: "bold",
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVehicleData({ ...vehicleData, [name]: value });
  };

  const handleServiceChange = (index, e) => {
  const { name, value } = e.target;
  const updatedServices = [...vehicleData.services];

  if (name === "unitPrice" || name === "quantity") {
    const parsedValue = parseFloat(value) || 0;
    updatedServices[index][name] = parsedValue;

    // Auto-calculate VAT by default (5% of unitPrice * quantity) if user hasn't manually changed it
    if (!updatedServices[index].vatManuallySet) {
      updatedServices[index].vat = 0.05 * updatedServices[index].unitPrice * updatedServices[index].quantity;
    }
  } else if (name === "vat") {
    // If user changes VAT manually, mark it
    updatedServices[index].vat = parseFloat(value) || 0;
    updatedServices[index].vatManuallySet = true;
  } else {
    updatedServices[index][name] = value;
  }

  // Update subtotal
  updatedServices[index].subTotal = updatedServices[index].unitPrice * updatedServices[index].quantity + updatedServices[index].vat;

  setVehicleData({ ...vehicleData, services: updatedServices });
};


  const addServiceField = () => {
    setVehicleData({
      ...vehicleData,
      services: [
        ...vehicleData.services,
        { serviceType: "", unitPrice: 0, quantity: 1, vat: 0, subTotal: 0 },
      ],
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const vehicleToAdd = {
      ...vehicleData,
      totalAmount,
      dueAmount,
      completionDate,
      statusOfWork,
    };
    axios
      .post(`${API_BASE_URL}/api/vehicles`, vehicleToAdd)
      .then((response) => {
        console.log("Vehicle added successfully:", response.data);
        navigate("/vehicles");
      })
      .catch((error) => {
        console.error("Error adding vehicle:", error);
        alert("Failed to add vehicle. Please try again.");
      });
  };

  const startDate = formatDate(new Date().toLocaleDateString());

  const pendingAmountStyle = {
    color: pendingAmount === 0 ? "black" : "red",
  };
  return (
    <section className="add-vehicle p-4 p-md-5">
      <h1> New Customer </h1>
      <hr />

      <form onSubmit={handleSubmit} className="pt-3 form-group">
        <div className="status-of-work">
          <p>
            Status of Work: <span style={statusStyle}>{statusOfWork}</span>
          </p>
        </div>
        <p> Date: {startDate} </p>

        <div className="d-sm-flex pt-2 pt-xl-4 label-group ">
          <div className="col-sm-6  ">
            <label>Customer Name:</label>
            <input
              type="text"
              name="customerName"
              className="form-control"
              value={vehicleData.customerName}
              onChange={handleChange}
              required
            />
          </div>
          <div className=" col-sm-6">
            <label>Contact No:</label>
            <input
              type="text"
              name="phone"
              className="form-control"
              value={vehicleData.phone}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="d-sm-flex pt-sm-5 pt-xl-4 label-group">
          <div className="col-sm-3 pe-2">
            <label>Vehicle Reg No:</label>
            <input
              type="text"
              name="vehicleRegNo"
              className="form-control"
              value={vehicleData.vehicleRegNo}
              onChange={handleChange}
            />
          </div>
          <div className=" col-sm-3  pe-2">
            <label>Brand:</label>
            <input
              type="text"
              name="brand"
              className="form-control"
              value={vehicleData.brand}
              onChange={handleChange}
            />
          </div>
          <div className=" col-sm-3  pe-2">
            <label>Model:</label>
            <input
              type="text"
              name="vehicleModel"
              className="form-control"
              value={vehicleData.vehicleModel}
              onChange={handleChange}
            />
          </div>
          <div className=" col-sm-3 ">
            <label>Mileage:</label>
            <input
              type="number"
              name="mileage"
              className="form-control"
              value={vehicleData.mileage}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="pt-sm-2 pt-xl-4">
          <label>Vehicle Analysis:</label>
          <textarea
            type="text"
            name="vehicleAnalysis"
            className="form-control"
            value={vehicleData.vehicleAnalysis}
            onChange={handleChange}
            rows="4"
          />
        </div>

        <h6 className="services-heading pt-5 pb-2"> SERVICES </h6>
        <div style={{ overflowX: "auto" }} className="services bg-light">
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                  Type of Service
                </th>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                  Amount <span className="text-secondary"> (AED) </span>
                </th>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                  Quantity
                </th>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                  VAT
                </th>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                  Sub Total <span className="text-secondary"> (AED) </span>
                </th>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                  Add
                </th>
              </tr>
            </thead>
            <tbody>
              {vehicleData.services.map((service, index) => (
                <tr key={index}>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    <input
                      className=""
                      type="text"
                      name="serviceType"
                      value={service.serviceType}
                      onChange={(e) => handleServiceChange(index, e)}
                      required
                    />
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  <input
                type="number"
                name="unitPrice"
                value={service.unitPrice}
                onChange={(e) => handleServiceChange(index, e)}
                placeholder="Unit Price"
                required
              />
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    <input
                      className=""
                      type="number"
                      name="quantity"
                      value={service.quantity}
                      onChange={(e) => handleServiceChange(index, e)}
                      required
                    />
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  <input
              type="number"
              name="vat"
              value={service.vat}
              onChange={(e) => handleServiceChange(index, e)}
              placeholder="VAT"
            />
             
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  <input
                type="number"
                name="subTotal"
                value={service.subTotal}
                readOnly
                placeholder="Subtotal"
              />
                  </td>
                  <td
                    className="add-service-button"
                    style={{
                      border: "1px solid #ddd",
                      padding: "8px",
                      textAlign: "center",
                    }}
                  >
                    <button
                      type="button"
                      onClick={addServiceField}
                      style={{
                        backgroundColor: "transparent",
                        border: "none",
                        cursor: "pointer",
                        fontSize: "1.5rem",
                        color: "#007bff",
                      }}
                    >
                      +
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="pt-3 pt-xl-4">
          <label>Parts and Supplies: </label>
          <textarea
            type="text"
            name="spareParts"
            className="form-control"
            value={vehicleData.spareParts}
            onChange={handleChange}
            rows="4"
          />
        </div>

        <div className="d-sm-flex pt-sm-5 pt-xl-4 label-group">
          <div className="col-sm-4">
            <p>
              <b> Total Amount </b>
              <span className="text-secondary"> (AED) </span> :
              <p className="form-control">
                <b>{totalAmount}</b>
              </p>
            </p>
          </div>
        
          <div className="col-sm-4">
            <p>
              <b> Due Amount </b>
              <span className="text-secondary"> (AED) </span> :
              <p className="form-control">
                <b>{dueAmount}</b>
              </p>
            </p>
          </div>
          </div>
          <div className="d-sm-flex pt-sm-5 pt-xl-4 label-group">
          <div className=" col-sm-3 ">
            <label>Discount:</label>
            <input
              type="number"
              name="discount"
              className="form-control"
              value={vehicleData.discount}
              onChange={handleChange}
            />
          </div>

          <div className="col-sm-4">
            <label>
              Paid Amount{" "}
              <span className="text-secondary fw-normal"> (AED) </span>:
            </label>
            <input
              type="number"
              className="form-control"
              name="paidAmount"
              value={vehicleData.paidAmount}
              onChange={handleChange}
            />
          </div>
          <div className="col-sm-4">
            <p>
              <b>Pending Amount </b>
              <span className="text-secondary"> (AED) </span>:
              <p className="form-control" style={pendingAmountStyle}>
                {pendingAmount}
              </p>
            </p>
          </div>
        </div>

        <div className="d-sm-flex pt-2 pt-xl-4 label-group">
          <div className="col-sm-6">
            <label>Payment Method:</label>
            <div className="d-md-flex pt-2 radio-buttons">
              <div className="form-check">
                <input
                  type="radio"
                  id="cash"
                  name="paymentMethod"
                  value="Cash"
                  className="form-check-input"
                  checked={vehicleData.paymentMethod === "Cash"}
                  onChange={handleChange}
                />
                <label htmlFor="cash" className="form-check-label">
                  Cash
                </label>
              </div>

              <div className="form-check">
                <input
                  type="radio"
                  id="creditCard"
                  name="paymentMethod"
                  value="Credit Card"
                  className="form-check-input"
                  checked={vehicleData.paymentMethod === "Credit Card"}
                  onChange={handleChange}
                />
                <label htmlFor="creditCard" className="form-check-label">
                  Credit Card
                </label>
              </div>

              <div className="form-check">
                <input
                  type="radio"
                  id="debitCard"
                  name="paymentMethod"
                  value="Debit Card"
                  className="form-check-input"
                  checked={vehicleData.paymentMethod === "Debit Card"}
                  onChange={handleChange}
                />
                <label htmlFor="debitCard" className="form-check-label">
                  Debit Card
                </label>
              </div>

              <div className="form-check">
                <input
                  type="radio"
                  id="cheque"
                  name="paymentMethod"
                  value="Cheque"
                  className="form-check-input"
                  checked={vehicleData.paymentMethod === "Cheque"}
                  onChange={handleChange}
                />
                <label htmlFor="cheque" className="form-check-label">
                  Cheque
                </label>
              </div>
            </div>
          </div>

          <div className="col-sm-6 pt-3">
            {completionDate && (
              <p className="text-sm-end">
                Date of Completion: {formatDate(completionDate)}
              </p>
            )}
          </div>
        </div>
        <div className="add-customer-button d-flex justify-content-sm-end p-sm-5 ps-sm-0 pe-sm-0">
          <button className="btn col-12 col-sm-6" type="submit">
            {" "}
            Add Customer{" "}
          </button>
        </div>
      </form>
    </section>
  );
}

export default AddVehicle;
