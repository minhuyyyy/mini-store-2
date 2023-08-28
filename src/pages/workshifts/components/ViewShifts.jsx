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
import { AuthContext } from "../../../context/AuthContext";
import { theme } from "../../ManageAccounts";

export default function ViewShifts({ startDate, endDate }) {
  const [data, setData] = useState([]);
  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    fetchData();
  }, [startDate, endDate]);

  const fetchData = async () => {
    try {
      const response = await axios
        .get(`${API_URL}/work-shift?startDate=${startDate}&endDate=${endDate}`)
        .catch((error) => {
          return error.response;
        });
      if (response.status === 200) {
        setData(response.data);
      } else {
        setData([]);
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const actionClick = async (id, employeeId, isAccept) => {
    const response = await axios.put(`${API_URL}/work-shift/confirm`, {
      employeeId: employeeId,
      workshiftId: id,
      isConfirm: isAccept,
    });
    if (response.status === 200) {
      fetchData();
    }
  };

  const renderStatus = (status) => {
    if (status === 1) {
      return "Pending";
    } else if (status === 2) {
      return "Approved";
    } else {
      return "Denied";
    }
  };

  const renderPosition = (position) => {
    if (position === 2) {
      return "Guard";
    } else if (position === 3) {
      return "Saler";
    }
  };

  return (
    <>
      <div style={{ marginBottom: 200 }} className="center">
        <ThemeProvider theme={theme}>
          <TableContainer component={Paper}>
            <Table aria-label="salary table">
              <TableHead>
                <TableRow>
                  <TableCell>Employee ID</TableCell>
                  <TableCell>Employee Name</TableCell>
                  <TableCell>Position</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell align="center">Coefficient</TableCell>
                  <TableCell align="center">Work Shift</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="center">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>{row.employeeId}</TableCell>
                    <TableCell>{row.employee.fullName}</TableCell>
                    <TableCell>
                      {renderPosition(row.employee.positionId)}
                    </TableCell>
                    <TableCell>{row.startDate.split("T")[0]}</TableCell>
                    <TableCell align="center">
                      {row.coefficientsSalary}
                    </TableCell>
                    <TableCell align="center">
                      {row.startDate.split("T")[1]} -{" "}
                      {row.endDate.split("T")[1]}
                    </TableCell>
                    <TableCell>{renderStatus(row.approvalStatusId)}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="update"
                        sx={{ marginRight: "10px" }}
                        disabled={row.approvalStatusId !== 1}
                        onClick={() =>
                          actionClick(row.id, row.employeeId, true)
                        }
                      >
                        Approved
                      </Button>
                      <Button
                        variant="contained"
                        color="reject"
                        disabled={row.approvalStatusId !== 1}
                        onClick={() =>
                          actionClick(row.id, row.employeeId, false)
                        }
                      >
                        Deny
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </ThemeProvider>
      </div>
    </>
  );
}
