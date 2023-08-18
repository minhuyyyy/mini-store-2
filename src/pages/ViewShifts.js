import React, { useState, useEffect } from "react";
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

export default function ViewSalary() {
  const [data, setData] = useState([]);
  const [currentUser, setCurrentUser] = useState([]);
  const [uid, setUid] = useState("");

  useEffect(() => {
    setUid(currentUser.ID);
  }, [currentUser]);

  useEffect(() => {
    fetchData();
  }, [uid]);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "http://vps.akabom.me/api/work-shift?startDate=2023-08-20&endDate=2023-08-27"
      );
      setData(response.data);
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div style={{ marginBottom: 200 }} className="container center">
      <ThemeProvider theme={theme}>
        <TableContainer component={Paper}>
          <Table aria-label="salary table">
            <TableHead>
              <TableRow>
                {/* <TableCell>Register ID</TableCell> */}
                <TableCell>Employee ID</TableCell>
                <TableCell>Start Time</TableCell>
                {/* <TableCell>End Time</TableCell> */}
                <TableCell>Coefficient</TableCell>
                <TableCell>Work Shift</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row) => (
                <TableRow key={row.id}>
                  {/* <TableCell>{row.id}</TableCell> */}
                  <TableCell>{row.employeeId}</TableCell>
                  <TableCell>{row.startDate}</TableCell>
                  {/* <TableCell>{row.endDate}</TableCell> */}
                  <TableCell>{row.coefficientsSalary}</TableCell>
                  <TableCell>{row.workshiftTypeId}</TableCell>
                  <TableCell>{row.approvalStatusId}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="update"
                      sx={{ marginRight: "10px" }}
                    >
                      Approved
                    </Button>
                    <Button variant="contained" color="reject">
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
  );
}
