import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import PropTypes from "prop-types";
import { useState } from "react";
import {
  Box,
  Collapse,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

Row.propTypes = {
  row: PropTypes.shape({
    orderId: PropTypes.string.isRequired,
    salerId: PropTypes.string.isRequired,
    totalItems: PropTypes.number.isRequired,
    totalAmount: PropTypes.number.isRequired,
    orderDetails: PropTypes.arrayOf(PropTypes.object),
  }).isRequired,
};

export default function Row({ row }) {
  const [open, setOpen] = useState(false);

  return (
    <>
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
        <TableCell align="left">{row.saler}</TableCell>
        <TableCell align="right">{row.totalItems}</TableCell>
        <TableCell align="right">
          {row.totalAmount.toLocaleString("vi-VN", {
            style: "currency",
            currency: "VND",
          })}
        </TableCell>
        <TableCell align="center">
          {row.createDate.split("T")[0]}{" "}
          {row.createDate.split("T")[1].split(".")[0]}
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Order Details
              </Typography>
              <Table
                size="small"
                aria-label="order details"
                className=" table-order-details"
              >
                <TableHead>
                  <TableRow className="row-header">
                    <TableCell align="left">Product ID</TableCell>
                    <TableCell align="left">Product</TableCell>
                    <TableCell align="right">Unit Price</TableCell>
                    <TableCell align="right">Quantity</TableCell>
                    <TableCell align="right">Amount</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.orderDetails &&
                    row.orderDetails.map((item) => (
                      <TableRow key={item.itemId}>
                        <TableCell align="left">{item.productId}</TableCell>
                        <TableCell align="left">{item.productName}</TableCell>
                        <TableCell align="right">
                          {item.unitPrice.toLocaleString("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          })}
                        </TableCell>
                        <TableCell align="right">{item.quantity}</TableCell>
                        <TableCell align="right">
                          {item.amount.toLocaleString("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          })}
                        </TableCell>
                      </TableRow>
                    ))}
                  <TableRow className="row-footer">
                    <TableCell
                      align="left"
                      className="row-footer-none"
                    ></TableCell>
                    <TableCell
                      align="left"
                      className="row-footer-none"
                    ></TableCell>
                    <TableCell align="right">Total</TableCell>
                    <TableCell align="right">{row.totalItems}</TableCell>
                    <TableCell align="right">
                      {row.totalAmount.toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}
