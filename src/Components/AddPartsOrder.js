import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../css/AddVehicle.css";
import "../css/PartOrders.css";
import { API_BASE_URL } from "../apiConfig";

function AddPartsOrder() {
  const navigate = useNavigate();
  const [orderData, setOrderData] = useState({
    orders: [{ item: "", amount: 0, quantity: 1, totalPrice: 0 }],
    supplier: "",
    phone: "",
    targetVehicle: "",
  });

  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    const calculatedTotalAmount = orderData.orders.reduce(
      (sum, order) => sum + order.totalPrice,
      0
    );
    setTotalAmount(calculatedTotalAmount);
  }, [orderData.orders]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOrderData({ ...orderData, [name]: value });
  };

  const handleServiceChange = (index, e) => {
    const { name, value } = e.target;
    const updatedOrders = [...orderData.orders];
    updatedOrders[index][name] = value;
    updatedOrders[index].totalPrice =
      updatedOrders[index].amount * updatedOrders[index].quantity;
    setOrderData({ ...orderData, orders: updatedOrders });
  };

  const addOrderField = () => {
    setOrderData((prevData) => ({
      ...prevData,
      orders: [
        ...prevData.orders,
        { item: "", amount: 0, quantity: 1, totalPrice: 0 },
      ],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); 

    try {
      const orderPayload = {
        parts: orderData.orders,
        supplier: orderData.supplier,
        phone: orderData.phone,
        targetVehicle: orderData.targetVehicle,
      };

      const response = await axios.post(
        `${API_BASE_URL}/api/part-orders`,
        orderPayload
      );

      if (response.status === 201) {
        alert("Order created successfully!");

        navigate("/part-orders"); 
      }
    } catch (error) {
      console.error("Error creating order:", error);
      alert("Failed to create the order. Please try again.");
    }
  };

  const sendOrderViaWhatsApp = (contactNumber) => {
    if (!orderData.orders || !Array.isArray(orderData.orders)) {
      console.error('Order data is not properly initialized or is undefined.');
      return;
    }
  
    const itemList = orderData.orders.map(order => `${order.item}: ${order.quantity}`).join('\n');
  
    const whatsappMessage = `https://wa.me/${contactNumber}?text=${encodeURIComponent(itemList)}`;
  
    window.open(whatsappMessage, '_blank');
  };
  

  return (
    <section className="add-partorders p-4 p-md-5">
      <h1 className="new-order"> New Order </h1>
      <hr />

      <form onSubmit={handleSubmit} className="pt-3  form-group">
        <div className="pb-2">
          <label>Date:</label>
          <input
            type="text"
            className="form-control bg-white"
            value={new Date().toLocaleDateString()}
            readOnly
          />
        </div>

        <div
          style={{ overflowX: "auto" }}
          className="services  pt-3 pt-xl-5 pb-3 pb-xl-5"
        >
          <table
            style={{ width: "100%", borderCollapse: "collapse" }}
            className="bg-light"
          >
            <thead>
              <tr>
                <th class="border-padding">
                  Item Name
                </th>
                <th class="border-padding">
                  Unit Price <span className="text-secondary"> (AED) </span>
                </th>
                <th class="border-padding">
                  Quantity
                </th>
                <th class="border-padding">
                  Total <span className="text-secondary"> (AED) </span>
                </th>
                <th class="border-padding">
                  Add
                </th>
              </tr>
            </thead>
            <tbody>
              {orderData.orders.map((order, index) => (
                <tr key={index}>
                  <td class="border-padding">
                    <input
                      className=""
                      type="text"
                      name="item"
                      value={order.item}
                      onChange={(e) => handleServiceChange(index, e)}
                      required
                    />
                  </td>
                  <td class="border-padding">
                    <input
                      className=""
                      type="number"
                      name="amount"
                      value={order.amount}
                      onChange={(e) => handleServiceChange(index, e)}
                    />
                  </td>
                  <td class="border-padding">
                    <input
                      className=""
                      type="number"
                      name="quantity"
                      value={order.quantity}
                      onChange={(e) => handleServiceChange(index, e)}
                      required
                    />
                  </td>
                  <td class="border-padding">
                    <input
                      type="number"
                      className="form-control "
                      style={{ width: "13rem" }}
                      value={order.totalPrice}
                      readOnly
                    />
                  </td>
                  <td
                    style={{
                      border: "1px solid #ddd",
                      padding: "8px",
                      textAlign: "center",
                    }}
                    className=""
                  >
                    <button
                      type="button"
                      onClick={addOrderField}
                      className="btn add-item-partorder-btn"
                    >
                      +
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="d-sm-flex pt-2 label-group ">
          <div className="col-sm-6  ">
            <label>Supplier :</label>
            <input
              type="text"
              name="supplier"
              className="form-control"
              value={orderData.supplier}
              onChange={handleChange}
              required
            />
          </div>
          <div className=" col-sm-6">
            <label>Supplier's Contact No:</label>
            <input
              type="text"
              name="phone"
              className="form-control"
              value={orderData.phone}
              onChange={handleChange}
              required
            />
            <p style={{color:"red", fontSize:"0.75rem"}}> 
              Enter the Whatsapp number with country code +971 to send an order to supplier.
            </p>
          </div>
        </div>

        <div className="d-sm-flex pt-sm-5 label-group">
          <div className="col-sm-6">
            <label>Target Vehicle :</label>
            <input
              type="text"
              name="targetVehicle"
              className="form-control"
              value={orderData.targetVehicle}
              onChange={handleChange}
            />
          </div>
          <div className="col-sm-6">
            <p>
              <b>
                Total Amount <span className="text-secondary"> (AED) </span>:
                <p className="form-control">{totalAmount}</p>
              </b>
            </p>
          </div>
        </div>

        <div className="d-sm-flex pt-sm-5 label-group"></div>

        <div className="add-customer-button d-flex justify-content-sm-evenly p-sm-5 ps-sm-0 pe-sm-0">
          <button className="btn col-12 col-sm-4" type="submit" 
         >
            
            {" "}
            Add Order{" "}
          </button>
          <button className='btn col-sm-4' onClick={(e) => { 
            e.preventDefault(); 
            sendOrderViaWhatsApp(orderData.contactNumber); // Call WhatsApp function
          }}> Send Order </button>
        </div>
      </form>
    </section>
  );
}

export default AddPartsOrder;
