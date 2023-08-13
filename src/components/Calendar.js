import React, { useState } from "react";
import {
  format,
  subWeeks,
  addWeeks,
  startOfWeek,
  addDays,
  isSameDay,
} from "date-fns";
import "./Calendar.css"; // Import the custom CSS file
import { MenuItem, Select } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Button } from "bootstrap";
const WeekCalendar = () => {
  const [currentWeekStart, setCurrentWeekStart] = useState(
    startOfWeek(new Date())
  );
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [openShiftMenu, setOpenShiftMenu] = useState(false);
  const [time, setTime] = useState("");
  const changeWeekHandle = (btnType) => {
    if (btnType === "prev") {
      setCurrentWeekStart(subWeeks(currentWeekStart, 1));
    }
    if (btnType === "next") {
      setCurrentWeekStart(addWeeks(currentWeekStart, 1));
    }
  };

  const onDateClickHandle = (day) => {
    setSelectedDate(day);
    console.log(day);
    setOpenShiftMenu(true);
  };

  const renderShiftsMenu = () => {
    const columns = [
      { field: "id", headerName: "ID", width: 70 },
      { field: "time", headerName: "Time", width: 130 },
    ];

    const rows = [
      { id: 1, time: "6.00-12.00" },
      { id: 2, time: "12.00-18.00" },
      { id: 3, time: "18.00-6.00" },
    ];

    const handleSelectionModelChange = (selectionModel) => {
      // Handle the selected rows based on selectionModel
      const selectedRows = rows.filter((row, index) =>
        selectionModel.includes(index + 1)
      );
      // Now you have an array of selected rows, you can process them as needed
      console.log(selectedRows);
    };

    const handleSubmit = () => {
      
    }

    const handleTimeSelect = (time) => {};

    return (
      <div style={{ height: 400, width: "100%", marginTop: "200px" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 5 },
            },
          }}
          rowSelection="multiple"
          pageSizeOptions={[5, 10]}
          onRowSelectionModelChange={handleSelectionModelChange}
          checkboxSelection
        />
        <Button onClick={handleSubmit}>Submit</Button>
      </div>
    );
  };

  const renderHeader = () => {
    const dateFormat = "MMM d, yyyy";
    return (
      <div className="header row flex-middle">
        <div className="col col-start">
          <div className="icon" onClick={() => changeWeekHandle("prev")}>
            &lt;
          </div>
        </div>
        <div className="col col-center">
          <span>{format(currentWeekStart, dateFormat)}</span>
        </div>
        <div className="col col-end">
          <div className="icon" onClick={() => changeWeekHandle("next")}>
            &gt;
          </div>
        </div>
      </div>
    );
  };

  const renderWeekdays = () => {
    const days = [];
    let startDate = currentWeekStart;
    for (let i = 0; i < 7; i++) {
      days.push(
        <div className="col col-center weekday" key={i}>
          {format(addDays(startDate, i), "EEE")}
        </div>
      );
    }
    return <div className="days row weekdays">{days}</div>;
  };

  const renderCells = () => {
    const days = [];
    let startDate = currentWeekStart;
    for (let i = 0; i < 7; i++) {
      const day = addDays(startDate, i);
      days.push(
        <div
          className={`col cell ${
            isSameDay(day, new Date())
              ? "today"
              : isSameDay(day, selectedDate)
              ? "selected"
              : ""
          }`}
          key={day}
          onClick={() => onDateClickHandle(day)}
          style={{ marginBottom: "100px" }}
        >
          <span className="number">{format(day, "d")}</span>
        </div>
      );
    }
    return <div className="days row">{days}</div>;
  };

  return (
    <div className="calendar" style={{ width: "100%" }}>
      {renderHeader()}
      {renderWeekdays()}
      {renderCells()}
      {openShiftMenu && renderShiftsMenu()}
    </div>
  );
};

export default WeekCalendar;
