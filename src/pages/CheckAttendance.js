import React, { useContext, useEffect, useState } from "react";
import { Card, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { uid } from "uid";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
export function CheckAttendanceForm({ imgSrc }) {
  const [imageUrl, setImageUrl] = useState("");
  const [currentUser, setCurrentUser] = useState([]);
  const [shift, setShift] = useState([]);
  const [data, setData] = useState({
    id: uid(10),
    empID: "",
    imageUrl: "",
    dateTime: "",
  });
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const now = new Date();
  const date = now.toISOString();
  useEffect(() => {
    checkUser();
    fetchShift();
  }, [user]);

  const checkUser = () => {
    setCurrentUser(user ? user : []);
  };

  const fetchShift = async () => {
    const response = await axios.get(
      // `http://vps.akabom.me/api/work-shift/${user.id}?startDate=${new Date()
      //   .toISOString()
      //   .substring(0, 10)}&endDate=${new Date().toISOString().substring(0, 10)}`
      `http://vps.akabom.me/api/work-shift/${user.id}?startDate=2023-08-20&endDate=2023-08-20`
    );
    if (response.status == 200) {
      console.log(response.data[0]);
      setShift([...shift, response.data[0].id]);
    }
  };

  const onSubmit = () => {
    if (imgSrc) {
      handleSubmit();
    } else {
      toast.error("Take a picture first");
    }
  };

  const handleSubmit = async () => {
    const response = await axios.post("http://vps.akabom.me/api/checkin", {
      employeeId: user.id,
      dateTime: "2023-08-20T17:00:00.0000000Z",
      imageData: imgSrc,
      workshiftId: shift.toString(),
    });
    if (response.status == 200) {
      Cookies.set("check-in", `${shift.toString()}`);
      navigate("/");
      window.location.reload();
      toast.success("Attendance taken successfully");
    } else toast.error("Something went wrong");
  };

  return (
    <>
      {currentUser ? (
        <>
          <h2>Check In</h2>
          <span>
            <p>Take a picture of you at the store</p>
            <button onClick={onSubmit}>Check in</button>
          </span>
        </>
      ) : (
        <h2>Login to check in</h2>
      )}
    </>
  );
}

function CheckAttendance({ imgSrc }) {
  const [currentUser, setCurrentUser] = useState();
  const { user } = useContext(AuthContext);
  useEffect(() => {
    setCurrentUser(user);
  }, [user]);
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
              <CheckAttendanceForm imgSrc={imgSrc} />
            </Card>
          </Grid>
        </>
      ) : (
        <h2 className="center">Log in to view page</h2>
      )}
    </>
  );
}

export default CheckAttendance;
