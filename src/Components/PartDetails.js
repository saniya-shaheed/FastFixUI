import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { formatDate } from "./FormateDate";
import { API_BASE_URL } from "../apiConfig";

function PartDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [orders, setOrders] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/api/part-orders/${id}`)
      .then((response) => {
        console.log("data:", response.data);
        setOrders(response.data);
        setFormData(response.data); // Set initial form data
        setLoading(false);
      })
      .catch((err) => {
        setError("Error fetching  details");
        setLoading(false);
      });
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleOrderChange = (index, field, value) => {
    const updatedOrders = [...formData.parts];
    updatedOrders[index][field] = value;
    setFormData({ ...formData, parts: updatedOrders });
  };

  const addItem = () => {
    const newItem = { item: "", amount: 0, quantity: 1 };
    setFormData({
      ...formData,
      parts: [...formData.parts, newItem],
    });
  };

  const deleteItem = (index) => {
    const updatedItem = formData.parts.filter((_, i) => i !== index);
    setFormData({ ...formData, parts: updatedItem });
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    navigate("/part-orders");
    axios
      .put(`${API_BASE_URL}/api/part-orders/${id}`, formData)
      .then((response) => {
        setOrders(response.data);
        setIsEditing(false); // Exit edit mode after successful update
      })
      .catch((err) => {
        console.error("Error updating  details", err);
        setError("Error updating  details");
      });
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <section className="part-details p-4 pt-sm-5 p-md-5">
      {!isEditing ? (
        <div className="d-flex justify-content-between align-items-center">
          <h1 className="details-heading col-6">{orders.supplier}</h1>
          <div className="col-6 d-flex edit-print-buttons justify-content-end">
            <button className="btn col-9  col-xl-4 " onClick={handleEditToggle}>
              Edit{" "}
            </button>
          </div>
        </div>
      ) : (
        <div className="d-flex justify-content-between">
          <h1 className="details-heading">{orders.supplier}</h1>
        </div>
      )}

      <hr />

      {!isEditing ? (
        <div className="pt-sm-3">
          <div className="d-md-flex labels-at-top">
            <div className="col-md-6">
              <p>
                <strong>Supplier:</strong> {orders.supplier}
              </p>
              <p>
                <strong>Phone:</strong> {orders.phone}
              </p>
            </div>
            <div className="col-md-6 date-id">
              <p>
                <strong>Date:</strong> {formatDate(orders.date)}
              </p>
              <p>
                <strong>Target Vehicle:</strong> {orders.targetVehicle}
              </p>
            </div>
          </div>
          <div className="pt-2 pt-xl-5 pb-2">
            <div className="table-responsive">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Amount (AED)</th>
                    <th>Quantity</th>
                    <th>Total (AED)</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.parts.map((part, index) => (
                    <tr key={index}>
                      <td>{part.item}</td>
                      <td>{part.amount}</td>
                      <td>{part.quantity}</td>
                      <td>{part.totalPrice}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="amounts d-sm-flex pt-3">
            <p>
              <strong>Total Amount: AED {orders.totalAmount}</strong>
            </p>
          </div>
        </div>
      ) : (
        <form onSubmit={handleFormSubmit} className="edit-form">
          <p>
            <strong>Date:</strong> {formatDate(orders.date)}
          </p>
          <div className="d-md-flex justify-content-md-between">
            <div className="mb-3 col-md-4 pe-md-2 ">
              <label className="form-label">Supplier</label>
              <input
                type="text"
                className="form-control"
                name="supplier"
                value={formData.supplier || ""}
                onChange={handleInputChange}
              />
            </div>

            <div className="mb-3 col-md-4 pe-md-2">
              <label className="form-label">Phone</label>
              <input
                type="text"
                className="form-control"
                name="phone"
                value={formData.phone || ""}
                onChange={handleInputChange}
              />
            </div>

            <div className="mb-3 col-md-4">
              <label className="form-label">Target Vehicle</label>
              <input
                type="text"
                className="form-control"
                name="targetVehicle"
                value={formData.targetVehicle || ""}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <hr />
          <div className="pt-2 d-flex items-add-item  justify-content-between">
            <h2 className="col-6"> ITEMS </h2>
            <div className="col-6 d-flex justify-content-end">
              <button type="button" className="btn" onClick={addItem}>
                Add Item
              </button>
            </div>
          </div>

          <div className="pt-3  pb-2 table-responsive">
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Amount (AED)</th>
                  <th>Quantity</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {formData.parts.map((part, index) => (
                  <tr key={index}>
                    <td>
                      <input
                        type="text"
                        className="form-control"
                        value={part.item}
                        onChange={(e) =>
                          handleOrderChange(index, "item", e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        className="form-control"
                        value={part.amount}
                        onChange={(e) =>
                          handleOrderChange(index, "amount", e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        className="form-control"
                        value={part.quantity}
                        onChange={(e) =>
                          handleOrderChange(index, "quantity", e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <div className="justify-content-center d-flex">
                        <button
                          type="button"
                          className="btn btn-danger"
                          onClick={() => deleteItem(index)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="d-flex pt-3 ">
            <button type="submit" className="btn btn-primary">
              Save Changes
            </button>
            <div className="pe-1"> </div>
            <button
              type="button"
              className="btn btn-secondary"
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

export default PartDetails;
