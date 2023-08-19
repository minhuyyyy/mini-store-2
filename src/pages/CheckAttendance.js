import React, { useContext, useEffect, useState } from "react";
import { Card, Grid, Button } from "@mui/material";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

export function CheckAttendanceForm({ imgSrc }) {
  const { user } = useContext(AuthContext);
  const [currentUser, setCurrentUser] = useState(user);
  const [shifts, setShifts] = useState([]);
  const [selectedShift, setSelectedShift] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    fetchShift();
  }, []);

  const fetchShift = async () => {
    try {
      const response = await axios.get(
        `http://vps.akabom.me/api/work-shift/${user.id}?startDate=${new Date()
          .toISOString()
          .substring(0, 10)}&endDate=${new Date()
          .toISOString()
          .substring(0, 10)}`
      );
      if (response.status === 200) {
        console.log(response.data);
        setShifts(response.data); // Wrap the response data in an array
      }
    } catch (error) {
      console.error("Error fetching shift data:", error);
    }
  };

  const onCheckIn = () => {
    if (imgSrc) {
      handleCheckIn();
    } else {
      toast.error("Take a picture first");
    }
  };

  const handleCheckIn = async () => {
    const response = await axios.post("http://vps.akabom.me/api/checkin", {
      employeeId: user.id,
      dateTime: "2023-08-20T17:00:00.0000000Z",
      imageData: imgSrc,
      workshiftId: selectedShift,
    });
    if (response.status == 200) {
      Cookies.set("check-in", `${selectedShift}`);
      navigate("/");
      window.location.reload();
      toast.success("Attendance taken successfully");
    } else toast.error("Something went wrong");
  };

  return (
    <div>
      {currentUser && shifts != null ? (
        shifts.map((shift) => (
          <div key={shift.id}>
            <h2>Check In</h2>
            <p>Select a shift to check in</p>
            <Button onClick={() => setSelectedShift(shift.id)}>
              {shift.id}
            </Button>
            <p>Take a picture of you at the store</p>
            {selectedShift && (
              <Button onClick={onCheckIn} variant="contained" color="primary">
                Check In
              </Button>
            )}
          </div>
        ))
      ) : (
        <h2>Login to check in</h2>
      )}
    </div>
  );
}

function CheckAttendance({ imgSrc }) {
  return (
    <Grid container justifyContent="center">
      <Card
        style={{
          marginTop: "180px",
          height: "100%",
          width: "70%",
          transform: "translate(20%, -50%)",
        }}
      >
        <CheckAttendanceForm imgSrc={imgSrc} />
      </Card>
    </Grid>
  );
}

export default CheckAttendance;
