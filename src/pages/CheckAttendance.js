import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Grid,
} from "@mui/material";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  writeBatch,
  arrayUnion,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import env from "react-dotenv";
function CheckAttendanceForm() {
  const [selectedTime, setSelectedTime] = useState("");
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(sessionStorage.getItem("user"))
  );
  const [ID, setID] = useState(currentUser?.ID || "");
  const [OT, setOT] = useState(0);
  const [docID, setDocID] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    if (ID) {
      getData();
    }
  }, [ID]);

  useEffect(() => {
    setID(currentUser?.ID || "");
  }, [currentUser]);

  const handleTimeChange = (event) => {
    setSelectedTime(event.target.value);
  };

  const now = new Date();

  const today = now.getDay();
  const weekStart = new Date(now);
  const diff = today === 0 ? 6 : today - 1;
  weekStart.setDate(now.getDate() - diff);

  const weekDays = [];
  for (let i = 0; i < 7; i++) {
    const day = new Date(weekStart);
    day.setDate(weekStart.getDate() + i);
    weekDays.push(day.toLocaleDateString());
  }

  const [formData, setFormData] = useState({
    workHours: 0,
    OT: 0,
  });

  const getData = async () => {};

  const handleSubmit = async (e) => {};

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <CardContent>
      <Typography
        sx={{
          textAlign: "center",
          backgroundColor: "#0A6EBD",
          color: "white",
          padding: "15px 0",
        }}
        variant="h4"
      >
        Check In
      </Typography>
      <form onSubmit={handleSubmit}>
        <Typography variant="subtitle1">
          Week of {weekDays[0]} - {weekDays[6]}
        </Typography>
        <FormControl fullWidth variant="outlined" margin="normal">
          <InputLabel>Select Time</InputLabel>
          <Select
            value={selectedTime}
            onChange={handleTimeChange}
            label="Select Time"
          >
            <MenuItem value="6:00 - 10:00">6:00 - 10:00</MenuItem>
            <MenuItem value="10:00 - 14:00">10:00 - 14:00</MenuItem>
            <MenuItem value="14:00 - 18:00">14:00 - 18:00</MenuItem>
            <MenuItem value="18:00 - 22:00">18:00 - 22:00</MenuItem>
          </Select>
          <label>Overtime Hours:</label>
          <TextField
            type="number"
            sx={{ width: "50%" }}
            inputProps={{ min: 0, style: { paddingLeft: "10px" } }}
            onChange={handleInputChange}
            name="OT"
          />
        </FormControl>
        <br />
        <Button variant="contained" color="primary" type="submit">
          Submit
        </Button>
      </form>
    </CardContent>
  );
}

function AbsentForm() {
  const [employeeName, setEmployeeName] = useState("");
  const [absentDay, setAbsentDay] = useState("");
  const [absentReason, setAbsentReason] = useState("");

  const handleEmployeeName = (event) => {
    setEmployeeName(event.target.value);
  };

  const handleDayChange = (event) => {
    setAbsentDay(event.target.value);
  };

  const handleReasonChange = (event) => {
    setAbsentReason(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle form submission here
  };

  return (
    <CardContent>
      <Typography
        sx={{
          textAlign: "center",
          backgroundColor: "#0A6EBD",
          color: "white",
          padding: "15px 0",
        }}
        variant="h4"
      >
        Absent Form
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          margin="normal"
          label="Employee Name"
          value={employeeName}
          onChange={handleEmployeeName}
          inputProps={{ style: { paddingLeft: "10px" } }}
        />
        <label>Day Absent</label>
        <TextField
          fullWidth
          margin="normal"
          type="date"
          value={absentDay}
          onChange={handleDayChange}
        />
        <br />
        <TextField
          fullWidth
          margin="normal"
          label="Reason"
          value={absentReason}
          onChange={handleReasonChange}
          inputProps={{ style: { paddingLeft: "10px" } }}
        />
        <br />
        <Button variant="contained" color="primary" type="submit">
          Submit
        </Button>
      </form>
    </CardContent>
  );
}

function CheckAttendance() {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(sessionStorage.getItem("user"))
  );
  return (
    <>
      {currentUser ? (
        <>
          <Grid justify="center">
            <Card
              style={{
                marginTop: "180px",
                height: "100%",
                width: "70%",
                transform: "translate(20%, -50%)",
              }}
            >
              <CheckAttendanceForm />
            </Card>
          </Grid>
          {/* <Grid item xs={12} sm={6}>
              <Card style={{ marginTop: "60px", height: "100%" }}>
                <AbsentForm />
              </Card>
            </Grid> */}
        </>
      ) : (
        <h2 className="center">Log in to view page</h2>
      )}
    </>
  );
}

export default CheckAttendance;
