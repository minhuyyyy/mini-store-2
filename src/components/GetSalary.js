import { Button, FormControl, Input } from "@mui/material";
import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import CalculateSalary from "../pages/CalculateSalary";

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

  const fetchData = async () => {
    const response = await axios.post(`${API_URL}/api/salary`, {
      employeeId: formData.employeeId,
      baseSalaryPerHour: formData.base,
      month: formData.month,
      year: formData.year,
      startDate: new Date(formData.startDate),
      endDate: new Date(formData.endDate),
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
        <FormControl sx={{ width: "80%" }}>
          <label>Start Date:</label>
          <Input
            id="startDate"
            name="startDate"
            variant="standard"
            value={formData.startDate}
            onChange={handleInputChange}
          />
          <br />
        </FormControl>
      </div>
      <div>
        <FormControl sx={{ width: "80%" }}>
          <label>End Date:</label>
          <Input
            id="endDate"
            name="endDate"
            variant="standard"
            value={formData.endDate}
            onChange={handleInputChange}
          />
          <br />
        </FormControl>
      </div>
      <Button onClick={fetchData} variant="contained">
        Load
      </Button>
      {sent && <CalculateSalary setData={setData} data={data} />}
    </div>
  );
}

export default GetSalary;
