import React, { useState, useEffect } from "react";
import {
  Input,
  Button,
  FormControl,
  Select,
  MenuItem,
  ThemeProvider,
} from "@mui/material";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { theme } from "./ManageAccounts";
import axios from "axios";
import { uid } from "uid";

export default function AddAccount() {
  const [image, setImage] = useState(null);
  const [role, setRole] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [added, setAdded] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    return () => {
      if (image) {
        URL.revokeObjectURL(image.preview);
      }
    };
  }, [image]);

  const [formData, setFormData] = useState({
    img: "",
    email: "",
    name: "",
    password: "",
    role: "",
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const postData = async () => {
    try {
      let baseSalary = 0; // Initialize base salary to 0

      // Determine base salary based on the selected role
      if (role === "Saler") {
        baseSalary = 30000; // Set base salary for Sales role
      } else if (role === "Guard") {
        baseSalary = 25000; // Set base salary for Guard role
      } else if (role === "Manager") {
        baseSalary = 45000; // Set base salary for Manager role
      }

      const response = await axios({
        method: "post",
        url: "http://vps.akabom.me/api/Employee/register",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        data: {
          id: uid(8),
          email: formData.email,
          fullName: formData.name,
          password: formData.password,
          imgUrl: imageUrl,
          roleName: role,
          baseSalary: baseSalary, // Include the calculated base salary
        },
      });

      if (response.status === 200) {
        setFormData({
          img: "",
          email: "",
          name: "",
          password: "",
          role: "",
        });
        setImage(null);
        setImageUrl("");
        setAdded(true);
        toast.success("User added successfully");
        navigate("/manageaccounts");
      } else {
        console.log("Response not successful:", response);
      }
    } catch (error) {
      console.log("Error adding data to database:", error);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <div style={{ paddingLeft: "50px" }}>
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
              value={formData.email}
              onChange={handleInputChange}
            />
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
              value={formData.name}
              onChange={handleInputChange}
            />
            <br />
          </FormControl>
        </div>
        <div>
          <FormControl sx={{ width: "80%" }}>
            <label>Password</label>
            <Input
              id="password"
              name="password"
              variant="standard"
              value={formData.password}
              onChange={handleInputChange}
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
              value={role}
              label="Role"
              onChange={handleChange}
            >
              <MenuItem value="Saler">Sales</MenuItem>
              <MenuItem value={"Guard"}>Guard</MenuItem>
              <MenuItem value={"Manager"}>Manager</MenuItem>
            </Select>
            {role && <p>You selected {role}</p>}

            <br />
          </FormControl>
        </div>
        <br />
        <div style={{ height: 200 }}>
          <Button onClick={postData} variant="contained" color="add">
            Add Account
          </Button>
        </div>
      </div>
    </ThemeProvider>
  );
}
