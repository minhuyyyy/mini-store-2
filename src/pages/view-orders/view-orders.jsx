import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import "./view-orders.css";
import Row from "./components/row-detail";
import { toast } from "materialize-css";

export default function ViewOrders() {
  const [data, setData] = useState([]);
  const { user } = useContext(AuthContext);
  const [currentUser, setCurrentUser] = useState([]);
  const API_URL = process.env.REACT_APP_API_URL;

  const fetchOrders = async () => {
    const response = await axios.get(`${API_URL}/order`).catch((err) => {
      return err.response;
    });

    if (response.status === 200) setData(response.data);
    else if (response.status === 404) {
      toast.error(response.data.message);
      setData([]);
    } else alert(response.data.message);
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
    <div className=" view-orders">
      {currentUser.position === "Manager" ? (
        <TableContainer component={Paper}>
          <Table aria-label="collapsible table">
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell>Order ID</TableCell>
                <TableCell align="left">Saler</TableCell>
                <TableCell align="right">Total Items</TableCell>
                <TableCell align="right">Total Amount</TableCell>
                <TableCell align="center">Order Date</TableCell>
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
          <h1>Unauthorized</h1>
        </>
      )}
    </div>
  );
}
