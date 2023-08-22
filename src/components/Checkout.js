import { Button, Input } from "@mui/material";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";

function Checkout({ cart, setCart }) {
  const [quantity, setQuantity] = useState({});
  const [amount, setAmount] = useState(0);
  const [cash, setCash] = useState(0.0);
  const [change, setChange] = useState(0.0);
  const { user } = useContext(AuthContext);
  const [order, setOrder] = useState([]);
  const [removedProducts, setRemovedProducts] = useState([]);
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
    setCash(cashValue);
    setChange(Math.round(cashValue - amount));
  };

  const deleteProductInCart = (productId) => {
    if (removedProducts.includes(productId)) {
      setRemovedProducts(removedProducts.filter((id) => id !== productId));
      setOrder(order.filter((item) => item.productId !== productId)); // Uncomment this line
      setCart(order.filter((item) => item.productId !== productId));
    } else {
      setRemovedProducts([...removedProducts, productId]);
    }
  };

  const submitOrder = async () => {
    const newOrder = {
      customerName: "",
      salerId: user.id,
      orderDetails: order,
    };

    try {
      const response = await axios.post(
        "http://vps.akabom.me/api/order",
        newOrder
      );
      console.log("Order submitted successfully", response.data);
      // Reset removed products after submitting the order
      setRemovedProducts([]);
    } catch (error) {
      console.error("Error submitting order", error);
    }
  };

  return (
    <div>
      <p>
        <b>Receipt</b>
      </p>
      <p>
        <b>Description:</b>
      </p>
      {order.map((orderItem) => (
        <div key={orderItem.productId}>
          <p>
            {orderItem.productName}:{orderItem.unitPrice}
          </p>
          <Input
            onChange={(e, productId) =>
              handleInputChange(e, orderItem.productId)
            }
            disableUnderline={true}
            placeholder="Enter quantity:"
          ></Input>
          <Button
            removeProduct={orderItem.productId}
            onClick={() => deleteProductInCart(orderItem.productId)}
          >
            Delete product
          </Button>
        </div>
      ))}
      <p>Total amount: ${amount}</p>
      <Input
        onChange={(e) => handleCashChange(e)}
        placeholder="Enter customer's cash:"
        disableUnderline={true}
      ></Input>
      <p>Change: {change}</p>
      <Button onClick={submitOrder}>Submit Order</Button>
    </div>
  );
}

export default Checkout;
