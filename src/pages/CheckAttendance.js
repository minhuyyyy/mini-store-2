import React, { useContext, useEffect, useState } from "react";
import { Card, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { uid } from "uid";
import { toast } from "react-toastify";
export function CheckAttendanceForm({ imgSrc }) {
  const [imageUrl, setImageUrl] = useState("");
  const [currentUser, setCurrentUser] = useState([]);
  const [data, setData] = useState({
    id: uid(10),
    empID: "",
    imageUrl: "",
    dateTime: "",
  });
  const { user } = useContext(AuthContext);
  const now = new Date();
  const date = now.getTime();
  useEffect(() => {
    checkUser();
  }, [user]);

  const checkUser = () => {
    setCurrentUser(user ? user : []);
  };

  const onSubmit = () => {
    if (imgSrc) {
      handleSubmit();
    } else {
      toast.error("Take a picture first");
    }
  };

  const handleSubmit = async () => {
    const response = await axios.post("http://localhost:3000/check-in", {
      id: data.id,
      empID: user.id,
      date: date,
      imageUrl: imgSrc,
    });
    if (response.status == 201) toast.success("Attendance taken successfully");
    else toast.error("Something went wrong");
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
