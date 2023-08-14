import { Input } from "@mui/material";
import React, { useEffect, useState } from "react";

function Checkout({ cart }) {
  const [quantity, setQuantity] = useState({});
  const [amount, setAmount] = useState(0);

  useEffect(() => {
    let totalAmount = 0;
    Object.keys(cart).forEach((productId) => {
      totalAmount += cart[productId].price * quantity[productId];
    });
    setAmount(totalAmount);
  }, [cart, quantity]);

  const handleInputChange = (e, productId) => {
    setQuantity((prevQuantity) => ({
      ...prevQuantity,
      [productId]: e.target.value,
    }));
  };

  return (
    <div>
      <p>
        <b>Receipt</b>
      </p>
      {Object.keys(cart).map((productId) => (
        <div key={productId}>
          <p>
            <b>Description:</b>
          </p>
          <p>
            {productId}: {cart[productId].name}
          </p>
          <p>Price: {cart[productId].price}</p>
          <Input
            onChange={(e) => handleInputChange(e, productId)}
            disableUnderline={true}
            value={quantity[productId] || ""}
          >
            Quantity:
          </Input>
        </div>
      ))}
      <p>Total amount: {amount}</p>
      <p>Cash: {amount}</p>
      <p>Change</p>
    </div>
  );
}

export default Checkout;
