import { useState } from "react";
import useFetchData from "./hooks/useFetchData";
import Calendar from "./components/Calendar";
import Toast from "./components/Toast";
import "./App.css";
import DayDetails from "./components/DayDetails";
import leftIcon from "./assets/left-icon.svg";
import rightIcon from "./assets/right-icon.svg";

const App = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState("");
  const [toast, setToast] = useState({ message: "", type: "" });
  const { teams, todos, fetchTodos } = useFetchData(selectedTeam);

  const months = Array.from({ length: 12 }, (e, i) =>
    new Date(0, i).toLocaleString("default", { month: "long" })
  );

  const years = [];

  const STARTING_YEAR = 2024;
  const ENDING_YEAR = 2025;

  for (let i = STARTING_YEAR; i <= ENDING_YEAR; i++) {
    years.push(i);
  }
  const handleNextPrevMonth = (direction) => {
    const newMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + direction
    );
    if (
      newMonth.getFullYear() > ENDING_YEAR ||
      newMonth.getFullYear() < STARTING_YEAR
    ) {
      return;
    }
    setCurrentMonth(newMonth);
  };

  const handleMonthChange = (event) => {
    const newMonth = parseInt(event.target.value, 10);
    setCurrentMonth(new Date(currentMonth.getFullYear(), newMonth));
  };

  const handleYearChange = (event) => {
    const newYear = parseInt(event.target.value, 10);
    setCurrentMonth(new Date(newYear, currentMonth.getMonth()));
  };

  const addToast = (message, type) => {
    setToast({ message, type });
    setTimeout(() => {
      setToast({ message: "", type: "" });
    }, 3000);
  };

  return (
    <div className="calendar">
      <div className="calendar-header">
        <section className="calendar-month-select">
          <button
            className="btn-nextprev"
            onClick={() => handleNextPrevMonth(-1)}
          >
            <img src={leftIcon} alt="Previous Month" />
          </button>
          <h2>
            {currentMonth.toLocaleString("default", {
              month: "long",
              year: "numeric",
            })}
          </h2>
          <button
            className="btn-nextprev"
            onClick={() => handleNextPrevMonth(1)}
          >
            <img src={rightIcon} alt="Next Month" />
          </button>
        </section>
        <section className="calendar-team-select">
          <select
            value={selectedTeam}
            onChange={(e) => setSelectedTeam(e.target.value)}
          >
            <option value="">Selecciona un equipo</option>
            {teams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>
          <select value={currentMonth.getMonth()} onChange={handleMonthChange}>
            {months.map((monthName, index) => (
              <option key={index} value={index}>
                {monthName}
              </option>
            ))}
          </select>
          <select
            value={currentMonth.getFullYear()}
            onChange={handleYearChange}
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </section>
      </div>
      <Calendar
        currentMonth={currentMonth}
        todos={todos}
        selectedTeam={selectedTeam}
        setSelectedDay={setSelectedDay}
      />
      {selectedDay && (
        <DayDetails
          fetchTodos={fetchTodos}
          selectedTeam={selectedTeam}
          todos={todos}
          selectedDay={selectedDay}
          setSelectedDay={setSelectedDay}
          onClose={() => setSelectedDay(null)}
          addToast={addToast}
        />
      )}
      <Toast message={toast.message} type={toast.type} />
    </div>
  );
};

export default App;
