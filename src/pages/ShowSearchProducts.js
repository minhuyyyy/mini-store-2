import { Button, Grid } from "@mui/material";
import React, { useState } from "react";
import Checkout from "../components/Checkout";

function ShowSearchProducts({ filteredProducts }) {
  const [cart, setCart] = useState({});
  const [selectedProducts, setSelectedProducts] = useState([]);

  const addToCart = (product) => {
    if (selectedProducts.includes(product.id)) {
      setSelectedProducts(selectedProducts.filter((id) => id !== product.id));
    } else {
      setSelectedProducts([...selectedProducts, product.id]);
    }

    setCart((prevCart) => ({
      ...prevCart,
      [product.id]: product,
    }));
  };

  return (
    <>
      <Grid container spacing={2}>
        {filteredProducts.map((product) => (
          <React.Fragment key={product.id}>
            <Grid item sm={6} md={6} lg={6}>
              <div
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
                  ></img>
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
                  <Button
                    variant="contained"
                    onClick={() => addToCart(product)}
                  >
                    Add to cart
                  </Button>
                </div>
              </div>
            </Grid>
            <Grid item sm={6} md={6} lg={6}>
              {selectedProducts.length > 0 && (
                <Checkout cart={cart} selectedProducts={selectedProducts} />
              )}
            </Grid>
          </React.Fragment>
        ))}
      </Grid>
    </>
  );
}

export default ShowSearchProducts;
