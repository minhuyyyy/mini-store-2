import { alpha, Menu, styled, TablePagination } from "@mui/material";
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
import env from "react-dotenv";
import { KeyboardArrowDownOutlined, Translate } from "@mui/icons-material";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function ManageProductsPage() {
  const { user } = useContext(AuthContext);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [product, setProduct] = useState([]);
  const [categoryMenuOpen, setCategoryMenuOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const tableContainerRef = useRef(null);
  useEffect(() => {
    fetch("http://vps.akabom.me/api/product")
      .then((response) => response.json())
      .then((data) => {
        setFilteredProducts(data);
        setCategories([...new Set(data.map((product) => product.category))]);
      });
  }, []);

  const columns = [
    { id: "id", label: "ID", maxWidth: 30 },
    { id: "name", label: "Name", maxWidth: 10 },
    { id: "image", label: "Image", maxWidth: 10 },
    { id: "category", label: "Category", maxWidth: 100 },
    { id: "price", label: "Price", maxWidth: 80 },
    { id: "stock", label: "Stock", maxWidth: 80 },
    { id: "unit", label: "Unit", maxWidth: 50 },
    { id: "info", label: "Info", maxWidth: 130 },
    { id: "action", label: "Actions", maxWidth: 100 },
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
      await axios
        .put(`http://vps.akabom.me/api/product/${id}`, {
          id: id,
          name: product.name,
          description: product.description,
          price: product.price,
          imageUrl: product.imageUrl,
          unit: product.unit,
          category: product.category,
          stock: product.stock,
          isActive: false,
        })
        .then((response) => {
          if (response.status == 200) {
            toast.success("Product deleted successfully");
          }
        });
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div style={{ color: "black", width: "100%" }}>
      {user ? (
        <>
          <div
            className="container"
            style={{
              backgroundColor: "#0A6EBD",
              color: "white",
              height: 70,
              position: "relative",
              width: window.innerWidth,
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
                  transform: `translate(300%, -50%)`,
                  backgroundColor: "#fff",
                }}
              >
                Add product
              </Button>
            </Link>
          </div>

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
              className="container"
            >
              <Table>
                <TableHead>
                  <TableRow>
                    {columns.map((column) => (
                      <TableCell
                        key={column.id}
                        align="left"
                        style={{ maxWidth: column.maxWidth }}
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
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
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
                                    style={{ width: "100px", height: "auto" }}
                                  />
                                </TableCell>
                              );
                            }
                            if (column.id === "action") {
                              return (
                                <TableCell key={column.id} align="left">
                                  <Link to={`/manageproducts/update/${row.id}`}>
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
        </>
      ) : (
        <h2 className="center">Log in to view page</h2>
      )}
    </div>
  );
}
