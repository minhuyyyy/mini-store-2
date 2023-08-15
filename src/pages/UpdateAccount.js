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
import { toast } from "react-toastify";
import { theme } from "./ManageAccounts";
import env from "react-dotenv";
import axios from "axios";
import { Visibility, VisibilityOff } from "@mui/icons-material";
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

  const handleRoleChange = (e) => {
    setRole(e.target.value);
  };

  const handleStatusChange = (e) => {
    const value = e.target.value === "true"; // Convert the string value back to boolean
    setIsActive(value);
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
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
    axios.get(`http://vps.akabom.me/api/account/${id}`).then((response) => {
      setFormData(response.data);
      setImageUrl(response.data.imgUrl);
      setRole(response.data.roleName);
      setIsActive(response.data.isActive);
      setPassword(response.data.password);
      return response.data;
    });
  };

  const handleUpdate = async () => {
    try {
      axios
        .put(`http://vps.akabom.me/api/account/${id}`, {
          id: id,
          email: formData.email,
          fullName: formData.fullName,
          password: password,
          imgUrl: imageUrl,
          roleName: formData.role,
          isActive: formData.isActive,
        })
        .then((response) => {
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
          } else {
            console.log();
          }
        });
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
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
              value={role}
              label="Role"
              onChange={handleRoleChange}
            >
              <MenuItem value="Sales">Sales</MenuItem>
              <MenuItem value="Guard">Guard</MenuItem>
              <MenuItem value="Manager">Manager</MenuItem>
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
              value={isActive ? true : false}
              onChange={(e) => handleStatusChange(e)}
            >
              {isActive != null && (
                <>
                  <FormControlLabel
                    value={true}
                    control={<Radio />}
                    label="Yes"
                  />
                  <FormControlLabel
                    value={false}
                    control={<Radio />}
                    label="No"
                  />
                </>
              )}
            </RadioGroup>
          </FormControl>
        </div>
        <div style={{ height: 200 }}>
          <Button variant="contained" onClick={handleUpdate}>
            Update Account
          </Button>
        </div>
      </div>
    </ThemeProvider>
  );
}
