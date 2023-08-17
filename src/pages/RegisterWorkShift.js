import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Calendar from "../components/Calendar";
import axios from "axios";

export function RegisterWorkShiftForm({ selectedDate }) {
  const { user } = useContext(AuthContext);
  const [currentUser, setCurrentUser] = useState([]);
  const [ID, setID] = useState(currentUser?.ID || "");
  const [selectedTime, setSelectedTime] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [date, setDate] = useState([]);
  const navigate = useNavigate();

  const SalerShifts = [
    { id: 1, time: "6.00-12.00", type: "saler-shift-1" },
    { id: 2, time: "12:00 - 18:00", type: "saler-shift-2" },
    { id: 3, time: "18:00 - 6:00", type: "saler-shift-3" },
  ];

  const GuardShifts = [
    { id: 1, time: "6.00-18.00", type: "guard-shift-1" },
    { id: 2, time: "18:00 - 6:00", type: "guard-shift-2" },
  ];

  const now = new Date();

  const today = now.getDay();
  const weekStart = new Date(now);
  const diff = today === 0 ? 6 : today - 1;
  weekStart.setDate(now.getDate() - diff);

  const weekDays = [];
  for (let i = -1; i < 7; i++) {
    const day = new Date(weekStart);
    day.setDate(weekStart.getDate() + i);
    weekDays.push(day.toLocaleDateString());
  }

  useEffect(() => {
    setDate(selectedDate);
    console.log(selectedDate);
  }, [selectedDate]);

  useEffect(() => {
    setID(user?.id || "");
  }, [user]);

  const handleTimeChange = (event) => {
    setSelectedTime(event.target.value);
  };

  const handleSubmit = async () => {
    const response = await axios.post("http://vps.akabom.me/api/work-shift", {
      employeeId: ID,
      workshifts: selectedTime.map((time) => ({
        workshiftType: "guard-shift-1",
        startDate: date,
        endDate: date,
      })),
    });
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
        Register Work Shift
      </Typography>
      <form>
        <Typography variant="subtitle1">
          Week of {weekDays[0]} - {weekDays[6]}
        </Typography>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Select Shift</InputLabel>
          <Select
            value={selectedTime}
            multiple
            onChange={handleTimeChange}
            label="Select Shift"
          >
            {user.position === "Guard"
              ? GuardShifts.map((shift) => (
                  <MenuItem key={shift.id} value={shift.time}>
                    {shift.time}
                  </MenuItem>
                ))
              : SalerShifts.map((shift) => (
                  <MenuItem key={shift.id} value={shift.time}>
                    {shift.time}
                  </MenuItem>
                ))}
          </Select>
        </FormControl>
        <br />
        <br />
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Submit
        </Button>
      </form>
    </CardContent>
  );
}

export function RegisterWorkShift() {
  const { user } = useContext(AuthContext);
  return (
    <>
      {user ? (
        <>
          <Grid style={{ width: "70%" }}>
            <Card
              className="center container"
              style={{
                height: "50%",
                width: "100%",
                position: "relative",
                left: "15%",
                top: "30%",
              }}
            >
              <Calendar />
            </Card>
          </Grid>
        </>
      ) : (
        <h2 className="center">Log in to view page</h2>
      )}
    </>
  );
}
