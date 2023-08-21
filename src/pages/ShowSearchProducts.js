import { Button } from "@mui/material";
import React, { useState } from "react";
import Checkout from "../components/Checkout";

function ShowSearchProducts({ filteredProducts }) {
  const [cart, setCart] = useState({});
  const [selectedProducts, setSelectedProducts] = useState([]);
  const addToCart = (product) => {
    if (!cart[product.id]) {
      setCart((prevCart) => ({
        ...prevCart,
        [product.id]: product,
      }));
      setSelectedProducts([...selectedProducts, product.id]);
    }
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-sm-6 col-md-5 col-lg-5" style={{ marginTop: 50 }}>
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              style={{
                transform: "translate(3%, -150%)",
                marginTop: 0,
              }}
            >
              <div style={{ width: "20%", display: "inline" }}>
                <img
                  src={product.imageUrl}
                  style={{ width: "100px", height: "80px" }}
                  alt={product.name}
                />
              </div>
              <div
                style={{
                  display: "inline",
                  transform: "translate(15%, 100%)",
                  marginTop: 0,
                }}
              >
                <p
                  style={{
                    display: "inline",
                    marginTop: 0,
                  }}
                >
                  Name:
                  <b> {product.name}</b>
                </p>
                <span
                  style={{
                    color: "#1a86ff",
                    marginLeft: "20px",
                    display: "inline",
                  }}
                >
                  Price: ${product.price}
                </span>
                <p
                  style={{
                    display: "inline",
                    marginLeft: 20,
                    marginRight: 20,
                  }}
                >
                  Stock: {product.stock}
                </p>
                <Button variant="contained" onClick={() => addToCart(product)}>
                  Add to cart
                </Button>
              </div>
            </div>
          ))}
        </div>
        <div className="col-sm-6 col-md-7 col-lg-7" style={{ marginTop: 50 }}>
          <Checkout cart={cart} />
        </div>
      </div>
    </div>
  );
}

export default ShowSearchProducts;
