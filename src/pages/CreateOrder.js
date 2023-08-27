import { SearchOutlined } from "@mui/icons-material";
import { IconButton, Input, InputAdornment } from "@mui/material";
import axios from "axios";
import React, { useContext } from "react";
import { useState } from "react";
import { useEffect } from "react";
import ShowSearchProducts from "./ShowSearchProducts";
import Checkout from "../components/Checkout";
import { AuthContext } from "../context/AuthContext";
import useSessionStorage from "../hooks/useSessionStorage";

function CreateOrder() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { user } = useContext(AuthContext);
  const { getItem } = useSessionStorage();
  const API_URL = process.env.REACT_APP_API_URL;

  const handleSearch = () => {
    const filtered = filteredProducts.filter((product) => {
      return product.name.toLowerCase().includes(searchTerm.toLowerCase());
    });
    setFilteredProducts(filtered);
  };

  const fetchProducts = () => {
    axios
      .get(`${API_URL}/product`)
      .then((resonse) => setFilteredProducts(resonse.data));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const onInputChange = (event) => {
    setSearchTerm(event.target.value);
    if (searchTerm !== event.target.value) {
      handleSearch();
    }
  };

  return (
    <>
      {user ? (
        <>
          <div
            style={{
              backgroundColor: "#1888E8",
              width: "100%",
              height: "60px",
            }}
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
            <ShowSearchProducts filteredProducts={filteredProducts} />
          </div>
        </>
      ) : (
        <h2 className="center">Login to view page</h2>
      )}
    </>
  );
}

export default CreateOrder;
