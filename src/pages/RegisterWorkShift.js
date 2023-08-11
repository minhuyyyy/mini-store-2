import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
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
import { db } from "../db/dbConfig";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import env from "react-dotenv";
import Calendar from "../components/Calendar";
function RegisterWorkShiftForm() {
  const { user } = useContext(AuthContext);
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

  const getData = async () => {
    const q = query(
      collection(db, `${env.REACT_APP_USER_DB_URL}`),
      where("ID", "==", ID)
    );
    const snapshot = await getDocs(q);
    snapshot.forEach((doc) => {
      setDocID(doc.id);
      const newData = doc.data();
      setOT(newData.OT);
      setFormData({
        workHours: newData.workHours,
        OT: newData.OT,
      });
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await getData();
    const userDocRef = doc(db, `${env.REACT_APP_USER_DB_URL}/${docID}`);

    if (formData.OT < 0) {
      alert("Overtime hours must be non-negative");
      return;
    }

    const startTime = parseInt(selectedTime.split("-")[0]);
    const endTime = parseInt(selectedTime.split("-")[1]);

    const workHours = endTime - startTime;

    if (isNaN(workHours)) {
      alert("Invalid time format");
      return;
    }

    try {
      const batch = writeBatch(db);
      batch.update(userDocRef, {
        workHours: workHours + formData.workHours,
        OT: Number(formData.OT) + Number(OT),
        workDays: arrayUnion(now.toDateString()),
      });
      await batch.commit();
      toast.success(
        "Work shift regitered successfully. Wait for manager's confirmation"
      );
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

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
        Register Work Shift
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
            {user.role === "Saler" ? (
              <>
                <MenuItem value="6:00 - 12:00">6:00 - 12:00</MenuItem>
                <MenuItem value="12:00 - 18:00">12:00 - 18:00</MenuItem>
                <MenuItem value="18:00 - 6:00">18:00 - 6:00</MenuItem>
              </>
            ) : (
              <>
                <MenuItem value="6:00 - 18:00">6:00 - 18:00</MenuItem>
                <MenuItem value="18:00 - 6:00">18:00 - 6:00</MenuItem>
              </>
            )}
          </Select>
        </FormControl>
        <br />
        <Button variant="contained" color="primary" type="submit">
          Submit
        </Button>
      </form>
    </CardContent>
  );
}

function RegisterWorkShift() {
  const { user } = useContext(AuthContext);

  return (
    <>
      {user ? (
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
              {/* <RegisterWorkShiftForm /> */}
            </Card>
          </Grid>
          <Grid justify="center">
            <Card
              style={{
                height: "50%",
                width: "70%",
                transform: "translate(20%, -50%)",
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

export default RegisterWorkShift;
