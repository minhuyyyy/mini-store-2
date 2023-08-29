import { useState } from "react";
import HeaderCalender from "./components/header-calender";
import { addDays, addWeeks, format, startOfWeek, subWeeks } from "date-fns";
import { useEffect } from "react";
import "./Calendar.css";
import ViewShifts from "./components/ViewShifts";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

export default function ApproveWorksheets() {
  const [currentWeekStart, setCurrentWeekStart] = useState(
    startOfWeek(new Date())
  );
  const [selectedDate, setSelectedDate] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const { user } = useContext(AuthContext);
  
  useEffect(() => {
    console.log(currentWeekStart);
    setStartDate(format(currentWeekStart, "yyyy-MM-dd"));
    setEndDate(format(addDays(currentWeekStart, 6), "yyyy-MM-dd"));
  }, [currentWeekStart]);

  const changeWeekHandle = (btnType) => {
    if (btnType === "prev") {
      setCurrentWeekStart(subWeeks(currentWeekStart, 1));
    }
    if (btnType === "next") {
      setCurrentWeekStart(addWeeks(currentWeekStart, 1));
    }
  };

  const renderHeader = () => {
    const dateFormat = "MMM d, yyyy";
    return (
      <div className="header row flex-middle">
        <div className="col col-start center">
          <div className="icon" onClick={() => changeWeekHandle("prev")}>
            &lt;
          </div>
        </div>
        <div className="col col-center center">
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
          key={day}
          // onClick={() => onDateClickHandle(day)}
        >
          <span className={`number ${day < today ? "past-day" : ""}`}>
            {format(day, "d")}
          </span>
        </div>
      );
    }
    return <div className="days row center">{days}</div>;
  };

  return (
    <>
      {user ? (
        <div className="calendar container" style={{ width: "100%" }}>
          {renderHeader()}
          {renderWeekdays()}
          {renderCells()}
          <ViewShifts startDate={startDate} endDate={endDate} />
        </div>
      ) : (
        <h1>Not authorized</h1>
      )}
    </>
  );
}
