import React, { useEffect, useState } from "react";
import {
  FormControl,
  Input,
  MenuItem,
  Select,
  Button,
  ThemeProvider,
  IconButton,
  Icon,
} from "@mui/material";
import axios from "axios";
import { storage } from "../db/dbConfig";
import { getDownloadURL, ref, uploadBytes } from "@firebase/storage";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { theme } from "./ManageAccounts";
import { arrayUnion, doc, getDoc, writeBatch } from "@firebase/firestore";
import { useNavigate, useParams } from "react-router-dom";
import { getImageLink } from "../db/getImgLink";
import { uid } from "uid";
export default function UpdateProduct() {
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [category, setCategory] = useState(null);
  const [formData, setFormData] = useState({
    id: uid(8),
    imageUrl: "",
    name: "",
    category: "",
    stock: "",
    unit: "",
    price: "",
    description: "",
  });
  const navigate = useNavigate();

  const handleAddPhoto = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImageUrl(await getImageLink(file));
    } else {
      setImage(null);
      setImageUrl("");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const postData = async (e) => {
    e.preventDefault();
    try {
      let updatedFormData = formData;
      // Upload image and update form data if an image is selected
      if (image) {
        const file = image;
        const storageRef = ref(storage, `product/images/${file.name}`);
        const snapshot = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);
        updatedFormData = { ...formData, imageUrl: downloadURL };
      }

      // Update the product with the updated form data
      const url = "http://vps.akabom.me/api/product";
      const response = await axios.post(url, updatedFormData);

      if (response.status == 200) {
        toast.success("Product has been updated successfully");

        // Reset state variables to initial values
        setFormData({
          imageUrl: "",
          name: "",
          category: "",
          stock: "",
          unit: "",
          price: "",
          description: "",
        });
        setCategory("");
        setImage(null);
        setImageUrl("");
        navigate("/manageproducts");
      }
    } catch (error) {
      console.log(error.message);
      toast.error("An error occurred. Please try again later.");
    }
  };

  const handleKeep = () => {
    navigate("/manageproducts");
  };
  return (
    <ThemeProvider theme={theme}>
      <>
        <div style={{ paddingLeft: "50px", marginTop: 20 }}>
          <Button
            onClick={() => {
              document.querySelector("#handleAddPhoto").click();
            }}
            variant="contained"
            color="select"
          >
            Change Photo
          </Button>
          <input
            type="file"
            id="handleAddPhoto"
            onChange={handleAddPhoto}
            name="img"
            style={{ display: "none" }}
          />
          <br />
          {imageUrl && (
            <img src={imageUrl} alt="Preview" style={{ maxWidth: "200px" }} />
          )}
          <br />
          <div>
            <FormControl sx={{ width: "80%" }}>
              <label>Product name</label>
              <Input
                id="name"
                name="name"
                variant="standard"
                value={formData.name}
                onChange={handleInputChange}
              />
              <br />
            </FormControl>
          </div>
          <div>
            <FormControl sx={{ width: "80%" }}>
              <label>Product category:</label>
              <Input
                id="category"
                name="category"
                variant="standard"
                value={formData.category}
                onChange={handleInputChange}
              />
              <br />
            </FormControl>
          </div>
          <div>
            <FormControl sx={{ width: "80%" }}>
              <label>Product price</label>
              <Input
                id="price"
                name="price"
                variant="standard"
                value={formData.price}
                onChange={handleInputChange}
              />
              <br />
            </FormControl>
          </div>
          <div>
            <FormControl sx={{ width: "80%" }}>
              <label>Product unit:</label>
              <Input
                id="unit"
                name="unit"
                variant="standard"
                value={formData.unit}
                onChange={handleInputChange}
              />
              <br />
            </FormControl>
          </div>
          <div>
            <FormControl sx={{ width: "80%" }}>
              <label>Product stock</label>
              <Input
                id="stock"
                name="stock"
                variant="standard"
                value={formData.stock}
                onChange={handleInputChange}
              />
              <br />
            </FormControl>
          </div>
          <div>
            <FormControl sx={{ width: "80%" }}>
              <label>Product description</label>
              <Input
                id="description"
                name="description"
                variant="standard"
                value={formData.description}
                onChange={handleInputChange}
              />
              <br />
            </FormControl>
          </div>
          <div style={{ height: 200 }}>
            <Button
              onClick={postData}
              variant="contained"
              color="add"
              style={{ marginRight: 20 }}
            >
              Add product
            </Button>
            <Button onClick={handleKeep} variant="contained" color="select">
              Cancel
            </Button>
          </div>
        </div>
        <ToastContainer />
      </>
    </ThemeProvider>
  );
}
