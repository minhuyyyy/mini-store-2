import React, { useEffect, useState } from "react";
import { TextField, Button } from "@mui/material";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../db/dbConfig";
import { useNavigate } from "react-router";

export default function ChangePassword() {
  const [password, setPassword] = useState("");
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(sessionStorage.getItem("user"))
  );
  const [inputPassword, setInputPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setPassword(currentUser.password);
  }, [currentUser]);

  const checkOldPassword = () => {
    if (inputPassword !== password) {
      alert("Incorrect password");
    } else {
      navigate("/changepassword/setnewpassword");
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
          display: "flex",
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
    </div>
  );
}
