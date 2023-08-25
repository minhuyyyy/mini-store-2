import React, { useContext, useState } from "react";
import { Button, FormControl, Input, TextField } from "@mui/material";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import CalculateSalary from "../pages/CalculateSalary";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function GetSalary() {
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    employeeId: "",
    base: "",
    month: "",
    year: "",
    startDate: "",
    endDate: "",
  });

  const [data, setData] = useState(null);
  const [sent, isSent] = useState(false);

  const API_URL = process.env.REACT_APP_API_URL;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleStartDateChange = (date) => {
    if (date instanceof Date) {
      const formattedDate = date.toISOString().split("T")[0];
      setFormData((prevState) => ({
        ...prevState,
        startDate: formattedDate,
      }));
    }
  };

  const handleEndDateChange = (date) => {
    if (date instanceof Date) {
      const formattedDate = date.toISOString().split("T")[0];
      setFormData((prevState) => ({
        ...prevState,
        endDate: formattedDate,
      }));
    }
  };

  const fetchData = async () => {
    const response = await axios.post(`${API_URL}/salary`, {
      employeeId: formData.employeeId,
      baseSalaryPerHour: formData.base,
      month: formData.month,
      year: formData.year,
      startDate: formData.startDate,
      endDate: formData.endDate,
    });
    if (response.status === 200) {
      isSent(true);
      setData(response.data);
    }
  };

  return (
    <div className="container">
      <div>
        <FormControl sx={{ width: "80%" }}>
          <label>Employee ID:</label>
          <Input
            id="employeeId"
            name="employeeId"
            variant="standard"
            value={formData.employeeId}
            onChange={handleInputChange}
          />
          <br />
        </FormControl>
      </div>
      <div>
        <FormControl sx={{ width: "80%" }}>
          <label>Base salary per hour:</label>
          <Input
            id="baseSalary"
            name="base"
            variant="standard"
            value={formData.base}
            onChange={handleInputChange}
          />
          <br />
        </FormControl>
      </div>
      <div>
        <FormControl
          sx={{
            width: "80%",
            display: "inline",
          }}
        >
          <label style={{ marginRight: "10px" }}>Month:</label>
          <Input
            sx={{ marginRight: "20px" }}
            id="month"
            name="month"
            variant="standard"
            value={formData.month}
            onChange={handleInputChange}
          />

          <label style={{ marginRight: "10px" }}>Year:</label>
          <Input
            id="year"
            name="year"
            variant="standard"
            value={formData.year}
            onChange={handleInputChange}
          />
          <br />
        </FormControl>
      </div>
      <div>
        <label>Start Date:</label>
        <DatePicker
          selected={formData.startDate ? new Date(formData.startDate) : null}
          onChange={handleStartDateChange}
          dateFormat="yyyy-MM-dd"
        />
        <br />
      </div>
      <div>
        <label>End Date:</label>
        <DatePicker
          selected={formData.endDate ? new Date(formData.endDate) : null}
          onChange={handleEndDateChange}
          dateFormat="yyyy-MM-dd"
        />
        <br />
      </div>
      <Button onClick={fetchData} variant="contained">
        Load
      </Button>
      {sent && <CalculateSalary setData={setData} data={data} />}
    </div>
  );
}

export default GetSalary;
