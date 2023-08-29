import React, { useState, useEffect } from "react";
import {
  Input,
  Button,
  FormControl,
  Select,
  MenuItem,
  ThemeProvider,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { theme } from "./ManageAccounts";
import axios from "axios";
import { uid } from "uid";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useFormik } from "formik";
import * as Yup from "yup";

export default function AddAccount() {
  const [image, setImage] = useState(null);
  const [role, setRole] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [added, setAdded] = useState(false);
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL;
  const [password, setPassword] = useState("");
  const [input, setInput] = useState({
    password: "",
    showPassword: false,
  });

  useEffect(() => {
    return () => {
      if (image) {
        URL.revokeObjectURL(image.preview);
      }
    };
  }, [image]);

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
      password: Yup.string()
        .min(8, "Must be more than 8 characters")
        .required("Required"),
      role: Yup.string().required("Required"),
    }),
    onSubmit: (values) => {
      postData(values);
    },
  });

  const handleChange = (e) => {
    setRole(e.target.value);
  };

  const handleAddPhoto = async (e) => {
    try {
      const file = e.target.files[0];
      if (file) {
        setImage(file);
        const reader = new FileReader();
        reader.onload = () => {
          setImageUrl(reader.result);
        };
        reader.readAsDataURL(file);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const postData = async (values) => {
    let baseSalary = 0;

    if (values.role === "Saler") {
      baseSalary = 30000;
    } else if (values.role === "Guard") {
      baseSalary = 25000;
    } else if (values.role === "Manager") {
      baseSalary = 45000;
    }
    const response = await axios
      .post(`${API_URL}/employee/register`, {
        id: uid(8),
        email: formik.values.email,
        fullName: formik.values.name,
        password: password,
        imgUrl: imageUrl,
        roleName: formik.values.role,
        baseSalary: baseSalary,
      })
      .catch((err) => {
        return err.response;
      });
    if (response.status === 200) {
      toast.success("User added successfully");
      navigate("/manageaccounts");
    } else if (response.status === 400) {
      toast.error(response.data.message || "Order error");
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
          <p className="error">{formik.errors.img}</p>
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
              disableUnderline={true}
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.email && formik.errors.email ? (
              <p className="error">{formik.errors.email}</p>
            ) : null}
            <br />
          </FormControl>
        </div>
        <div>
          <FormControl sx={{ width: "80%" }}>
            <label>Name</label>
            <Input
              id="name"
              disableUnderline={true}
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
          <FormControl>
            <Input
              id="password"
              type={input.showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter Password"
              disableUnderline={true}
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
                handleChange(e);
                formik.setFieldValue("role", e.target.value); // Update the Formik field value
              }}
              onBlur={formik.handleBlur}
              label="Role"
            >
              <MenuItem value="Saler">Sales</MenuItem>
              <MenuItem value={"Guard"}>Guard</MenuItem>
            </Select>
            {formik.values.role && (
              <p className="error">You selected {formik.values.role}</p>
            )}
            <br />
          </FormControl>
        </div>
        <br />
        <div style={{ height: 200 }}>
          <Button onClick={postData} variant="contained" color="add">
            Add Account
          </Button>
        </div>
      </form>
    </ThemeProvider>
  );
}
