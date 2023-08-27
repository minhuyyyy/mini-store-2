import {
  alpha,
  IconButton,
  Input,
  InputAdornment,
  Menu,
  styled,
  TablePagination,
} from "@mui/material";
import {
  Paper,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  MenuItem,
} from "@mui/material";
import React, { useState, useEffect, useRef } from "react";
import { Button, Table } from "@mui/material";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { KeyboardArrowDownOutlined } from "@mui/icons-material";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function ManageProductsPage() {
  const { user } = useContext(AuthContext);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [currentUser, setCurrentUser] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryMenuOpen, setCategoryMenuOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [msg, setMsg] = useState(null);
  const tableContainerRef = useRef(null);
  const API_URL = process.env.REACT_APP_API_URL;

  const fetchData = async () => {
    try {
      if (
        currentUser.position === "Manager" ||
        currentUser.position === "Saler"
      ) {
        axios.get(`${API_URL}/product`).then((response) => {
          setFilteredProducts(response.data);
          return response.data;
        });
      } else setMsg("Only Manager can view this page");
    } catch (e) {
      toast.error("Something went wrong");
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

  const columns = [
    { id: "id", label: "ID", minWidth: 50 },
    { id: "name", label: "Name", minWidth: 150 },
    { id: "image", label: "Image", minWidth: 130 },
    { id: "category", label: "Category", minWidth: 160 },
    { id: "price", label: "Price", minWidth: 100 },
    { id: "stock", label: "Stock", minWidth: 100 },
    { id: "unit", label: "Unit", minWidth: 80 },
    { id: "info", label: "Info", minWidth: 130 },
    { id: "action", label: "Actions", minWidth: 100 },
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

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const rows = filteredProducts
    .filter(
      (product) =>
        selectedCategory === "" || product.category === selectedCategory
    )
    .map((product) => ({
      id: product.id,
      name: product.name,
      image: product.imageUrl,
      category: product.category,
      price: product.price,
      stock: product.stock,
      unit: product.unit,
      info: product.description,
    }));

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/product/${id}`).then((response) => {
        if (response.status == 200) {
          toast.success("Product deleted successfully");
          window.location.reload();
        }
      });
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div style={{ backgroundColor: "#d3d3d3" }}>
      <div style={{ color: "black", width: "90%" }} className="container">
        {currentUser.position === "Manager" ||
        currentUser.position === "Saler" ? (
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
                Manage Products
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
                  Add product
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
                  sx={{ height: window.innerHeight }}
                  ref={tableContainerRef}
                >
                  <Table>
                    <TableHead>
                      <TableRow>
                        {columns.map((column) => (
                          <TableCell
                            key={column.id}
                            align="left"
                            style={{
                              minWidth: column.minWidth,
                            }}
                          >
                            {column.label}
                            {column.id === "category" && (
                              <>
                                <Button
                                  id="category-filter-button"
                                  aria-controls={"category-filter-menu"}
                                  aria-haspopup="true"
                                  aria-expanded={
                                    categoryMenuOpen ? "true" : undefined
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
                                    setCategoryMenuOpen(true);
                                  }}
                                  endIcon={<KeyboardArrowDownOutlined />}
                                />
                                <Menu
                                  id="category-filter-menu"
                                  anchorEl={anchorEl}
                                  open={categoryMenuOpen}
                                  onClose={() => setCategoryMenuOpen(false)}
                                >
                                  <MenuItem
                                    key="all"
                                    onClick={() => {
                                      setSelectedCategory("");
                                      setCategoryMenuOpen(false);
                                      setAnchorEl(null);
                                    }}
                                  >
                                    All
                                  </MenuItem>
                                  {categories.map((category) => (
                                    <MenuItem
                                      key={category}
                                      value={category}
                                      onClick={() => {
                                        handleCategoryChange(category);
                                        setCategoryMenuOpen(false);
                                        setAnchorEl(null);
                                      }}
                                    >
                                      {category}
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
                        .map((row) => {
                          return (
                            <TableRow
                              hover
                              role="checkbox"
                              tabIndex={-1}
                              key={row.id}
                            >
                              {columns.map((column) => {
                                const value = row[column.id];
                                if (column.id === "image") {
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
                                if (column.id === "action") {
                                  return (
                                    <TableCell key={column.id} align="left">
                                      <Link
                                        to={`/manageproducts/update/${row.id}`}
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
                                      </Link>
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
                          );
                        })}
                    </TableBody>
                  </Table>
                  <TablePagination
                    rowsPerPageOptions={[10, 25, 100]}
                    component="div"
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    style={{ paddingBottom: 50 }}
                  />
                </TableContainer>
              </Paper>
            </div>
          </>
        ) : (
          <h2 className="center">Log in to view page</h2>
        )}
      </div>
    </div>
  );
}
