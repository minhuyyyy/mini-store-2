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
export default function UpdateProfile() {
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [password, setPassword] = useState("");
  const [input, setInput] = useState({
    password: "",
    showPassword: false,
  });
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
        `http://vps.akabom.me/api/Employee/${user.id}`
      );
      if (response.status == 200) {
        setFormData(response.data);
        setPassword(response.data.password);
        setImageUrl(response.data.imgUrl);
      }
    } catch (e) {
      console.log(e);
    }
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

  const handleUpdate = async () => {
    try {
      const response = axios.put(
        `http://vps.akabom.me/api/Employee/${user.id}`,
        {
          id: user.id,
          email: formData.email,
          fullName: formData.fullName,
          password: password,
          imgUrl: imageUrl,
          roleName: formData.role,
          isActive: formData.isActive,
        }
      );
      if ((await response).status == 200) {
        toast.success("Profile updated");
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
            <div>
              <FormControl>
                <Input
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
                        {input.showPassword ? (
                          <Visibility />
                        ) : (
                          <VisibilityOff />
                        )}
                      </IconButton>
                      <Button onClick={makeid}>Generate new password</Button>
                    </InputAdornment>
                  }
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
