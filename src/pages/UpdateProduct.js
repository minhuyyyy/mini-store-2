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
import { useNavigate, useParams } from "react-router-dom";

export default function UpdateProduct() {
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [product, setProduct] = useState([]);
  const [category, setCategory] = useState(null);
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
  const [unit, setUnit] = useState(null);
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();
  const [price, setPrice] = useState(0);
  const [stock, setStock] = useState(0);
  const [priceError, setPriceError] = useState(null);
  const [stockError, setStockError] = useState(null);
  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    fetchProduct();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = axios.get(`${API_URL}/category`);
      if ((await response).status === 200) setCategories((await response).data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchProduct = () => {
    try {
      fetch(`${API_URL}/product/${id}`)
        .then((response) => response.json())
        .then((data) => {
          setFormData(data);
          setPrice(data.price);
          setStock(data.stock);
          setImageUrl(data.imageUrl);
          setCategory(data.category);
          setUnit(data.unit);
        });
    } catch (e) {
      console.log(e);
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
    stock: stock,
    unit: "",
    price: price,
    description: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const handlePriceChange = (e) => {
    const inputPrice = e.target.value;
    const newPrice = parseFloat(inputPrice.replace(/^0+/, "")); // Remove leading zeros

    if (isNaN(newPrice) || newPrice <= 1000) {
      setPriceError("Price must be more than 1.000 VND and a valid number");
    } else {
      setPriceError(null);
    }

    setPrice(newPrice);
  };

  const handleStockChange = (e) => {
    const inputStock = e.target.value;
    const newStock = parseInt(inputStock.replace(/^0+/, "")); // Remove leading zeros

    if (newStock < 0) {
      setStockError("Stock must be more than 0");
    } else {
      setStockError(null);
    }

    setStock(newStock);
  };

  const postData = async (e) => {
    e.preventDefault();
    try {
      let updatedFormData = formData;
      const selectedCategory = newCategory || category;
      if (selectedCategory) {
        updatedFormData = {
          ...updatedFormData,
          category: selectedCategory,
        };
      }

      const response = await axios.put(
        `${API_URL}/product/${id}`,
        updatedFormData
      );

      if (response.status === 200) {
        setFormData({
          img: "",
          name: "",
          category: "",
          stock: "",
          unit: "",
          price: "",
          info: "",
        });
        toast.success("Product updated");
        navigate(-1);
      } else if (response.status === 400) {
        toast.error(response.data.message);
      } else {
        toast.error(response.statusText); // Use response.statusText
      }
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
                    disableUnderline={true}
                    variant="standard"
                    value={formData.name}
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
                    <MenuItem value="add_new_category">
                      Add new category
                    </MenuItem>
                  </Select>
                  {showNewCategoryInput && (
                    <div>
                      <FormControl sx={{ width: "80%" }}>
                        <label>Product category:</label>
                        <Input
                          id="category"
                          name="category"
                          disableUnderline={true}
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
                    type="number"
                    disableUnderline={true}
                    name="price"
                    variant="standard"
                    value={price}
                    onChange={handlePriceChange}
                  />
                  {priceError && <p className="error">{priceError}</p>}
                  <br />
                </FormControl>
              </div>
              <div>
                <FormControl sx={{ width: "80%" }}>
                  <label>Product stock</label>
                  <Input
                    id="stock"
                    disableUnderline={true}
                    name="stock"
                    variant="standard"
                    type="number"
                    value={stock}
                    onChange={handleStockChange}
                  />
                  {stockError && <p className="error">{stockError}</p>}
                  <br />
                </FormControl>
              </div>
              <div>
                <FormControl sx={{ width: "80%" }}>
                  <label>Product unit</label>
                  <Input
                    id="unit"
                    disableUnderline={true}
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
                    disableUnderline={true}
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
