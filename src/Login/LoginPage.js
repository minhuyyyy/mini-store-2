import React, { useContext, useEffect, useState } from "react";
import { Box, Button, Card, TextField, Typography } from "@mui/material";
import "../App.css";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../db/dbConfig";
import { useNavigate } from "react-router";
import { AuthContext } from "../context/AuthContext";
import setItem from "../hooks/useSessionStorage";
import useSessionStorage from "../hooks/useSessionStorage";
export default function LoginPage() {
  const { user, setUser } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { setItem } = useSessionStorage();
  const onLogin = async (e) => {
    e.preventDefault();
    try {
      const q = query(
        collection(
          db,
          "/users/DXgXU4IJtORzkw2E6jTp/specifications/7OM6ChlDeqoZaBMWFXTH/specimens"
        ),
        where("email", "==", email),
        where("password", "==", password),
        where("isActive", "==", true)
      );
      const snapshot = await getDocs(q);
      const data = snapshot.docs.find(
        (doc) => doc.data().password === password
      );
      if (data) {
        console.log(data.id, "=>", data.data());
        const userData = data.data();
        setItem("user", userData);
        setUser(userData);
        console.log();
        // toast.success("Logged in successfully");
        navigate("/");
      } else if (!data) {
        alert("Invalid email or password");
      }
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log("error", errorCode, errorMessage);
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
