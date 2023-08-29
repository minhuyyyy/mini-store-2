import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  FormControl,
  Input,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import axios from "axios";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import useAuth from "../hooks/useAuth";
function SetNewPassword() {
  const [input, setInput] = useState({
    password: "",
    confirmPassword: "",
    showPassword: false,
  });
  const [error, setError] = useState({
    password: "",
    confirmPassword: "",
  });
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(sessionStorage.getItem("user"))
  );
  const API_URL = process.env.REACT_APP_API_URL;
  const [profile, setProfile] = useState({
    id: "",
    email: "",
    fullName: "",
    position: "",
    password: "",
    isActive: "",
  });
  const { logout } = useAuth();

  useEffect(() => {
    const getUserData = async () => {
      const res = await axios.get(`${API_URL}/employee/${currentUser.id}`);
      if (res.status === 200) {
        setProfile(res.data);
      }
    };
    getUserData();
  }, [currentUser]);

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
    validateInput(e);
  };

  const validateInput = (e) => {
    let { name, value } = e.target;
    setError((prev) => {
      const stateObj = { ...prev, [name]: "" };

      switch (name) {
        case "password":
          if (!value) {
            stateObj[name] = "Please enter Password.";
          } else if (input.confirmPassword && value !== input.confirmPassword) {
            stateObj["confirmPassword"] =
              "Password and Confirm Password do not match.";
          } else {
            stateObj["confirmPassword"] = input.confirmPassword
              ? ""
              : error.confirmPassword;
          }
          break;

        case "confirmPassword":
          if (!value) {
            stateObj[name] = "Please enter Confirm Password.";
          } else if (input.password && value !== input.password) {
            stateObj[name] = "Password and Confirm Password do not match.";
          }
          break;

        default:
          break;
      }

      return stateObj;
    });
  };

  const handleUpdate = async () => {
    try {
      if (input.password.length >= 8 && input.confirmPassword.length >= 8) {
        try {
          const response = await axios
            .put(`${API_URL}/employee/${currentUser.id}`, {
              id: profile.id,
              email: profile.email,
              fullName: profile.fullName,
              password: input.confirmPassword,
              roleName: profile.position,
              isActive: profile.isActive,
            })
            .catch((e) => {
              return e.response;
            });

          if (response.status === 200) {
            toast.success("Account updated");
            logout();
          } else if (response.status === 400) {
            toast.error(response.data.message);
          } else {
            toast.error(response.status.message);
          }
        } catch (error) {
          console.error(error);
          toast.error("Something went wrong");
        }
      } else {
        toast.error("Passwords must be at least 8 characters long");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <div
      className="app"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "90vh",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h4>Change Password</h4>
        <div>
          <FormControl>
            <Input
              type={input.showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter Password"
              value={input.password}
              onChange={onInputChange}
              onBlur={validateInput}
              disableUnderline={true}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                  >
                    {input.showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              }
            />
            {error.password && <span className="err">{error.password}</span>}
            <br />
          </FormControl>
        </div>
        <div>
          <FormControl>
            <Input
              type="password"
              disableUnderline={true}
              name="confirmPassword"
              placeholder="Enter Confirm Password"
              value={input.confirmPassword}
              onChange={onInputChange}
              onBlur={validateInput}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                  >
                    {input.showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              }
            />
            {error.confirmPassword && (
              <span className="err">{error.confirmPassword}</span>
            )}
            <br />
          </FormControl>
        </div>

        <Button variant="contained" onClick={handleUpdate}>
          Submit
        </Button>
      </div>
    </div>
  );
}

function GetOldPassword() {
  const [password, setPassword] = useState("");
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(sessionStorage.getItem("user"))
  );
  const [inputPassword, setInputPassword] = useState("");
  const [match, isMatch] = useState(false);
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const getPassword = async () => {
      const res = await axios.get(`${API_URL}/employee/${currentUser.id}`);
      if (res.status === 200) {
        setPassword(res.data.password);
      }
    };
    getPassword();
  }, [currentUser]);

  const checkOldPassword = () => {
    if (inputPassword !== password) {
      toast.error("Incorrect password");
    } else {
      isMatch(true);
    }
  };

  const handleInputPasswordChange = (event) => {
    setInputPassword(event.target.value);
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <div
        style={{
          display: match ? "none" : "flex", // Hide the component when match is true
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h3>Change Password</h3>
        <TextField
          id="old-password"
          label="Enter old password"
          type="password"
          variant="outlined"
          margin="normal"
          style={{ width: "400px" }}
          value={inputPassword}
          onChange={handleInputPasswordChange}
        />
        <br />
        <div style={{ height: 200 }}>
          <Button onClick={checkOldPassword} variant="contained">
            Check
          </Button>
        </div>
      </div>
      {match && <SetNewPassword />}{" "}
      {/* Render SetNewPassword component when match is true */}
    </div>
  );
}

export default GetOldPassword;
