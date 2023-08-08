import React, { useState, useEffect } from "react";
import { Button } from "react-materialize";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import env from "react-dotenv";
export default function Delete() {
  const [product, setProduct] = useState({});
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProduct();
  });

  const fetchProduct = async () => {
    try {
      const response = await axios.get(
        `${env.REACT_APP_PRODUCT_DB_URL}/${id}`
      );
      if (response) {
        console.log(response);
        setProduct(response.data);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(
        `${env.REACT_APP_PRODUCT_DB_URL}/${id}`
      );
      toast.success("Product deleted successfully");
      navigate("/manageproducts");
    } catch (error) {
      toast.error("Something went wrong!!!", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  const handleKeep = () => {
    navigate("/manageproducts");
  };

  return (
    <div style={{ marginTop: 180, fontSize: 30 }} className="center">
      <p>
        Do you want to delete the product <strong>{product.name}</strong>?
      </p>
      <Button
        style={{ marginRight: 10, backgroundColor: "green", color: "white" }}
        onClick={handleDelete}
      >
        Yes
      </Button>
      <Button
        style={{ marginLeft: 10, backgroundColor: "red", color: "white" }}
        onClick={handleKeep}
      >
        No
      </Button>
      <ToastContainer />
    </div>
  );
}
