import { addDays, addWeeks, format, subWeeks } from "date-fns";

export default function HeaderCalender({
  currentWeekStart,
  setCurrentWeekStart,
}) {
  const dateFormat = "MMM d, yyyy";
  const days = [];
  let startDate = currentWeekStart;

  const changeWeekHandle = (btnType) => {
    if (btnType === "prev") {
      setCurrentWeekStart(subWeeks(currentWeekStart, 1));
    }
    if (btnType === "next") {
      setCurrentWeekStart(addWeeks(currentWeekStart, 1));
    }
  };

  const renderWeekdays = () => {
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
        <div key={day}>
          <span className={`number ${day < today ? "past-day" : ""}`}>
            {format(day, "d")}
          </span>
        </div>
      );
    }
    return <div className="days row">{days}</div>;
  };

  return (
    <>
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
      {renderWeekdays()}
      {renderCells()}
    </>
  );
}
