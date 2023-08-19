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
import { collection, getDocs, query, where } from "firebase/firestore";
import { CSVLink } from "react-csv";
import { Button } from "@mui/material";
import env from "react-dotenv";
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
        <TableCell component="th" scope="row">
          {row.ID}
        </TableCell>
        <TableCell align="right">{row.name}</TableCell>
        <TableCell align="right">{row.base}</TableCell>
        <TableCell align="right">{row.role}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Detail
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Total</TableCell>
                    <TableCell align="center">Over Time</TableCell>
                    <TableCell align="center">Work Hours</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.workDays &&
                    row.workDays.map((day) => (
                      <TableRow key={day}>
                        <TableCell>
                          {day}
                          <br />
                        </TableCell>
                        <TableCell>
                          {(
                            row.workHours * row.base +
                            row.OT * 40000
                          ).toLocaleString("en-US")}
                        </TableCell>
                        <TableCell align="center">{row.OT}</TableCell>
                        <TableCell align="center">{row.workHours}</TableCell>
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
    ID: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    base: PropTypes.number.isRequired,
    role: PropTypes.string.isRequired,
    workDays: PropTypes.arrayOf(PropTypes.string).isRequired,
    total: PropTypes.number.isRequired,
    OT: PropTypes.number.isRequired,
    workHours: PropTypes.number.isRequired,
    // ... other properties
  }).isRequired,
};

export default function ViewSalary() {
  const [data, setData] = useState([]);
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(sessionStorage.getItem("user"))
  );
  const [uid, setUid] = useState("");

  useEffect(() => {
    setUid(currentUser.ID);
  }, [currentUser]);

  useEffect(() => {
    fetchData();
  }, [uid]);

  const fetchData = async () => {};

  const csvHeaders = [
    { label: "ID", key: "ID" },
    { label: "Name", key: "name" },
    { label: "Base", key: "base" },
    { label: "Role", key: "role" },
    { label: "Work Hours", key: "workHours" },
    { label: "OT", key: "OT" },
    { label: "Work Days", key: "workDays" },
    // Add additional headers as needed
  ];

  return (
    <div style={{ marginBottom: 200 }}>
      <Button variant="contained" style={{ marginTop: 20 }}>
        <CSVLink
          data={data}
          headers={csvHeaders}
          filename={`salary_data_${currentUser.ID}.csv`}
          style={{ color: "white", textDecoration: "none" }}
        >
          Export to CSV
        </CSVLink>
      </Button>
      <TableContainer component={Paper}>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>ID</TableCell>
              <TableCell align="right">Name</TableCell>
              <TableCell align="right">Base</TableCell>
              <TableCell align="right">Role</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <Row key={row.ID} row={row} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
