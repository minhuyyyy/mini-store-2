import React, { useContext, useEffect, useState } from "react";
import { Box, Button, Card, TextField, Typography } from "@mui/material";
import "../App.css";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router";
import { AuthContext } from "../context/AuthContext";
import setItem from "../hooks/useSessionStorage";
import useSessionStorage from "../hooks/useSessionStorage";
import axios from "axios";
import { toast } from "react-toastify";
export default function LoginPage() {
  const { user, setUser } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { setItem } = useSessionStorage();
  const onLogin = (e) => {
    e.preventDefault();
    try {
      fetch("http://vps.akabom.me/api/account/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "*/*",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error("Login failed");
          }
        })
        .then((data) => {
          setItem("user", data);
          setUser(data);
          navigate("/");
          toast.success("Logged in successfully");
        })
        .catch((error) => {
          console.log("Error:", error);
          if (error.message === "Login failed") {
            alert("Invalid email or password");
          } else {
            alert("An error occurred during login.");
          }
        });
    } catch (error) {
      console.log("Error:", error);
      alert("An error occurred during login.");
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="90vh"
    >
      <Card style={{ width: "50%" }}>
        <Box p={3}>
          <Typography variant="h4" align="center" gutterBottom>
            LOGIN PAGE
          </Typography>
          <form>
            <TextField
              fullWidth
              label="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
              variant="outlined"
              inputProps={{
                style: { paddingLeft: "10px", borderBottom: "none" },
              }}
            />
            <TextField
              fullWidth
              label=" Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              variant="outlined"
              type="password"
              inputProps={{
                style: { paddingLeft: "10px", borderBottom: "none" },
              }}
            />
            <Button
              variant="contained"
              color="primary"
              fullWidth
              type="submit"
              style={{ marginTop: 20 }}
              onClick={onLogin}
            >
              LOGIN
            </Button>
          </form>
        </Box>
      </Card>
    </Box>
  );
}
