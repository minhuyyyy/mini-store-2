import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import "./checkin-checkout.css";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { toast } from "react-toastify";
import getLocaLTime from "../../ultility/localTime";
import TableWorkshifts from "./components/table-workshifts";
import TakePhoto from "./components/take-photo";

export default function CheckinCheckout() {
  const [imgSrc, setImgSrc] = useState(null);
  const webcamRef = useRef(null);
  const [worksheets, setWorksheets] = useState([]);
  const [user] = useState(JSON.parse(sessionStorage.getItem("user")));
  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    fetchShift();
  }, []);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImgSrc(imageSrc);
  }, [webcamRef]);

  const fetchShift = async () => {
    try {
      const date = new Date().toISOString().substring(0, 10);

      const response = await axios({
        method: "get",
        url: `${API_URL}/work-shift/${user.id}?startDate=${date}&endDate=${date}`,
      });

      console.log(response);
      if (response.status === 200) {
        console.log(response);
        setWorksheets(response.data); // Wrap the response data in an array
      } else if (response.status === 204) {
        console.log(response);
        setWorksheets([]);
      }
    } catch (error) {
      console.error("Error fetching shift data:", error);
    }
  };
  const handleCheckInCheckOut = async (type, workshiftId) => {
    // if (!user) {
    //   user = JSON.parse(sessionStorage.getItem("user"));
    // }

    const date = getLocaLTime();
    console.log(date);
    const response = await axios
      .post(`${API_URL}/${type}`, {
        employeeId: user.id,
        dateTime: date,
        imageData: imgSrc,
        workshiftId: workshiftId,
      })
      .catch((error) => {
        console.log(error.response);
        return error.response;
      });

    if (response.status === 200) {
      toast.success(response.data.message);
      fetchShift();
    } else if (response.status === 400) toast.error(response.data.message);
    else toast.error("Something went wrong");
    setImgSrc(null);
  };

  const onCheckIn = (workshiftId) => {
    if (imgSrc) {
      handleCheckInCheckOut("checkin", workshiftId);
    } else {
      toast.error("Take a picture first");
    }
  };

  const onCheckOut = (workshiftId) => {
    if (imgSrc) {
      handleCheckInCheckOut("checkout", workshiftId);
    } else {
      toast.error("Take a picture first");
    }
  };

  return (
    <div>
      <h1>Checkin Checkout</h1>

      <div className="webcam">
        <TakePhoto
          webcamRef={webcamRef}
          imgSrc={imgSrc}
          setImgSrc={setImgSrc}
          capture={capture}
        />
      </div>
      <TableWorkshifts
        workshifts={worksheets}
        onCheckIn={onCheckIn}
        onCheckOut={onCheckOut}
      />
    </div>
  );
}
