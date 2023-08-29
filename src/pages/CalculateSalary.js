import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { Button, Input } from "@mui/material";
import axios from "axios";
import { toast } from "materialize-css";

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
        <TableCell align="right">{row.totalWorkHours}</TableCell>
        <TableCell align="right">
          <Input
            type="number"
            value={row.bonuses}
            onChange={(e) => onBonusChange(row.payslipId, e.target.value)}
          />
        </TableCell>
        <TableCell align="right">
          <Input
            type="number"
            value={row.deductions}
            onChange={(e) => onDeductionChange(row.payslipId, e.target.value)}
          />
        </TableCell>
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
  onBonusChange: PropTypes.func.isRequired,
  onDeductionChange: PropTypes.func.isRequired,
};

function CalculateSalary({ setData, data }) {
  const [updatedData, setUpdatedData] = useState([data]);
  const API_URL = process.env.REACT_APP_API_URL;

  const handleBonusChange = (payslipId, value) => {
    const updated = updatedData.map((row) =>
      row.payslipId === payslipId ? { ...row, bonuses: parseFloat(value) } : row
    );
    setUpdatedData(updated);
  };

  const handleDeductionChange = (payslipId, value) => {
    const updated = updatedData.map((row) =>
      row.payslipId === payslipId
        ? { ...row, deductions: parseFloat(value) }
        : row
    );
    setUpdatedData(updated);
  };

  useEffect(() => {
    if (data) {
      setData(data);
    }
  });

  const handleConfirm = (payslipId) => {
    const updatedRow = updatedData.find((row) => row.payslipId === payslipId);
    const totalSalary =
      updatedRow.baseSalary + updatedRow.bonuses - updatedRow.deductions;

    axios
      .put(`${API_URL}/salary/${payslipId}`, {
        salaryId: payslipId,
        baseSalary: updatedRow.baseSalary,
        deductions: updatedRow.deductions,
        bonuses: updatedRow.bonuses,
        totalSalary: totalSalary,
      })
      .then((response) => {
        if (response.status === 200) {
          toast.success(`Confirmed ${payslipId}`);
          setData(null);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <div style={{ marginBottom: 200 }}>
      <TableContainer component={Paper}>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Payslip ID</TableCell>
              <TableCell align="right">Employee ID</TableCell>
              <TableCell align="right">Base Salary</TableCell>
              <TableCell align="right">Total Work Hours</TableCell>
              <TableCell align="center">Bonuses</TableCell>
              <TableCell align="center">Deductions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {updatedData.map((row) => (
              <Row
                key={row.payslipId}
                row={row}
                onBonusChange={handleBonusChange}
                onDeductionChange={handleDeductionChange}
              />
            ))}
            {updatedData.length === 0 && (
              <TableRow>
                <TableCell colSpan={7}>No data available</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Button onClick={() => handleConfirm(data.payslipId)}>Confirm</Button>
    </div>
  );
}

export default CalculateSalary;
