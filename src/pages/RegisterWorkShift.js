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
import Calendar from "../components/Calendar";
import axios from "axios";
import { addDays } from "date-fns";

export function RegisterWorkShiftForm({ selectedDate }) {
  const { user } = useContext(AuthContext);
  const [ID, setID] = useState(user?.id || "");
  const [selectedShifts, setSelectedShifts] = useState([]);
  const [workshiftType, setWorkshiftType] = useState([]);
  const [dates, setDates] = useState([]); // Change 'date' to 'dates' here

  const SalerShifts = [
    { id: 1, time: "6.00-12.00", type: "shift-1" },
    { id: 2, time: "12:00 - 18:00", type: "shift-2" },
    { id: 3, time: "18:00 - 6:00", type: "shift-3" },
  ];

  const GuardShifts = [
    { id: 1, time: "6.00-18.00", type: "shift-1" },
    { id: 2, time: "18:00 - 6:00", type: "shift-2" },
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
    setWorkshiftType(
      selectedShifts.map((shift) => {
        const shiftType = user.position === "Guard" ? "guard-" : "saler-";
        return shiftType + shift;
      })
    );
  }, [selectedShifts, user.position]);

  useEffect(() => {
    if (selectedDate) {
      console.log(selectedDate);
      setDates([...dates, selectedDate]);
    }
  }, [selectedDate]);

  useEffect(() => {
    setID(user?.id || "");
  }, [user]);

  const handleTimeChange = (event) => {
    setSelectedShifts(event.target.value);
  };

  const handleSubmit = async () => {
    const formattedSelectedDate = new Date(selectedDate);
    const workshifts = workshiftType.map((type) => ({
      startDate: addDays(formattedSelectedDate, 1),
      endDate: addDays(formattedSelectedDate, 1),
      workshiftType: type,
    }));

    const response = await axios.post("http://vps.akabom.me/api/work-shift", {
      employeeId: ID,
      workshifts: workshifts,
    });

    // Handle the response as needed
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
            value={selectedShifts}
            multiple
            onChange={handleTimeChange}
            label="Select Shift"
          >
            {user.position === "Guard"
              ? GuardShifts.map((shift) => (
                  <MenuItem key={shift.type} value={shift.type}>
                    {shift.time}
                  </MenuItem>
                ))
              : SalerShifts.map((shift) => (
                  <MenuItem key={shift.type} value={shift.type}>
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
