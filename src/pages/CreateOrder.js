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
import { toast } from "react-toastify";

function CreateOrder() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { user } = useContext(AuthContext);
  const { getItem } = useSessionStorage();
  const API_URL = process.env.REACT_APP_API_URL;
  const [currentUser, setCurrentUser] = useState(
    sessionStorage.getItem("user") || null
  );
  const [msg, setMsg] = useState(null);

  const handleSearch = () => {
    const filtered = filteredProducts.filter((product) => {
      return product.name.toLowerCase().includes(searchTerm.toLowerCase());
    });
    setFilteredProducts(filtered);
  };

  useEffect(() => {
    handleSearch();
  }, [searchTerm]);

  useEffect(() => {
    checkUser();
  }, [user]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (
          currentUser.position === "Manager" ||
          currentUser.position === "Saler"
        ) {
          axios.get(`${API_URL}/product`).then((response) => {
            setFilteredProducts(response.data);
            return response.data;
          });
        } else setMsg("Only Manager can view this page");
      } catch (e) {
        toast.error("Something went wrong");
      }
    };
    fetchData();
  }, [currentUser]);

  const checkUser = async () => {
    try {
      if (user) {
        setCurrentUser(user);
      }
    } catch (e) {
      console.error(e);
      setMsg("Something went wrong");
    }
  };

  const onInputChange = (event) => {
    setSearchTerm(event.target.value);
    if (searchTerm !== event.target.value) {
      handleSearch();
    }
  };

  return (
    <>
      {currentUser.position === "Manager" ||
      currentUser.position === "Saler" ? (
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
            {filteredProducts.length > 0 && (
              <ShowSearchProducts filteredProducts={filteredProducts} />
            )}
          </div>
        </>
      ) : (
        <h2 className="center">Login to view page</h2>
      )}
    </>
  );
}

export default CreateOrder;
