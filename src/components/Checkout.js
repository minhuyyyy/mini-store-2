import { Button, Input } from "@mui/material";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";

function Checkout({ cart, setCart }) {
  const [quantity, setQuantity] = useState({});
  const [amount, setAmount] = useState(0);
  const [cash, setCash] = useState(0.0);
  const [change, setChange] = useState(0.0);
  const { user } = useContext(AuthContext);
  const [order, setOrder] = useState([]);
  const [removedProducts, setRemovedProducts] = useState([]);
  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    let totalAmount = 0;
    Object.keys(cart).forEach((productId) => {
      totalAmount += cart[productId].price * (quantity[productId] || 0);
    });
    setAmount(totalAmount);

    const orderDetails = Object.keys(cart).map((productId) => ({
      productId: productId,
      productName: cart[productId].name,
      unitPrice: cart[productId].price,
      unit: cart[productId].unit,
      quantity: quantity[productId] || 0,
    }));
    setOrder(orderDetails);
  }, [cart, quantity]);

  const handleInputChange = (e, productId) => {
    setQuantity((prevQuantity) => ({
      ...prevQuantity,
      [productId]: e.target.value,
    }));
  };

  const handleCashChange = (e) => {
    const cashValue = parseFloat(e.target.value);
    setCash(cashValue.toLocaleString());
    if (cashValue < amount) {
      setChange(0);
    } else {
      setChange(Math.round(cashValue - amount));
    }
  };

  const deleteProductInCart = (productId) => {
    const updatedCart = { ...cart };
    delete updatedCart[productId];

    setCart(updatedCart);

    const updatedOrder = order.filter((item) => item.productId !== productId);
    setOrder(updatedOrder);
  };

  const submitOrder = async () => {
    const newOrder = {
      customerName: "",
      salerId: user.id,
      orderDetails: order,
    };

    try {
      if (order.length > 0) {
        const response = await axios.post(`${API_URL}order`, newOrder);
        toast.success("Order submitted successfully");
        setRemovedProducts([]);
        setCart({});
        setOrder([]);
        setCash(0);
      } else {
        toast.error("Empty cart");
      }
    } catch (error) {
      console.error("Error submitting order", error);
    }
  };

  return (
    <div>
      <h2>
        <b>Receipt</b>
      </h2>
      <table className="table table-striped">
        <thead>
          <tr>
            <th scope="col">Product Name</th>
            <th scope="col">Unit Price</th>
            <th scope="col">Unit</th>
            <th scope="col">Quantity</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody className="table-group-divider">
          {order.map((orderItem) => (
            <tr key={orderItem.productId} style={{}}>
              <td>{orderItem.productName}</td>
              <td>{orderItem.unitPrice.toLocaleString()}</td>
              <td>{orderItem.unit}</td>
              <td>
                <Input
                  value={quantity[orderItem.productId] || ""}
                  onChange={(e) => handleInputChange(e, orderItem.productId)}
                  disableUnderline={true}
                  placeholder="Enter quantity..."
                />
              </td>
              <td>
                <Button
                  onClick={() => deleteProductInCart(orderItem.productId)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p>Total amount: {amount.toLocaleString()} VND</p>
      <Input
        onChange={(e) => handleCashChange(e)}
        placeholder="Enter customer's cash..."
        disableUnderline={true}
      />
      <p>Change: {change.toLocaleString()}</p>
      <Button onClick={submitOrder}>Submit Order</Button>
    </div>
  );
}

export default Checkout;
