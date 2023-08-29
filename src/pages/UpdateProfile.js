import React, { useState, useEffect, useContext } from "react";
import {
  Input,
  Button,
  FormControl,
  ThemeProvider,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { theme } from "./ManageAccounts";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useFormik } from "formik";
import * as Yup from "yup";
export default function UpdateProfile() {
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [password, setPassword] = useState("");
  const [input, setInput] = useState({
    password: "",
    showPassword: false,
  });
  const formik = useFormik({
    initialValues: {
      email: "",
      fullName: "",
    },
    validationSchema: Yup.object({
      fullName: Yup.string()
        .min(1, "Must be more than 1 character")
        .max(20, "Must be 20 characters or less")
        .required("Required"),
      email: Yup.string().email("Invalid email address").required("Required"),
    }),
    onSubmit: (values) => {
      handleUpdate(values);
    },
  });
  const [formData, setFormData] = useState({
    img: "",
    fullName: "",
    email: "",
    position: "",
    password: "",
    isActive: "",
  });
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    getData();
  }, [user]);

  useEffect(() => {
    return () => {
      if (image) {
        URL.revokeObjectURL(image.preview);
      }
    };
  }, [image]);

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

  const getData = async () => {
    try {
      const response = await axios.get(`${API_URL}/Employee/${user.id}`);
      if (response.status == 200) {
        formik.setFieldValue("email", response.data.email);
        formik.setFieldValue("fullName", response.data.fullName);
        setFormData(response.data);
        setImageUrl(response.data.imgUrl);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleUpdate = async (values) => {
    try {
      const response = axios.put(`${API_URL}/Employee/${user.id}`, {
        id: user.id,
        email: formik.values.email,
        fullName: formik.values.fullName,
        password: formData.password,
        imgUrl: imageUrl,
        roleName: formData.position,
        isActive: formData.isActive,
      });
      if ((await response).status == 200) {
        toast.success("Profile updated");
        navigate("/");
      } else toast.error("Something went wrong");
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <div style={{ paddingLeft: "50px" }}>
        {user && (
          <>
            <div>
              <Button
                style={{
                  marginTop: 40,
                }}
                variant="contained"
                color="select"
                onClick={() => {
                  document.querySelector("#handleAddPhoto").click();
                }}
              >
                Change Photo
              </Button>
            </div>
            <input
              type="file"
              id="handleAddPhoto"
              onChange={(e) => handleAddPhoto(e)}
              name="img"
              style={{ display: "none" }}
            />
            <br />
            {imageUrl && (
              <img
                src={imageUrl}
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
                <label>Email</label>
                <Input
                  id="email"
                  name="email"
                  variant="standard"
                  value={formik.values.email}
                  disableUnderline={true}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.email && formik.errors.email ? (
                  <p>{formik.errors.email}</p>
                ) : null}
                <br />
              </FormControl>
            </div>
            <div>
              <FormControl sx={{ width: "80%" }}>
                <label>Name</label>
                <Input
                  id="fullName"
                  disableUnderline={true}
                  name="fullName"
                  variant="standard"
                  value={formik.values.fullName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.fullName && formik.errors.fullName ? (
                  <p>{formik.errors.fullName}</p>
                ) : null}
                <br />
              </FormControl>
            </div>
            <div style={{ height: 200 }}>
              <Button variant="contained" onClick={handleUpdate} color="update">
                Update Account
              </Button>
            </div>
          </>
        )}
      </div>
    </ThemeProvider>
  );
}
