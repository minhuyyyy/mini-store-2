import React, { useState, useEffect, useContext } from "react";
import { Input, Button, FormControl, ThemeProvider } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { theme } from "./ManageAccounts";
import env from "react-dotenv";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
export default function UpdateProfile() {
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [downloadURL, setDownloadURL] = useState("");
  const [uid, setUid] = useState("");
  const [formData, setFormData] = useState({
    img: "",
    fullName: "",
    email: "",
    role: "",
    password: "",
    isActive: "",
  });
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useContext(AuthContext);
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const getData = async () => {
    try {
      const response = await axios.get(
        `http://vps.akabom.me/api/account/${user.id}`
      );
      if (response.status == 200) {
        setFormData(response.data);
        setImageUrl(response.data.imgUrl);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleUpdate = async () => {
    try {
      axios.put(`http://vps.akabom.me/api/account/${user.id}`, {
        id: user.id,
        email: formData.email,
        fullName: formData.fullName,
        password: formData.password,
        imgUrl: imageUrl,
        roleName: formData.role,
        isActive: formData.isActive,
      });
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
                  value={formData.fullName}
                  onChange={handleInputChange}
                />
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
