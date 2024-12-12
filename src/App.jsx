import { useEffect, useState } from "react";
import supabase from "./supabase/config";
import "./App.css";
import DayDetails from "./components/DayDetails";

const App = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState("");
  const [todos, setTodos] = useState([]);
  const [toast, setToast] = useState({ message: "", type: "" });

  const fetchTeams = async () => {
    const { data, error } = await supabase.from("teams").select("*");
    if (error) console.error("Error fetching teams", error);
    setTeams(data);
  };

  const fetchTodos = async () => {
    const { data, error } = await supabase
      .from("todos")
      .select("*")
      .eq("team", selectedTeam)
      .order("is_done", { ascending: true });
    if (error) console.error("Error fetching todos", error);
    setTodos(data);

    if (selectedDay) {
      const updatedTasks = data.filter(
        (todo) => todo.date === selectedDay.date
      );
      setSelectedDay({ ...selectedDay, tasks: updatedTasks });
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  useEffect(() => {
    if (selectedTeam) {
      fetchTodos();
      setSelectedDay(null);
    } else {
      setTodos([]);
      setSelectedDay(null);
    }
  }, [selectedTeam]);

  const months = Array.from({ length: 12 }, (e, i) =>
    new Date(0, i).toLocaleString("default", { month: "long" })
  );

  const years = [];
  for (let i = 2020; i <= 2030; i++) {
    years.push(i);
  }

  const handleMonthChange = (event) => {
    const newMonth = parseInt(event.target.value, 10);
    setCurrentMonth(new Date(currentMonth.getFullYear(), newMonth));
  };

  const handleYearChange = (event) => {
    const newYear = parseInt(event.target.value, 10);
    setCurrentMonth(new Date(newYear, currentMonth.getMonth()));
  };

  const nextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)
    );
  };

  const prevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)
    );
  };

  const daysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const firstDayOfMonth = (year, month) => {
    return (new Date(year, month, 1).getDay() + 6) % 7;
  };

  const generateCalendar = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const numDays = daysInMonth(year, month);
    const startDay = firstDayOfMonth(year, month);

    const calendarDays = [];
    for (let i = 0; i < startDay; i++) {
      calendarDays.push(<div key={`empty-${i}`} className="empty"></div>);
    }
    for (let day = 1; day <= numDays; day++) {
      const dayString = `${year}-${String(month + 1).padStart(2, "0")}-${String(
        day
      ).padStart(2, "0")}`;
      const dayTodos = todos.filter((todo) => todo.date === dayString);

      calendarDays.push(
        <article
          className="day"
          key={day}
          onClick={() =>
            selectedTeam && setSelectedDay({ date: dayString, tasks: dayTodos })
          }
        >
          <header>{day}</header>
          <div className="day-container">
            {dayTodos.map((todo) => (
              <div
                key={todo.id}
                className={`todo-item ${todo.is_done && "done"}`}
              >
                {todo.title}
              </div>
            ))}
          </div>
        </article>
      );
    }
    return calendarDays;
  };

  const closeModal = () => {
    setSelectedDay(null);
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
        <select value={currentMonth.getFullYear()} onChange={handleYearChange}>
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
        <h2>
          {currentMonth.toLocaleString("default", {
            month: "long",
            year: "numeric",
          })}
        </h2>
      </div>
      <div className="calendar-grid">
        <div className="day-label">Lunes</div>
        <div className="day-label">Martes</div>
        <div className="day-label">Miércoles</div>
        <div className="day-label">Jueves</div>
        <div className="day-label">Viernes</div>
        <div className="day-label">Sábado</div>
        <div className="day-label">Domingo</div>
        {generateCalendar()}
      </div>
      <DayDetails
        fetchTodos={fetchTodos}
        selectedTeam={selectedTeam}
        day={selectedDay}
        formatDate={currentMonth.toLocaleString("default", {
          month: "long",
          year: "numeric",
        })}
        onClose={closeModal}
        addToast={addToast}
      />
      {toast.message && (
        <div className={`toast ${toast.type}`}>{toast.message}</div>
      )}
    </div>
  );
};

export default App;
