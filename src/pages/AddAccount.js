import React, { useState, useEffect } from "react";
import {
  Input,
  Button,
  FormControl,
  Select,
  MenuItem,
  ThemeProvider,
} from "@mui/material";
import { getImageLink } from "../db/getImgLink";
import { addUser } from "../db/service";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { theme } from "./ManageAccounts";

export default function AddAccount() {
  const [image, setImage] = useState(null);
  const [role, setRole] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [added, setAdded] = useState(false);
  const [downloadURL, setDownloadURL] = useState("");
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
    isActive: "",
  });

  const handleChange = (e) => {
    setRole(e.target.value);
  };

  const handleAddPhoto = async (e) => {
    try {
      const file = e.target.files[0];
      setImage(file);
      setImageUrl(URL.createObjectURL(file));
      setDownloadURL(await getImageLink(file));
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
      await addUser(downloadURL, role, formData.password, formData.email);
      console.log("URL", downloadURL);
      setFormData({
        img: "",
        email: "",
        name: "",
        password: "",
        role: "",
        isActive: "",
      });
      setImage(null);
      setImageUrl("");
      setAdded(true);
      toast.success("User added successfully");
      navigate("/manageaccounts");
    } catch (error) {
      console.log("Error adding data to database:", error);
      console.error("Error adding data to database");
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
            variant='contained' color='select'
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
              <MenuItem value="Sales">Sales</MenuItem>
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
