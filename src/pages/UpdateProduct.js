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
import { db, storage } from "../db/dbConfig";
import { getDownloadURL, ref, uploadBytes } from "@firebase/storage";
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
import env from "react-dotenv";

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

  const fetchCategories = async () => {
    try {
      const categoriesRef = doc(
        db,
        "users",
        "DXgXU4IJtORzkw2E6jTp",
        "specifications",
        "7OM6ChlDeqoZaBMWFXTH",
        "specimens",
        "LeqwbEgBvTjm0RgW84YV"
      );
      const docSnap = await getDoc(categoriesRef);
      if (docSnap.exists()) {
        const categoryData = docSnap.data().categories || [];
        setCategories(categoryData);
      }
    } catch (error) {
      console.log("Error fetching categories:", error);
    }
  };

  const fetchUnits = async () => {
    try {
      const unitsRef = doc(
        db,
        "users",
        "DXgXU4IJtORzkw2E6jTp",
        "specifications",
        "7OM6ChlDeqoZaBMWFXTH",
        "specimens",
        "LeqwbEgBvTjm0RgW84YV"
      );
      const docSnap = await getDoc(unitsRef);
      if (docSnap.exists()) {
        const unitsData = docSnap.data().units || [];
        setUnits(unitsData);
      }
    } catch (error) {
      console.log("Error fetching units:", error);
    }
  };

  const fetchProduct = () => {
    try {
      fetch(`${env.REACT_APP_PRODUCT_DB_URL}/${id}`)
        .then((response) => response.json())
        .then((data) => {
          setFormData(data);
          setImageUrl(data.img);
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

  const handleAddPhoto = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImageUrl(URL.createObjectURL(file));
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
    info: "",
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
      let updatedFormData = formData;

      // Upload image and update form data if an image is selected
      if (image) {
        const file = image;
        const storageRef = ref(storage, `product/images/${file.name}`);
        const snapshot = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);
        updatedFormData = { ...formData, img: downloadURL };
      }

      // Determine the selected category and units
      const selectedCategory = newCategory || category;
      const selectedUnit = newUnit || unit;
      if (selectedCategory || selectedUnit) {
        updatedFormData = {
          ...updatedFormData,
          category: selectedCategory,
          unit: selectedUnit,
        };
      }

      const url = `${env.REACT_APP_PRODUCT_DB_URL}/${id}`;
      const response = await axios.put(url, updatedFormData);

      if (response) {
        const categoriesRef = doc(
          db,
          "users",
          "DXgXU4IJtORzkw2E6jTp",
          "specifications",
          "7OM6ChlDeqoZaBMWFXTH",
          "specimens",
          "LeqwbEgBvTjm0RgW84YV"
        );

        // Update categories and units arrays using writeBatch
        const batch = writeBatch(db);
        if (selectedCategory) {
          batch.update(categoriesRef, {
            categories: arrayUnion(selectedCategory),
          });
        }
        if (selectedUnit) {
          batch.update(categoriesRef, {
            units: arrayUnion(selectedUnit),
          });
        }
        await batch.commit();

        toast.success("Product has been updated successfully");

        // Reset state variables to initial values
        setFormData({
          img: "",
          name: "",
          category: "",
          info: "",
          price: "",
          unit: "",
          stock: "",
        });
        setCategory("");
        setImage(null);
        setImageUrl("");
        setNewCategory("");
        setNewUnit("");
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
                  <label>Category</label>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select selectCate"
                    value={category}
                    label="Category"
                    onChange={handleChange}
                  >
                    {categories.map((cat) => (
                      <MenuItem key={cat} value={cat}>
                        {cat}
                        {cat && (
                          <IconButton
                            sx={{}}
                            onClick={() => {
                              setCategories(
                                categories.filter((c) => c !== cat)
                              );
                              if (category === cat) {
                                setCategory("");
                              }
                            }}
                          >
                            <Icon>close</Icon>
                          </IconButton>
                        )}
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
                          variant="standard"
                          value={newCategory} // Use newCategory state to capture the inputted category
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
                <FormControl sx={{ width: "10%" }}>
                  <label>Units</label>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select selectCate"
                    value={unit}
                    label="Unit"
                    onChange={handleUnitChange}
                  >
                    {units.map((unitOptions) => (
                      <MenuItem key={unitOptions} value={unitOptions}>
                        {unitOptions}
                        {unitOptions && (
                          <IconButton
                            sx={{}}
                            onClick={() => {
                              setUnits(units.filter((u) => u !== unitOptions));
                              if (unit === unitOptions) {
                                setUnit("");
                              }
                            }}
                          >
                            <Icon>close</Icon>
                          </IconButton>
                        )}
                      </MenuItem>
                    ))}
                    <MenuItem value="add_new_unit">Add new unit</MenuItem>
                  </Select>
                  {showNewUnitInput && (
                    <div>
                      <FormControl sx={{ width: "80%" }}>
                        <label>Product units:</label>
                        <Input
                          id="units"
                          name="units"
                          variant="standard"
                          value={newUnit}
                          onChange={(e) => {
                            setNewUnit(e.target.value);
                          }}
                        />
                        <br />
                      </FormControl>
                    </div>
                  )}
                  <br />
                </FormControl>
              </div>
              <div>
                <FormControl sx={{ width: "80%" }}>
                  <label>Product description</label>
                  <Input
                    id="description"
                    name="info"
                    variant="standard"
                    value={formData.info}
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
