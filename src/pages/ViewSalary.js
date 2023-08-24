import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import PropTypes from "prop-types";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import {
  Box,
  Button,
  Collapse,
  IconButton,
  Input,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import dayjs from "dayjs";
function Row(props) {
  const { row, onBonusChange, onDeductionChange } = props;
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
        <TableCell component="th" scope="row">
          {row.payslipId}
        </TableCell>
        <TableCell align="right">{row.employeeId}</TableCell>
        <TableCell align="right">
          {row.baseSalary.toLocaleString("vi-VN", {
            style: "currency",
            currency: "VND",
          })}
        </TableCell>
        <TableCell align="center">{row.totalWorkHours}</TableCell>
        <TableCell align="center">{row.bonuses}</TableCell>
        <TableCell align="center">{row.deductions}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Work Shifts
              </Typography>
              <Table size="small" aria-label="work shifts">
                <TableHead>
                  <TableRow>
                    <TableCell>Shift ID</TableCell>
                    <TableCell>Start Date</TableCell>
                    <TableCell>End Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.workShifts.map((shift) => (
                    <TableRow key={shift.id}>
                      <TableCell>{shift.id}</TableCell>
                      <TableCell>
                        {new Date(shift.startDate).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        {new Date(shift.endDate).toLocaleString()}
                      </TableCell>
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
    payslipId: PropTypes.string.isRequired,
    employeeId: PropTypes.string.isRequired,
    baseSalary: PropTypes.number.isRequired,
    totalWorkHours: PropTypes.number.isRequired,
    bonuses: PropTypes.number.isRequired,
    deductions: PropTypes.number.isRequired,
    workShifts: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,
};
function ViewSalary() {
  const [data, setData] = useState([]);
  const { user } = useContext(AuthContext);
  const [currentUser, setCurrentUser] = useState([]);
  const API_URL = process.env.REACT_APP_API_URL;

  const fetchAll = async () => {
    const response = await axios.get(`${API_URL}/salary`);
    if (response.status === 200) setData(response.data);
  };

  const fetchWithID = async () => {
    const response = await axios.get(
      `${API_URL}/salary/employee/${currentUser.id}`
    );
    if (response.status === 200) setData(response.data);
  };

  useEffect(() => {
    if (user) {
      setCurrentUser(user);
    }
  }, [user]);

  useEffect(() => {
    currentUser.position === "Manager" ? fetchAll() : fetchWithID();
  }, [currentUser]);

  return (
    <div style={{ marginBottom: 200 }}>
      {currentUser.position === "Manager" ? (
        <TableContainer component={Paper}>
          <Table aria-label="collapsible table">
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell>Payslip ID</TableCell>
                <TableCell align="right">Employee ID</TableCell>
                <TableCell align="right">Base Salary</TableCell>
                <TableCell align="center">Total Work Hours</TableCell>
                <TableCell align="center">Bonuses</TableCell>
                <TableCell align="center">Deductions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row) => (
                <Row key={row.payslipId} row={row} />
              ))}
              {data.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7}>No data available</TableCell>
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
                    <TableCell>Payslip ID</TableCell>
                    <TableCell align="right">Employee ID</TableCell>
                    <TableCell align="right">Base Salary</TableCell>
                    <TableCell align="center">Total Work Hours</TableCell>
                    <TableCell align="center">Bonuses</TableCell>
                    <TableCell align="center">Deductions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.map((row) => (
                    <Row key={row.payslipId} row={row} />
                  ))}
                  {data.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7}>No data available</TableCell>
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

export default ViewSalary;
