import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import PropTypes from "prop-types";
import {
  Box,
  Collapse,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

function Row(props) {
  const { row } = props;
  const [open, setOpen] = useState(false);

  return (
    <React.Fragment>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>{row.orderId}</TableCell>
        <TableCell align="left">{row.salerId}</TableCell>
        <TableCell align="left">{row.totalItems}</TableCell>
        <TableCell align="left">
          {row.totalAmount.toLocaleString("vi-VN", {
            style: "currency",
            currency: "VND",
          })}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Order Details
              </Typography>
              <Table size="small" aria-label="order details">
                <TableHead>
                  <TableRow>
                    <TableCell>Item</TableCell>
                    <TableCell>Quantity</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.orderDetails &&
                    row.orderDetails.map((item) => (
                      <TableRow key={item.itemId}>
                        <TableCell>{item.item}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

Row.propTypes = {
  row: PropTypes.shape({
    orderId: PropTypes.string.isRequired,
    salerId: PropTypes.string.isRequired,
    totalItems: PropTypes.number.isRequired,
    totalAmount: PropTypes.number.isRequired,
    orderDetails: PropTypes.arrayOf(PropTypes.object),
  }).isRequired,
};

export function ViewOrders() {
  const [data, setData] = useState([]);
  const { user } = useContext(AuthContext);
  const [currentUser, setCurrentUser] = useState([]);
  const API_URL = process.env.REACT_APP_API_URL;

  const fetchOrders = async () => {
    const response = await axios.get(`${API_URL}/order`);
    if (response.status === 200) setData(response.data);
  };

  useEffect(() => {
    if (user) {
      setCurrentUser(user);
    }
  }, [user]);

  useEffect(() => {
    if (currentUser.position === "Manager") fetchOrders();
  }, [currentUser]);

  return (
    <div style={{ marginBottom: 200 }}>
      {currentUser.position === "Manager" ? (
        <TableContainer component={Paper}>
          <Table aria-label="collapsible table">
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell>Order ID</TableCell>
                <TableCell align="left">Seller ID</TableCell>
                <TableCell align="left">Total Items</TableCell>
                <TableCell align="left">Total Amount</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row) => (
                <Row key={row.orderId} row={row} />
              ))}
              {data.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6}>No data available</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <>
          {data && (
            <TableContainer component={Paper}>
              <Table aria-label="collapsible table">
                <TableHead>
                  <TableRow>
                    <TableCell />
                    <TableCell>Order ID</TableCell>
                    <TableCell align="right">Saler ID</TableCell>
                    <TableCell align="right">Saler</TableCell>
                    <TableCell align="center">Total Items</TableCell>
                    <TableCell align="right">Total Amount</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.map((row) => (
                    <Row key={row.orderId} row={row} />
                  ))}
                  {data.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6}>No data available</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </>
      )}
    </div>
  );
}
