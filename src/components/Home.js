import React, { useState, useEffect } from "react";
import { Grid } from "@mui/material";
import axios from "axios";
import env from "react-dotenv";
import ProductsPresentation from "./Products";
import Drawer from "./Drawer";

function Home() {
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    // Fetch all products initially or when category changes
    axios.get(`${env.REACT_APP_PRODUCT_DB_URL}`).then((response) => {
      const data = response.data;

      // If a category is selected, filter products
      if (selectedCategory) {
        const filtered = data.filter(
          (product) => product.category === selectedCategory
        );
        setFilteredProducts(filtered);
      } else {
        setFilteredProducts(data);
      }
    });
  }, [selectedCategory]);

  return (
    <Grid
      style={{ paddingTop: "25px", paddingBottom: "35px", margin: "0 50px" }}
    >
      <Grid container spacing={2} sx={{ paddingBottom: "15px" }}>
        <Grid item sm={4} md={3} lg={2}>
          <Drawer onCategorySelect={setSelectedCategory} />
        </Grid>
        <Grid item xs={12} sm={8} md={9} lg={10}>
          <ProductsPresentation filteredProducts={filteredProducts} />
        </Grid>
      </Grid>
    </Grid>
  );
}

export default Home;
