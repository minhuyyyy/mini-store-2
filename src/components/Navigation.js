import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Icon } from "react-materialize";
import {
  AppBar,
  Box,
  Button,
  Drawer,
  Tooltip,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  Menu,
  MenuItem,
  Avatar,
  Toolbar,
  Typography,
  Fade,
} from "@mui/material";
import "../App.css";
import { AuthContext } from "../context/AuthContext";
import useAuth from "../hooks/useAuth";
import RegisterWorkShift from "../pages/RegisterWorkShift";
export default function Navigation() {
  const location = useLocation();
  const { logout } = useAuth();
  const { user } = useContext(AuthContext);
  const [activeLink, setActiveLink] = useState(location.pathname);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  useEffect(() => {
    checkUser();
  }, [user]);

  const checkUser = () => {
    let CurrentUser = user ? setCurrentUser(user) : null;
    return CurrentUser;
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const navigate = useNavigate();

  let navLinkStyle = {
    color: "white",
    textDecoration: "none",
    fontFamily: "Arial, sans-serif",
    fontWeight: "bold",
  };

  const activeLinkStyle = {
    color: "white",
    backgroundColor: "black",
  };

  useEffect(() => {
    setActiveLink(location.pathname);
  }, [location]);

  useEffect(() => {
    document.title = window.location.pathname.replace("/", "") || "Mini Store";
  }, []);

  const handleDrawerOpen = () => {
    setOpenDrawer(true);
  };

  const handleDrawerClose = () => {
    setOpenDrawer(false);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <>
      <AppBar
        position="fixed"
        style={{ backgroundColor: "white", color: "white" }}
      >
        <Toolbar
          style={{
            backgroundColor: "black",
            color: "white",
            paddingLeft: 0,
            height: "30px",
          }}
        >
          <Box
            className="hide-on-large-only"
            sx={{ flexGrow: 1, paddingLeft: "20px" }}
          >
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={handleDrawerOpen}
            >
              <Icon
                onMouseOver={(event) => (event.target.style.color = "white")}
                onMouseLeave={(event) => (event.target.style.color = "black")}
              >
                menu
              </Icon>
            </IconButton>
          </Box>
          <Box className="left hide-on-med-and-down" sx={{ flexGrow: 1 }}>
            <Button
              key={"Home"}
              onClick={() => {
                navigate("");
                document.title = "Mini Store";
              }}
              style={
                activeLink === "/"
                  ? { ...navLinkStyle, ...activeLinkStyle }
                  : { ...navLinkStyle }
              }
              sx={{
                color: "white",
                padding: "0px 10px",
                height: "30px",
              }}
            >
              <span>Home</span>
            </Button>
            <Button
              key={"Manage Products"}
              onClick={() => {
                navigate("manageproducts");
                document.title = "Manage Products";
              }}
              style={
                activeLink === "/manageproducts"
                  ? { ...navLinkStyle, ...activeLinkStyle }
                  : { ...navLinkStyle }
              }
              sx={{
                color: "white",
                padding: "0px 10px",
                height: "30px",
              }}
            >
              <span>Manage Products</span>
            </Button>
            <Button
              key={"About Us"}
              onClick={() => {
                navigate("/about");
                document.title = "About Us";
              }}
              style={
                activeLink === "/about"
                  ? { ...navLinkStyle, ...activeLinkStyle }
                  : { ...navLinkStyle }
              }
              sx={{
                color: "white",
                padding: "0px 10px",
                height: "30px",
              }}
            >
              <span>About Us</span>
            </Button>
            <Button
              key={"Check In"}
              onClick={() => {
                navigate("checkattendance");
                document.title = "Check In";
              }}
              style={
                activeLink === "/checkattendance"
                  ? { ...navLinkStyle, ...activeLinkStyle }
                  : { ...navLinkStyle }
              }
              sx={{
                color: "white",
                padding: "0px 10px",
                height: "30px",
              }}
            >
              <span>Check In</span>
            </Button>
            <Button
              key={"Create Order"}
              onClick={() => {
                navigate("createorder");
                document.title = "Create Order";
              }}
              style={
                activeLink === "/createorder"
                  ? { ...navLinkStyle, ...activeLinkStyle }
                  : { ...navLinkStyle }
              }
              sx={{
                color: "white",
                padding: "0px 10px",
                height: "30px",
              }}
            >
              <span>Create Order</span>
            </Button>
          </Box>
          {currentUser ? (
            <>
              <Box sx={{ paddingRight: 2 }}>
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ padding: 0 }}>
                    <Avatar
                      alt={currentUser.email}
                      src={currentUser.photoURL}
                    />
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: "45px" }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  <Link
                    to="/viewprofile"
                    style={{ textDecoration: "none", color: "#D4B887" }}
                  >
                    <MenuItem>User Profile</MenuItem>
                  </Link>
                  {currentUser.position === "Manager" ? (
                    <div>
                      <Link
                        to="/manageaccounts"
                        style={{ textDecoration: "none", color: "#D4B887" }}
                      >
                        <MenuItem>Manage Accounts</MenuItem>
                      </Link>
                      <Link
                        to="/viewsalary"
                        style={{ textDecoration: "none", color: "#D4B887" }}
                      >
                        <MenuItem>View Salary</MenuItem>
                      </Link>
                    </div>
                  ) : (
                    <Link
                      to="/viewsalary"
                      style={{ textDecoration: "none", color: "#D4B887" }}
                    >
                      <MenuItem>View Salary</MenuItem>
                    </Link>
                  )}
                  {currentUser.position !== "Manager" ? (
                    <Link
                      to="/workshift"
                      style={{ textDecoration: "none", color: "#D4B887" }}
                    >
                      <MenuItem>Register Work Shift</MenuItem>
                    </Link>
                  ) : (
                    <></>
                  )}
                </Menu>
              </Box>
              <Button
                style={{
                  width: "10%",
                  borderRadius: "30px",
                  backgroundColor: "black",
                  marginRight: "20px",
                  height: "40px",
                }}
                onClick={logout}
              >
                <span
                  style={{
                    fontFamily: "Arial, sans-serif",
                    fontWeight: "bold",
                    fontSize: "20px",
                    color: "white",
                  }}
                >
                  LOG OUT
                </span>
              </Button>
            </>
          ) : (
            <>
              <Box>
                <Link
                  to="login"
                  onClick={() => (document.title = "Login")}
                  style={{ textDecoration: "none" }}
                >
                  <Button
                    style={{
                      width: "120%",
                      borderRadius: "30px",
                      backgroundColor: "black",
                      marginRight: "20px",
                      height: "40px",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "Arial, sans-serif",
                        fontWeight: "bold",
                        fontSize: "20px",
                        color: "white",
                      }}
                    >
                      LOG IN
                    </span>
                  </Button>
                </Link>
              </Box>
            </>
          )}
        </Toolbar>
      </AppBar>
      <Drawer
        open={openDrawer}
        onClose={handleDrawerClose}
        sx={{ color: "black" }}
      >
        <List sx={{ backgroundColor: "#D4B887", flexGrow: 1 }}>
          <ListItem
            key="Home"
            component={Link}
            to="/"
            onClick={() => {
              document.title = "Mini Store";
              setActiveLink("/");
            }}
            style={
              activeLink === "/"
                ? Object.assign({}, navLinkStyle, activeLinkStyle)
                : navLinkStyle
            }
          >
            <ListItemIcon>
              <Icon
                style={
                  activeLink === "/" ? { color: "#D4B887" } : { color: "black" }
                }
              >
                home
              </Icon>
            </ListItemIcon>
            <Typography
              sx={{
                fontFamily: "Arial, sans-serif",
                fontWeight: "bold",
                fontSize: "10px",
              }}
            >
              Home
            </Typography>
          </ListItem>

          <ListItem
            key="Manage Products"
            component={Link}
            to="manageproducts"
            onClick={() => {
              document.title = "Manage Products";
              setActiveLink("/manageproducts");
            }}
            style={
              activeLink === "/manageproducts"
                ? Object.assign({}, navLinkStyle, activeLinkStyle)
                : navLinkStyle
            }
          >
            <ListItemIcon
              style={
                activeLink === "/manageproducts"
                  ? { color: "#D4B887" }
                  : { color: "black" }
              }
            ></ListItemIcon>
            <Typography
              sx={{
                fontFamily: "Arial, sans-serif",
                fontWeight: "bold",
                fontSize: "10px",
              }}
            >
              Manage Products
            </Typography>
          </ListItem>
          <ListItem
            key="Check Attendance"
            component={Link}
            to="checkattendance"
            onClick={() => {
              document.title = "Check Attendance";
              setActiveLink("/checkattendance");
            }}
            style={
              activeLink === "/checkattendance"
                ? Object.assign({}, navLinkStyle, activeLinkStyle)
                : navLinkStyle
            }
          >
            <Typography
              sx={{
                fontFamily: "Arial, sans-serif",
                fontWeight: "bold",
                fontSize: "10px",
              }}
            >
              Check Attendance
            </Typography>
          </ListItem>
        </List>
      </Drawer>
    </>
  );
}
