import React, { useEffect, useState } from "react";
import {
  FormControl,
  Input,
  Button,
  ThemeProvider,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { theme } from "./ManageAccounts";
import { useNavigate, useParams } from "react-router-dom";
import { uid } from "uid";

export default function AddProduct() {
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState(null);
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const API_URL = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();
  const [price, setPrice] = useState(null);
  const [stock, setStock] = useState(null);
  const [priceError, setPriceError] = useState(null);
  const [stockError, setStockError] = useState(null);
  const [formData, setFormData] = useState({
    id: uid(8),
    imageUrl: "",
    name: "",
    category: "",
    stock: stock,
    unit: "",
    price: price,
    description: "",
  });
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = axios.get(`${API_URL}/category`);
      if ((await response).status === 200) {
        setCategories((await response).data);
        return setCategories(
          categories.sort((a, b) => a.name.localeCompare(b.name))
        );
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
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

  const handlePriceChange = (e) => {
    if (price <= 1000 || typeof price != "number") {
      setPriceError("Price must be more than 1.000 VND and not containing operators!");
    } else {
      setPriceError(null);
    }
    setPrice(e.target.value);
  };

  const handleStockChange = (e) => {
    if (stock < 0) {
      setStockError("Stock must be more than 0");
    } else {
      setStockError(null);
    }
    setStock(e.target.value);
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
      const selectedCategory = newCategory || category;

      if (image) {
        const downloadURL = imageUrl;
        updatedFormData = { ...formData, imageUrl: downloadURL };
      }

      if (selectedCategory) {
        updatedFormData = {
          ...updatedFormData,
          category: selectedCategory,
        };
      }

      const url = `${API_URL}/product`;
      const response = await axios.post(url, updatedFormData);

      if (response.status === 200) {
        toast.success("Product has been added successfully");
        setFormData({
          imageUrl: "",
          name: "",
          category: "",
          stock: "",
          unit: "",
          price: "",
          description: "",
        });
        setImage(null);
        setImageUrl("");
        navigate("/manageproducts");
      }
    } catch (error) {
      console.log(error.message);
      toast.error("An error occurred. Please try again later.");
    }
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
            accept=".jpg,.jpeg,.png"
            id="handleAddPhoto"
            onChange={(e) => handleAddPhoto(e)}
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
                disableUnderline={true}
                onChange={handleInputChange}
              />
              <br />
            </FormControl>
          </div>
          <div>
            <FormControl sx={{ width: "80%" }}>
              <label>Category</label>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select selectCate"
                value={category}
                label="Category"
                onChange={handleChange}
              >
                {categories.map((cat) => (
                  <MenuItem key={cat.id} value={cat.name}>
                    {cat.name}
                  </MenuItem>
                ))}
                <MenuItem value="add_new_category">Add new category</MenuItem>
              </Select>
              {showNewCategoryInput && (
                <div>
                  <FormControl sx={{ width: "80%" }}>
                    <label>Product category:</label>
                    <Input
                      id="category"
                      name="category"
                      variant="standard"
                      value={newCategory}
                      onChange={(e) => {
                        setNewCategory(e.target.value);
                      }}
                    />
                    <br />
                  </FormControl>
                </div>
              )}
              {category && <p>You selected {category}</p>}
              <br />
            </FormControl>
            <br />
          </div>
          <div>
            <FormControl sx={{ width: "80%" }}>
              <label>Product price</label>
              <Input
                id="price"
                name="price"
                variant="standard"
                type="number"
                disableUnderline={true}
                value={price}
                onChange={handlePriceChange}
              />
              <br />
              {priceError && <p className="error">{priceError}</p>}
            </FormControl>
          </div>
          <div>
            <FormControl sx={{ width: "80%" }}>
              <label>Product stock</label>
              <Input
                id="stock"
                name="stock"
                variant="standard"
                disableUnderline={true}
                value={stock}
                onChange={handleStockChange}
              />
              <br />
              {stockError && <p className="error">{stockError}</p>}
            </FormControl>
          </div>
          <div>
            <FormControl sx={{ width: "80%" }}>
              <label>Product unit:</label>
              <Input
                id="unit"
                name="unit"
                variant="standard"
                disableUnderline={true}
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
                disableUnderline={true}
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
          </div>
        </div>
        <ToastContainer />
      </>
    </ThemeProvider>
  );
}
