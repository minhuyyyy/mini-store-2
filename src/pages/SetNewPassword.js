import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  FormControl,
  Input,
  Button,
  InputAdornment,
  IconButton,
} from "@mui/material";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  writeBatch,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import env from "react-dotenv";
export default function SetNewPassword() {
  const [input, setInput] = useState({
    password: "",
    confirmPassword: "",
    showPassword: false,
  });
  const [uid, setUid] = useState("");
  const [docID, setDocID] = useState("");
  const [error, setError] = useState({
    password: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(sessionStorage.getItem("user"))
  );

  useEffect(() => {
    setUid(currentUser.ID);
  }, [currentUser]);

  useEffect(() => {
    getData();
  }, [uid]);

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

  const getData = async () => {};

  const handleUpdate = async () => {};

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
