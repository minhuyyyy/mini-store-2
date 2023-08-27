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
import { useFormik } from "formik";
import * as Yup from "yup";
export default function AddProduct() {
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState(null);
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const API_URL = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();
  const [price, setPrice] = useState(0);
  const [stock, setStock] = useState(0);
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

  const formik = useFormik({
    initialValues: {
      imageUrl: "",
      name: "",
      category: "",
      stock: 0,
      unit: "",
      price: 0,
      description: "",
    },
    validationSchema: Yup.object({
      imageUrl: Yup.string().required("Required"),
      name: Yup.string()
        .min(1, "Must be more than 1 character")
        .max(20, "Must be 20 characters or less")
        .required("Required"),
      category: Yup.string()
        .min(3, "Must be more than 3 characters")
        .max(15, "Must be 15 characters or less")
        .required("Required"),
      stock: Yup.number()
        .min(1, "Must be more than 1 item")
        .max(100, "Must be less than 100 items")
        .required("Required"),
      unit: Yup.string()
        .min(3, "Must be more than 3 characters")
        .max(15, "Must be 15 characters or less")
        .required("Required"),
      price: Yup.number()
        .min(1000, "Must be more than 1.000 VND")
        .max(1000000, "Must be less than 1.000.000 VND")
        .required("Required"),
      description: Yup.string().max(100, "Must be 100 characters or less"),
    }),
    onSubmit: (values) => {
      postData(values);
    },
  });
  useEffect(() => {
    fetchCategories();
  }, []);

  const sortCategories = (data) => {
    let sortedData;
    sortedData = data.sort(function (a, b) {
      let x = a.name.toLowerCase();
      let y = b.name.toLowerCase();
      if (x > y) {
        return 1;
      }
      if (x < y) {
        return -1;
      }
      return 0;
    });

    return sortedData;
  };

  const fetchCategories = async () => {
    try {
      const response = axios.get(`${API_URL}/category`);
      if ((await response).status === 200) {
        const sortedCategories = sortCategories((await response).data); // Sort the fetched categories
        setCategories(sortedCategories);
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const postData = async () => {
    try {
      const selectedCategory = newCategory || formik.values.category;
      let updatedFormData = {
        ...formik.values,
        id: uid(8),
        imageUrl: imageUrl || formData.imageUrl,
      };

      if (selectedCategory) {
        updatedFormData = {
          ...updatedFormData,
          category: selectedCategory,
        };
      }

      const url = `${API_URL}/product`;
      const response = await axios.post(url, updatedFormData).catch((e) => {
        return e.response;
      });

      if (response.status === 200) {
        toast.success("Product has been added successfully");
        formik.resetForm(); // Reset the form after successful submission
        setImage(null);
        setImageUrl("");
        navigate("/manageproducts");
      } else if (response.status === 400) {
        toast.error(response.data.message);
      } else {
        toast.error(response.status.message);
      }
    } catch (error) {
      console.log(error.message);
      toast.error("An error occurred. Please try again later.");
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <>
        <form
          onSubmit={formik.handleSubmit}
          style={{ paddingLeft: "50px", marginTop: 20 }}
        >
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
            onChange={(e) => {
              handleAddPhoto(e);
              formik.setFieldValue("imageUrl", e.target.value); // Update the Formik field value
            }}
            onBlur={formik.handleBlur}
            value={formik.values.imageUrl}
            name="img"
            style={{ display: "none" }}
          />
          {formik.touched.imageUrl && formik.errors.imageUrl ? (
            <p className="error">{formik.errors.imageUrl}</p>
          ) : null}
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
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.name && formik.errors.name ? (
                <p className="error">{formik.errors.name}</p>
              ) : null}
              <br />
            </FormControl>
          </div>
          <div>
            <FormControl sx={{ width: "80%" }}>
              <label>Category</label>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select selectCate"
                label="Category"
                value={formik.values.category}
                onChange={(e) => {
                  handleChange(e);
                  formik.setFieldValue("category", e.target.value); // Update the Formik field value
                }}
                onBlur={formik.handleBlur}
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
              {formik.values.category && (
                <p className="error">You selected {formik.values.category}</p>
              )}
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
                value={formik.values.price}
                onChange={(e) => {
                  handlePriceChange(e);
                  formik.setFieldValue("price", e.target.value); // Update the Formik field value
                }}
                onBlur={formik.handleBlur}
              />
              {formik.touched.price && formik.errors.price ? (
                <p className="error">{formik.errors.price}</p>
              ) : null}
              <br />
            </FormControl>
          </div>
          <div>
            <FormControl sx={{ width: "80%" }}>
              <label>Product stock</label>
              <Input
                id="stock"
                name="stock"
                type="number"
                variant="standard"
                disableUnderline={true}
                value={formik.values.stock}
                onChange={(e) => {
                  handleStockChange(e);
                  formik.setFieldValue("stock", e.target.value); // Update the Formik field value
                }}
                onBlur={formik.handleBlur}
              />
              {formik.touched.stock && formik.errors.stock ? (
                <p className="error">{formik.errors.stock}</p>
              ) : null}
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
                value={formik.values.unit}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.unit && formik.errors.unit ? (
                <p className="error">{formik.errors.unit}</p>
              ) : null}
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
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.description && formik.errors.description ? (
                <p className="error">{formik.errors.description}</p>
              ) : null}
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
        </form>
        <ToastContainer />
      </>
    </ThemeProvider>
  );
}
