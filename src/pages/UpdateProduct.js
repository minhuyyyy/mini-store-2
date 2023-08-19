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
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { theme } from "./ManageAccounts";
import {
  doc,
  getDoc,
  writeBatch,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { useNavigate, useParams } from "react-router-dom";

export default function UpdateProduct() {
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [product, setProduct] = useState([]);
  const [category, setCategory] = useState(null);
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
  const [showNewUnitInput, setShowNewUnitInput] = useState(false);
  const [unit, setUnit] = useState(null);
  const [units, setUnits] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [newUnit, setNewUnit] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    fetchProduct();
    fetchCategories();
    fetchUnits();
  }, []);

  const fetchCategories = async () => {};

  const fetchUnits = async () => {};

  const fetchProduct = () => {
    try {
      fetch(`http://vps.akabom.me/api/product/${id}`)
        .then((response) => response.json())
        .then((data) => {
          setFormData(data);
          setImageUrl(data.imageUrl);
          setCategory(data.category);
          setUnit(data.unit);
        });
    } catch (e) {
      console.log(e);
    }
  };

  const handleUnitChange = (event) => {
    const value = event.target.value;
    if (value === "add_new_unit") {
      setUnit("");
      setShowNewUnitInput(true);
    } else {
      setUnit(value);
      setShowNewUnitInput(false);
    }
  };

  const handleAddPhoto = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImageUrl(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImage(null);
      setImageUrl("");
    }
  };

  const handleChange = (event) => {
    const value = event.target.value;
    if (value === "add_new_category") {
      setCategory("");
      setShowNewCategoryInput(true);
    } else {
      setCategory(value);
      setShowNewCategoryInput(false);
    }
  };

  const [formData, setFormData] = useState({
    img: "",
    name: "",
    category: "",
    stock: "",
    unit: "",
    price: "",
    description: "",
  });

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
      axios
        .put(`http://vps.akabom.me/api/product/${id}`, {
          id: id,
          name: formData.name,
          description: formData.description,
          price: formData.price,
          imageUrl: imageUrl,
          unit: formData.unit,
          category: formData.category,
          stock: formData.stock,
        })
        .then((response) => {
          if (response.status == 200) {
            setFormData({
              img: "",
              name: "",
              category: "",
              stock: "",
              unit: "",
              price: "",
              info: "",
            });
            toast.success("Account updated");
            navigate("/manageproducts");
          } else {
            console.log();
          }
        });
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  const handleKeep = () => {
    navigate("/manageproducts");
  };

  return (
    <ThemeProvider theme={theme}>
      <>
        <div style={{ paddingLeft: "50px", marginTop: 20 }}>
          {product && (
            <>
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
                <img
                  src={imageUrl}
                  alt="Preview"
                  style={{ maxWidth: "200px" }}
                />
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
                  <label>Product category</label>
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
                  <label>Product unit</label>
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
                  <label>Product description:</label>
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
                  Update product
                </Button>
                <Button onClick={handleKeep} variant="contained" color="select">
                  Keep product
                </Button>
              </div>
            </>
          )}
        </div>
        <ToastContainer />
      </>
    </ThemeProvider>
  );
}
