import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import {
  format,
  subWeeks,
  addWeeks,
  startOfWeek,
  addDays,
  isSameDay,
} from "date-fns";
import "../components/Calendar.css";

function ViewWorkShift() {
  const { user } = useContext(AuthContext);
  const [data, setData] = useState([]);
  const [ID, setID] = useState(user?.id || "");
  const [currentWeekStart, setCurrentWeekStart] = useState(
    startOfWeek(new Date())
  );
  const [selectedDate, setSelectedDate] = useState("");
  useEffect(() => {
    if (selectedDate) {
      onDateClickHandle(selectedDate);
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

  // Calculate next 7 days from the current date
  const currentDate = new Date();
  const nextSevenDays = new Date(currentDate);
  nextSevenDays.setDate(currentDate.getDate() + 7);

  useEffect(() => {
    fetchShifts();
  }, [user, currentWeekStart]); // Also trigger on currentWeekStart change

  useEffect(() => {
    if (user) {
      setID(user?.id || "");
    }
  }, [user]);

  const fetchShifts = async () => {
    const response = await axios.get(
      `http://vps.akabom.me/api/work-shift/${
        user.id
      }?startDate=${currentWeekStart
        .toISOString()
        .slice(0, 10)}&endDate=${nextSevenDays.toISOString().slice(0, 10)}`
    );
    if (response.status === 200) {
      setData(response.data);
      console.log(response.data);
    }
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

  // const renderCells = () => {
  //   const daysWithShifts = [];
  //   const today = new Date();
  //   let startDate = currentWeekStart;

  //   for (let i = 0; i < 7; i++) {
  //     const day = addDays(startDate, i);
  //     const hasShift = data.some((shift) =>
  //       isSameDay(new Date(shift.startDate), day)
  //     );
  //     const shiftsForDay = data
  //       .filter((shift) => isSameDay(new Date(shift.startDate), day))
  //       .map((shift) => shift.startDate);

  //     daysWithShifts.push(
  //       <div key={day} className="day-with-shifts">
  //         <div
  //           className={`col cell ${
  //             isSameDay(day, today)
  //               ? "today"
  //               : isSameDay(day, selectedDate)
  //               ? "selected"
  //               : ""
  //           }`}
  //           key={day}
  //           onClick={() => onDateClickHandle(day)}
  //         >
  //           <span
  //             className={`number ${day < today ? "past-day" : ""}`}
  //             style={{ marginRight: 5 }}
  //           >
  //             {format(day, "d")}
  //           </span>
  //           {hasShift && (
  //             <div className="shifts-container">
  //               {shiftsForDay.map((shift, index) => (
  //                 <span key={index} className="shift-type">
  //                   {data.find(
  //                     (shiftData) =>
  //                       shiftData.startDate === shift &&
  //                       shiftData.approvalStatusId === 2
  //                   ) && (
  //                     <span
  //                       className="approved-shift"
  //                       style={{ display: "block", marginTop: 5 }}
  //                     >
  //                       {shift.split("T")[1]}
  //                     </span>
  //                   )}
  //                 </span>
  //               ))}
  //             </div>
  //           )}
  //         </div>
  //       </div>
  //     );
  //   }

  //   return <div className="days-with-shifts-container">{daysWithShifts}</div>;
  // };

  const renderCells = () => {
    const days = [];
    const shiftsRows = [];
    const today = new Date();
    let startDate = currentWeekStart;

    for (let i = 0; i < 7; i++) {
      const day = addDays(startDate, i);
      const hasShift = data.some((shift) =>
        isSameDay(new Date(shift.startDate), day)
      );
      const shiftsForDay = data
        .filter((shift) => isSameDay(new Date(shift.startDate), day))
        .map((shift) => shift.startDate);

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
          <span
            className={`number ${day < today ? "past-day" : ""}`}
            style={{ marginRight: 5 }}
          >
            {format(day, "d")}
          </span>
        </div>
      );

      if (hasShift) {
        shiftsRows.push(
          <div
            className="shifts-row"
            key={`${day}-shifts`}
            style={{ marginTop: 10 }}
          >
            {shiftsForDay.map((shift, index) => (
              <span key={index} className="shift-type">
                {data.find(
                  (shiftData) =>
                    shiftData.startDate === shift &&
                    shiftData.approvalStatusId === 2
                ) && (
                  <span className="approved-shift" style={{ display: "block" }}>
                    {shift.split("T")[1]}
                  </span>
                )}
              </span>
            ))}
          </div>
        );
      }
    }

    return (
      <>
        <div className="days row">{days}</div>
        <div className="shifts-rows-container">{shiftsRows}</div>
      </>
    );
  };

  return (
    <div className="calendar container" style={{ width: "100%" }}>
      {renderHeader()}
      {renderWeekdays()}
      {renderCells()}
    </div>
  );
}

export default ViewWorkShift;
