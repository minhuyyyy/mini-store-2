import React, { useState, useEffect, useContext } from "react";
import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  ThemeProvider,
} from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";
import { theme } from "./ManageAccounts";
import { AuthContext } from "../context/AuthContext";

export default function ViewShifts({ startDate, endDate }) {
  const [data, setData] = useState([]);
  const { user } = useContext(AuthContext);
  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/work-shift?startDate=${startDate}&endDate=${endDate}`
      );
      setData(response.data);
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const handleApprove = async (id, employeeId) => {
    const response = await axios.put(`${API_URL}/work-shift/confirm`, {
      employeeId: employeeId,
      workshiftId: id,
      isConfirm: true,
    });
    if (response.status == 200) {
      fetchData();
    }
  };

  const handleDeny = async (id, employeeId) => {
    const response = await axios.put(`${API_URL}/work-shift/confirm`, {
      employeeId: employeeId,
      workshiftId: id,
      isConfirm: false,
    });
    if (response.status == 200) {
      fetchData();
    }
  };

  return (
    <div style={{ marginBottom: 200 }} className="container center">
      <ThemeProvider theme={theme}>
        <TableContainer component={Paper}>
          <Table aria-label="salary table">
            <TableHead>
              <TableRow>
                <TableCell>Employee ID</TableCell>
                <TableCell>Start Time</TableCell>
                <TableCell>Coefficient</TableCell>
                <TableCell>Work Shift</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row) => (
                <TableRow key={row.id}>
                  {row.approvalStatusId == 1 && (
                    <>
                      <TableCell>{row.employeeId}</TableCell>
                      <TableCell>{row.startDate}</TableCell>
                      <TableCell>{row.coefficientsSalary}</TableCell>
                      <TableCell>{row.workshiftTypeId}</TableCell>
                      <TableCell>
                        {row.approvalStatusId === 1 ? "Pending" : "Accepted"}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="update"
                          sx={{ marginRight: "10px" }}
                          onClick={() => handleApprove(row.id, row.employeeId)}
                        >
                          Approved
                        </Button>
                        <Button
                          variant="contained"
                          color="reject"
                          onClick={() => handleDeny(row.id, row.employeeId)}
                        >
                          Deny
                        </Button>
                      </TableCell>
                    </>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </ThemeProvider>
    </div>
  );
}
