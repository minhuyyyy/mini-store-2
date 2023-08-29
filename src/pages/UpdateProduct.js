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
import { useFormik } from "formik";
import * as Yup from "yup";
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
  const formik = useFormik({
    initialValues: {
      img: "",
      name: "",
      category: "",
      stock: 0,
      unit: "",
      price: 0,
      description: "",
    },
    validationSchema: Yup.object({
      img: Yup.string().required("Required"),
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
        .max(500, "Must be less than 500 items")
        .required("Required")
        .integer("Stock must be a whole number")
        .positive("Stock must be a positive number"),
      unit: Yup.string()
        .min(2, "Must be more than 3 characters")
        .max(15, "Must be 15 characters or less")
        .required("Required"),
      price: Yup.number()
        .min(500, "Must be more than 500 VND")
        .required("Required")
        .positive("Price must be a positive number"),
      description: Yup.string().max(100, "Must be 100 characters or less"),
    }),
    onSubmit: (values) => {
      postData(values);
    },
  });
  useEffect(() => {
    fetchProduct();
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
        const sortedCategories = sortCategories((await response).data);
        setCategories(sortedCategories);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchProduct = () => {
    try {
      fetch(`${API_URL}/product/${id}`)
        .then((response) => response.json())
        .then((data) => {
          formik.setFieldValue("img", data.imageUrl);
          formik.setFieldValue("name", data.name);
          formik.setFieldValue("category", data.category);
          formik.setFieldValue("stock", data.stock);
          formik.setFieldValue("unit", data.unit);
          formik.setFieldValue("price", data.price);
          formik.setFieldValue("description", data.description);
          if (data.category === "add_new_category") {
            setShowNewCategoryInput(true);
          }
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
        formik.setFieldValue("img", reader.result);
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
      let imgUrl = formik.values.img; // Use the current image URL as default

      let updatedFormData = {
        ...formik.values,
        id: id,
        imageUrl: imgUrl,
      };
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
        toast.success("Product updated");
        formik.resetForm();
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

  return (
    <ThemeProvider theme={theme}>
      <>
        <form
          onSubmit={formik.handleSubmit}
          style={{ paddingLeft: "50px", marginTop: 20 }}
        >
          <div>
            <Button
              style={{
                marginTop: 40,
              }}
              onClick={() => {
                document.querySelector("#handleAddPhoto").click();
              }}
              variant="contained"
              color="select"
            >
              Select Photo
            </Button>
          </div>
          <input
            type="file"
            accept=".jpg,.jpeg,.png"
            id="handleAddPhoto"
            onChange={handleAddPhoto}
            onBlur={formik.handleBlur}
            name="img"
            style={{ display: "none" }}
          />
          {formik.touched.img && formik.errors.img ? (
            <p>{formik.errors.img}</p>
          ) : null}
          <br />
          {formik.values.img && (
            <img
              src={formik.values.img}
              alt="Preview"
              style={{
                maxWidth: "200px",
                maxHeight: "250px",
                marginBottom: "30px",
              }}
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
                  formik.setFieldValue("category", e.target.value);
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
                onChange={formik.handleChange}
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
                onChange={formik.handleChange}
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
              Update product
            </Button>
          </div>
        </form>
        <ToastContainer />
      </>
    </ThemeProvider>
  );
}
