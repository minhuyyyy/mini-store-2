import React, { useState, useEffect, useContext } from "react";
import Avatar from "@mui/material/Avatar";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { Button, ThemeProvider } from "@mui/material";
import { Link } from "react-router-dom";
import { theme } from "./ManageAccounts";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
export default function ViewProfile() {
  const [profile, setProfile] = useState([]);
  const [loggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(sessionStorage.getItem("user"))
  );
  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    if (currentUser) {
      const getData = async () => {
        const res = await axios.get(`${API_URL}/employee/${currentUser.id}`);
        if (res.status === 200) {
          setProfile(res.data);
        }
      };
      getData();
      setIsLoggedIn(true);
    } else {
      setProfile(null);
      setIsLoggedIn(false);
    }
  }, [currentUser]);

  return (
    <ThemeProvider theme={theme}>
      <div style={{ padding: "16px" }}>
        {currentUser ? (
          <>
            <Grid container alignItems="center" spacing={2}>
              <Grid item>
                <Avatar
                  style={{ width: "80px", height: "80px", marginRight: "16px" }}
                  src={profile.imgUrl}
                />
              </Grid>
              <Grid item>
                <Typography variant="h5">{profile.email}</Typography>
                <Typography variant="subtitle1">
                  Role: {profile.position}
                </Typography>
                <Link to={"/viewprofile/updateprofile"}>
                  <Button
                    variant="contained"
                    color="update"
                    style={{ marginRight: 20 }}
                  >
                    Edit Profile
                  </Button>
                </Link>
                <Link to={"/changepassword"}>
                  <Button variant="contained" color="add">
                    Change Password
                  </Button>
                </Link>
              </Grid>
            </Grid>
          </>
        ) : (
          <h3>Log in to view page</h3>
        )}
      </div>
    </ThemeProvider>
  );
}
