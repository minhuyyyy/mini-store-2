import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

function ViewWorkShift() {
  const { user } = useContext(AuthContext);
  const [data, setData] = useState([]);
  useEffect(() => {
    fetchShifts();
  }, [data]);
  const fetchShifts = async () => {
    const response = await axios.get(
      `http://vps.akabom.me/api/work-shift/${
        user.id
      }?startDate=${new Date()}&endDate=${new Date().getUTCDate() + 7}`
    );
    if (response.status == 200) {
      setData(response.data);
      console.log(data);
    }
  };
  return <div>ViewWorkShift</div>;
}

export default ViewWorkShift;
