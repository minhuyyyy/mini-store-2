import { Grid } from "@mui/material";
import env from "react-dotenv";
import Drawer from "./Drawer";
import ProductsPresentation from "./Products";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";

const Home = () => {
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    // Get all the products from the database
    axios
      .get(`${env.REACT_APP_PRODUCT_DB_URL}`)
      .then(function (response) {
        setFilteredProducts(response.data);
      });
  }, []);

  return (
    <Grid
      style={{ paddingTop: "25px", paddingBottom: "35px", margin: "0 50px" }}
    >
      <Grid container spacing={2} sx={{ paddingBottom: "15px" }}>
        <Grid item xs={2} sm={6} md={6} lg={2}>
          <Drawer />
        </Grid>
        <Grid item xs={12} sm={6} md={6} lg={8}>
          <ProductsPresentation filteredProducts={filteredProducts} />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Home;
