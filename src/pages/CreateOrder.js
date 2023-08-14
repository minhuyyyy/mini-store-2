import { SearchOutlined } from "@mui/icons-material";
import { IconButton, Input, InputAdornment } from "@mui/material";
import axios from "axios";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import ShowSearchProducts from "./ShowSearchProducts";
import Checkout from "../components/Checkout";

function CreateOrder() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = () => {
    const filtered = products.filter((product) => {
      console.log(searchTerm.trim.length);
      // if (searchTerm.trim.length <= 0) return;

      return product.name.toLowerCase().includes(searchTerm.toLowerCase());
    });
    setFilteredProducts(filtered);
    console.log(filteredProducts);
  };

  const fetchProducts = () => {
    axios
      .get("http://vps.akabom.me/api/product")
      .then((resonse) => setProducts(resonse.data));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const onInputChange = (event) => {
    setSearchTerm(event.target.value);
    if (searchTerm !== event.target.value) {
      handleSearch(); // Call handleSearch whenever input changes
    }
  };

  return (
    <>
      <h2 className="center" style={{ marginTop: "20px" }}>
        Create Order
      </h2>
      <div
        style={{ backgroundColor: "#1888E8", width: "100%", height: "60px" }}
      >
        <Input
          id="search"
          placeholder="Search products:"
          sx={{
            border: "1px solid black",
            height: "60px",
            textDecoration: "none",
            width: "30%",
            height: "70%",
            marginBottom: 20,
            backgroundColor: "white",
            transform: "translate(3%, 25%)",
            borderRadius: "5px",
          }}
          className="center"
          value={searchTerm}
          disableUnderline={true}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSearch();
          }}
          onChange={onInputChange}
          endAdornment={
            <InputAdornment position="end">
              <IconButton onClick={handleSearch}>
                <SearchOutlined />
              </IconButton>
            </InputAdornment>
          }
        ></Input>
        {filteredProducts.length > 0 && (
          <ShowSearchProducts filteredProducts={filteredProducts} />
        )}
      </div>
    </>
  );
}

export default CreateOrder;
