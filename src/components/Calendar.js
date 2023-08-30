import React, { useEffect, useState } from "react";
import {
  format,
  subWeeks,
  addWeeks,
  startOfWeek,
  addDays,
  isSameDay,
} from "date-fns";
import "./Calendar.css";
import { RegisterWorkShiftForm } from "../pages/RegisterWorkShift";

const Calendar = () => {
  const [currentWeekStart, setCurrentWeekStart] = useState(
    startOfWeek(new Date())
  );
  const [selectedDate, setSelectedDate] = useState("");
  const [openShiftMenu, setOpenShiftMenu] = useState(false);

  useEffect(() => {
    if (selectedDate) {
      onDateClickHandle(selectedDate);
      setOpenShiftMenu(!openShiftMenu);
    }
  }, [selectedDate]);

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
    console.log(selectedDate);
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
    const today = new Date();
    let startDate = currentWeekStart;
    for (let i = 0; i < 7; i++) {
      const day = addDays(startDate, i);
      days.push(
        <div
          className={`col cell ${
            isSameDay(day, today)
              ? "today"
              : isSameDay(day, selectedDate)
              ? "selected"
              : ""
          }`}
          key={day}
          onClick={() => onDateClickHandle(day)}
        >
          <span className={`number ${day < today ? "past-day" : ""}`}>
            {format(day, "d")}
          </span>
        </div>
      );
    }
    return <div className="days row">{days}</div>;
  };

  return (
    <div className="calendar container" style={{ width: "100%" }}>
      {renderHeader()}
      {renderWeekdays()}
      {renderCells()}
      {openShiftMenu && <RegisterWorkShiftForm selectedDate={selectedDate} />}
    </div>
  );
};

export default Calendar;
