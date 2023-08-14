import React, { useState, useEffect } from "react";
import Avatar from "@mui/material/Avatar";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { Button, ThemeProvider } from "@mui/material";
import { Link } from "react-router-dom";
import { theme } from "./ManageAccounts";
export default function ViewProfile() {
  const [profile, setProfile] = useState(null);
  const [loggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    if (user != null) {
      setProfile(user);
      setIsLoggedIn(true);
    } else {
      setProfile(null);
      setIsLoggedIn(false);
    }
  }, []);

  useEffect(() => {
    // Update session storage when the user profile changes
    if (profile) {
      sessionStorage.setItem("user", JSON.stringify(profile));
    }
  }, [profile]);

  return (
    <ThemeProvider theme={theme}>
      <div style={{ padding: "16px" }}>
        {profile ? (
          <>
            <Grid container alignItems="center" spacing={2}>
              <Grid item>
                <Avatar
                  style={{ width: "80px", height: "80px", marginRight: "16px" }}
                  src={profile.img}
                />
              </Grid>
              <Grid item>
                <Typography variant="h5">{profile.email}</Typography>
                <Typography variant="subtitle1">
                  Role: {profile.role}
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
