import React, { useState } from "react";
import {
  Input,
  Button,
  FormControl,
  Select,
  MenuItem,
  FormControlLabel,
  FormLabel,
  RadioGroup,
  Radio,
  ThemeProvider,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { theme } from "./ManageAccounts";
import axios from "axios";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";

export default function UpdateAccount() {
  const [image, setImage] = useState(null);
  const [role, setRole] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [downloadURL, setDownloadURL] = useState("");
  const [isActive, setIsActive] = useState("");
  const [password, setPassword] = useState("");
  const [input, setInput] = useState({
    password: "",
    showPassword: false,
  });
  const navigate = useNavigate();
  const { id } = useParams();
  const API_URL = process.env.REACT_APP_API_URL;
  const [error, setError] = useState(null);
  const [email, setEmail] = useState("");
  useEffect(() => {
    return () => {
      if (image) {
        URL.revokeObjectURL(image.preview);
      }
    };
  }, [image]);

  const [formData, setFormData] = useState({
    img: "",
    fullName: "",
    email: "",
    role: "",
    password: "",
    isActive: "",
  });

  useEffect(() => {
    getData();
  }, []);

  const formik = useFormik({
    initialValues: {
      img: "",
      email: "",
      name: "",
      password: "",
      role: "",
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .min(1, "Must be more than 1 character")
        .max(20, "Must be 20 characters or less")
        .required("Required"),
      email: Yup.string().email("Invalid email address").required("Required"),
      img: Yup.string().required("Required"),
      password: Yup.string().min(8, "Must be more than 8 characters"),
      role: Yup.string().required("Required"),
      isActive: Yup.boolean().required("Required"),
    }),
    onSubmit: (values) => {
      handleUpdate(values);
    },
  });

  const handleRoleChange = (e) => {
    setRole(e.target.value);
  };

  const handleStatusChange = (e) => {
    setIsActive(e.target.value === "true");
  };

  function isValidEmail(email) {
    return /\S+@\S+\.\S+/.test(email);
  }

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

  const handleClickShowPassword = () => {
    setInput((prev) => ({
      ...prev,
      showPassword: !prev.showPassword,
    }));
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const onInputChange = (e) => {
    const { name, value } = e.target;
    setInput((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  function makeid() {
    let result = "";
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789~!@#$%^&*()_+-=";
    const charactersLength = 12;
    let counter = 0;
    while (counter <= charactersLength) {
      result += characters.charAt(
        Math.floor(Math.random() * 5 * charactersLength)
      );
      counter += 1;
    }
    setPassword(result);
    return result;
  }

  const getData = async () => {
    axios.get(`${API_URL}/employee/${id}`).then((response) => {
      formik.setFieldValue("imageUrl", response.data.imgUrl);
      formik.setFieldValue("email", response.data.email);
      formik.setFieldValue("name", response.data.fullName);
      formik.setFieldValue("password", response.data.password);
      formik.setFieldValue("role", response.data.position);
      formik.setFieldValue("isAtive", response.data.isActive);
      return response.data;
    });
  };

  const handleUpdate = async (values) => {
    try {
      const response = await axios
        .put(`${API_URL}/employee/${id}`, {
          id: id,
          email: formik.values.email,
          fullName: formik.values.name,
          password: password,
          imgUrl: imageUrl,
          roleName: formik.values.role,
          isActive: isActive,
        })
        .catch((e) => {
          return e.response;
        });
      if (response.status == 200) {
        setFormData({
          img: "",
          email: "",
          fullName: "",
          role: "",
          password: "",
          isActive: "",
        });
        setRole("");
        setIsActive("");
        toast.success("Account updated");
        navigate("/manageaccounts");
      } else if (response.status === 400) {
        toast.error(response.data.message);
      } else {
        toast.error(response.status.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <form onSubmit={formik.handleSubmit} style={{ paddingLeft: "50px" }}>
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
          onChange={(e) => {
            handleAddPhoto(e);
            formik.setFieldValue("img", e.target.value); // Update the Formik field value
          }}
          onBlur={formik.handleBlur}
          value={formik.values.img}
          name="img"
          style={{ display: "none" }}
        />
        {formik.touched.img && formik.errors.img ? (
          <p>{formik.errors.img}</p>
        ) : null}
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
              id="name"
              name="name"
              variant="standard"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.name && formik.errors.name ? (
              <p>{formik.errors.name}</p>
            ) : null}
            <br />
          </FormControl>
        </div>
        <div>
          <FormControl>
            <Input
              id="password"
              type={input.showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter Password"
              value={password}
              onChange={onInputChange}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                  >
                    {input.showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                  <Button onClick={makeid}>Generate new password</Button>
                </InputAdornment>
              }
            />
            {password.length === 0 ? <p>Required</p> : null}
            <br />
          </FormControl>
        </div>
        <div>
          <FormControl sx={{ width: "80%" }}>
            <label>Role</label>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select selectCate"
              value={formik.values.role}
              onChange={(e) => {
                handleRoleChange(e);
                formik.setFieldValue("role", e.target.value); // Update the Formik field value
              }}
              onBlur={formik.handleBlur}
            >
              <MenuItem value="Saler">Sales</MenuItem>
              <MenuItem value="Guard">Guard</MenuItem>
            </Select>
            {role && <p>You selected {role}</p>}
            <br />
          </FormControl>
        </div>
        <br />
        <div>
          <FormControl>
            <FormLabel id="demo-controlled-radio-buttons-group">
              Activate
            </FormLabel>
            <RadioGroup
              aria-labelledby="demo-controlled-radio-buttons-group"
              name="controlled-radio-buttons-group"
              onChange={(e) => {
                handleStatusChange(e);
                formik.setFieldValue("isActive", e.target.value); // Update the Formik field value
              }}
              onBlur={formik.handleBlur}
              value={formik.values.isActive}
              defaultChecked={isActive}
            >
              <FormControlLabel value="true" control={<Radio />} label="Yes" />
              <FormControlLabel value="false" control={<Radio />} label="No" />
            </RadioGroup>
          </FormControl>
          {formik.touched.isActive && formik.errors.isActive ? (
              <p>{formik.errors.isActive}</p>
            ) : null}
        </div>
        <div style={{ height: 200 }}>
          <Button variant="contained" onClick={handleUpdate}>
            Update Account
          </Button>
        </div>
      </form>
    </ThemeProvider>
  );
}
