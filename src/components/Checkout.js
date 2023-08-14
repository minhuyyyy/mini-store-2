import { Input } from "@mui/material";
import React, { useEffect, useState } from "react";

function Checkout({ cart, selectedProducts }) {
  const products = cart.filter((product) =>
    selectedProducts.includes(product.id)
  );
  const [quantity, setQuantity] = useState(1);
  const [amount, setAmount] = useState(0);

  useEffect(() => {
    setAmount(products.reduce((acc, product) => acc + product.price * quantity, 0));
  }, [products, quantity]);

  const handleInputChange = (e) => {
    setQuantity(e.target.value);
    setAmount(products.reduce((acc, product) => acc + product.price * quantity, 0));
  };

  return (
    <div>
      <p>
        <b>Receipt</b>
      </p>
      {products.map((product) => (
        <span key={product.id}>
          Description:
          <p>
            {product.id}: {product.name}
          </p>
          <span>{product.price}</span>
          <Input
            onChange={handleInputChange}
            disableUnderline={true}
            value={quantity}
          >
            {quantity}
          </Input>
        </span>
      ))}

      <p>Total amount: {amount}</p>
      <p>Cash:</p>
      <p>Change</p>
    </div>
  );
}

export default Checkout;
