import React, { useState, useEffect, useRef } from "react";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { cyan, green } from "@mui/material/colors";
import {
  createTheme,
  ThemeProvider,
  styled,
  alpha,
} from "@mui/material/styles";
import { KeyboardArrowDownOutlined, Translate } from "@mui/icons-material";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import axios from "axios";
import useSessionStorage from "../hooks/useSessionStorage";
export const theme = createTheme({
  palette: {
    background: {
      main: "#1a237e",
      contrastText: "#f5f5f5",
    },
    add: {
      main: cyan[500],
      contrastText: "#f5f5f5",
    },
    update: {
      contrastText: "#f5f5f5",
      main: green[500],
    },
    remove: {
      contrastText: "#f5f5f5",
      main: "#ff1744",
    },
    deny: {
      contrastText: "#f5f5f5",
      main: "#263238",
    },
    reject: {
      contrastText: "#f5f5f5",
      main: "#eb5144",
    },
    select: {
      contrastText: "#f5f5f5",
      main: "#78909c",
    },
  },
});

const StyledMenu = styled(Menu)(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 30,
    color:
      theme.palette.mode === "light"
        ? "rgb(55, 65, 81)"
        : theme.palette.grey[300],
    boxShadow:
      "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
    "& .MuiMenu-list": {
      padding: "4px 0",
    },
    "& .MuiMenuItem-root": {
      "& .MuiSvgIcon-root": {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      "&:active": {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity
        ),
      },
    },
  },
}));

const ManageAccounts = () => {
  const tableContainerRef = useRef(null);
  const [data, setData] = useState([]);
  const [currentUser, setCurrentUser] = useState([]);
  const [showTop, setShowTop] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedActive, setSelectedActive] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [activeMenuOpen, setActiveMenuOpen] = useState(false);
  const [msg, setMsg] = useState(null);
  let { user } = useContext(AuthContext);
  const { getItem } = useSessionStorage();

  const API_URL = process.env.REACT_APP_API_URL;

  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const handleScroll = () => {
      setShowTop(window.scrollY >= 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleRoleFilterChange = (role) => {
    setSelectedRole(role);
  };

  const roles = ["Manager", "Sales", "Guard"];

  const fetchData = async () => {
    try {
      if (currentUser.position === "Manager") {
        const response = await axios.get(`${API_URL}/employee`).catch((e) => {
          return e.response;
        });
        if (response.status === 200) {
          setData(response.data);
        } else if (response.status === 400) {
          toast.error(response.data.message);
        } else {
          toast.error(response.status.message);
        }
      } else setMsg("Only Manager can view this page");
    } catch (e) {
      toast.error();
    }
  };

  useEffect(() => {
    checkUser();
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [currentUser]);

  const checkUser = async () => {
    try {
      if (user) {
        setCurrentUser(user);
      }
    } catch (e) {
      console.error(e);
      setMsg("Something went wrong");
    }
  };

  const queryTrue = async () => {
    try {
      const filteredData = data.filter((account) => account.isActive === true);
      setData(filteredData);
    } catch (e) {
      toast.error("Something went wrong");
    }
  };

  const queryFalse = async () => {
    try {
      const filteredData = data.filter((account) => account.isActive === false);
      setData(filteredData);
    } catch (e) {
      toast.error("Something went wrong");
    }
  };

  const columns = [
    { id: "id", label: "ID", minWidth: 30 },
    { id: "fullName", label: "Name", minWidth: 80 },
    { id: "imgUrl", label: "Image", minWidth: 90 },
    { id: "email", label: "Email", minWidth: 120 },
    { id: "isActive", label: "Active", minWidth: 150 },
    { id: "role", label: "Role", minWidth: 120 },
    { id: "action", label: "Actions", minWidth: 120 },
  ];

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    tableContainerRef.current.scrollTo(0, 0);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/employee/${id}`, {}).then((response) => {
        if (response.status === 200) {
          toast.success("Account deleted successfully");
          fetchData();
        } else if (response.status === 400) {
          toast.error(response.data.message);
        } else {
          toast.error(response.status.message);
        }
      });
    } catch (e) {
      console.log(e);
    }
  };

  const filteredAccounts = data
    .filter((account) => selectedRole === "" || account.role === selectedRole)
    .filter(
      (account) => selectedActive === "" || account.isActive === selectedActive
    );

  const rows = filteredAccounts.map((account) => ({
    id: account.id,
    fullName: account.fullName,
    imgUrl: account.imgUrl,
    email: account.email,
    createDate: account.createDate,
    role: account.position,
    isActive: account.isActive,
  }));

  return (
    <ThemeProvider theme={theme}>
      <div style={{ backgroundColor: "#d3d3d3" }}>
        <div style={{ color: "black" }} className="container">
          {currentUser.position === "Manager" ? (
            <>
              <div
                style={{
                  backgroundColor: "#0A6EBD",
                  color: "white",
                  height: 70,
                  position: "relative",
                  width: "100%",
                }}
              >
                <h2
                  className="right content"
                  style={{
                    position: "absolute",
                    margin: 0,
                    top: "50%",
                    transform: `translate(0%, -50%)`,
                  }}
                >
                  Manage Accounts
                </h2>
                <Link to={"add"}>
                  <Button
                    style={{
                      position: "absolute",
                      margin: 0,
                      top: "50%",
                      transform: `translate(430%, -50%)`,
                      backgroundColor: "#fff",
                    }}
                  >
                    Add account
                  </Button>
                </Link>
              </div>
              <div style={{ width: "100%" }}>
                <Paper
                  sx={{
                    overflow: "hidden",
                    height: "100%",
                    paddingTop: 3,
                  }}
                >
                  <TableContainer
                    sx={{ height: "100%" }}
                    ref={tableContainerRef}
                  >
                    <Table>
                      <TableHead>
                        <TableRow>
                          {columns.map((column) => (
                            <TableCell key={column.id} align="left">
                              {column.label}
                              {column.id === "isActive" && (
                                <>
                                  <Button
                                    id="active-filter-button"
                                    aria-controls={"active-filter-menu"}
                                    aria-haspopup="true"
                                    aria-expanded={
                                      activeMenuOpen ? "true" : undefined
                                    }
                                    style={{
                                      height: 20,
                                      width: 20,
                                      padding: 0,
                                      marginLeft: 0,
                                      borderRadius: "50%",
                                    }}
                                    className="right"
                                    disableElevation
                                    onClick={(event) => {
                                      setAnchorEl(event.currentTarget);
                                      setActiveMenuOpen(true);
                                      setRoleMenuOpen(false); // Close the role menu if it's open
                                    }}
                                    endIcon={<KeyboardArrowDownOutlined />}
                                  />
                                  <StyledMenu
                                    id="active-filter-menu"
                                    MenuListProps={{
                                      "aria-labelledby": "active-filter-button",
                                    }}
                                    anchorEl={anchorEl}
                                    open={activeMenuOpen}
                                    onClose={() => setActiveMenuOpen(false)} // Close the menu when clicking outside
                                  >
                                    <MenuItem onClick={fetchData} disableRipple>
                                      All
                                    </MenuItem>
                                    <MenuItem
                                      value={"true"}
                                      onClick={queryTrue}
                                      disableRipple
                                    >
                                      Yes
                                    </MenuItem>
                                    <MenuItem
                                      onClick={queryFalse}
                                      disableRipple
                                    >
                                      No
                                    </MenuItem>
                                  </StyledMenu>
                                </>
                              )}

                              {column.id === "role" && (
                                <>
                                  <Button
                                    id="role-filter-button"
                                    aria-controls={"role-filter-menu"}
                                    aria-haspopup="true"
                                    aria-expanded={
                                      roleMenuOpen ? "true" : undefined
                                    }
                                    style={{
                                      height: 20,
                                      width: 20,
                                      padding: 0,
                                      marginLeft: 0,
                                      borderRadius: "50%",
                                    }}
                                    className="right"
                                    disableElevation
                                    onClick={(event) => {
                                      setAnchorEl(event.currentTarget);
                                      setRoleMenuOpen(true);
                                      setActiveMenuOpen(false); // Close the active menu if it's open
                                    }}
                                    endIcon={<KeyboardArrowDownOutlined />}
                                  />
                                  <Menu
                                    id="role-filter-menu"
                                    anchorEl={anchorEl}
                                    open={roleMenuOpen}
                                    onClose={() => setRoleMenuOpen(false)}
                                  >
                                    <MenuItem
                                      key="all"
                                      onClick={() => {
                                        setSelectedRole("");
                                        setRoleMenuOpen(false);
                                        setAnchorEl(null);
                                      }}
                                    >
                                      All
                                    </MenuItem>
                                    {roles.map((role) => (
                                      <MenuItem
                                        key={role}
                                        value={role}
                                        onClick={() => {
                                          handleRoleFilterChange(role);
                                          setRoleMenuOpen(false);
                                          setAnchorEl(null);
                                        }}
                                      >
                                        {role}
                                      </MenuItem>
                                    ))}
                                  </Menu>
                                </>
                              )}
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {rows
                          .slice(
                            page * rowsPerPage,
                            page * rowsPerPage + rowsPerPage
                          )
                          .map((row) => (
                            <TableRow
                              hover
                              role="checkbox"
                              tabIndex={-1}
                              key={row.id}
                              className="center"
                            >
                              {columns.map((column) => {
                                const value = row[column.id];
                                if (column.id === "imgUrl") {
                                  return (
                                    <TableCell key={column.id} align="left">
                                      <img
                                        src={value}
                                        alt={row.name}
                                        style={{
                                          width: "100px",
                                          height: "auto",
                                        }}
                                      />
                                    </TableCell>
                                  );
                                }
                                if (column.id === "isActive") {
                                  return (
                                    <TableCell key={column.id} align="left">
                                      {value ? "Yes" : "No"}
                                    </TableCell>
                                  );
                                }
                                if (column.id === "action") {
                                  return (
                                    <TableCell key={column.id} align="left">
                                      <Link
                                        to={`/manageaccounts/update/${row.id}`}
                                      >
                                        <Button
                                          className="btn"
                                          style={{
                                            backgroundColor: "blue",
                                            color: "white",
                                          }}
                                        >
                                          Update
                                        </Button>
                                      </Link>{" "}
                                      <Button
                                        className="btn"
                                        style={{
                                          backgroundColor: "red",
                                          color: "white",
                                        }}
                                        onClick={() => handleDelete(row.id)}
                                      >
                                        Delete
                                      </Button>
                                    </TableCell>
                                  );
                                }
                                return (
                                  <TableCell key={column.id} align="left">
                                    {value}
                                  </TableCell>
                                );
                              })}
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                    <TablePagination
                      rowsPerPageOptions={[10, 25, 100]}
                      component="div"
                      count={filteredAccounts.length}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      onPageChange={handleChangePage}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                      style={{ paddingBottom: 50 }}
                    />
                  </TableContainer>
                  {showTop && (
                    <Button
                      style={{
                        position: "fixed",
                        bottom: 40,
                        right: 20,
                        borderRadius: "50%",
                        backgroundColor: "darkblue",
                        color: "white",
                        width: 50,
                        height: 50,
                      }}
                      onClick={handleScrollToTop}
                    >
                      <KeyboardArrowUpIcon />
                    </Button>
                  )}
                </Paper>
              </div>
            </>
          ) : (
            <h2>{msg}</h2>
          )}
        </div>
      </div>
    </ThemeProvider>
  );
};

export default ManageAccounts;
