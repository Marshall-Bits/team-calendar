import React, { useState } from "react";
import supabase from "../supabase/config";

const Calendar = ({ currentMonth, todos, selectedTeam, setSelectedDay, fetchTodos, addToast }) => {
  const daysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const firstDayOfMonth = (year, month) => {
    return (new Date(year, month, 1).getDay() + 6) % 7;
  };

  const [dragOverDay, setDragOverDay] = useState(null);

  const handleDragStart = (e, todo) => {
    e.dataTransfer.setData("todoId", todo.id);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDragEnter = (e, dayString) => {
    e.preventDefault();
    setDragOverDay(dayString);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOverDay(null);
  };

  const handleDrop = async (e, dayString) => {
    e.preventDefault();
    const todoId = e.dataTransfer.getData("todoId");
    if (todoId) {
      const { error } = await supabase
        .from("todos")
        .update({ date: dayString })
        .eq("id", todoId);
      if (error) {
        console.error("Error updating todo date", error);
        addToast("Error al mover la tarea", "error");
      } else {
        fetchTodos();
        addToast("Tarea movida correctamente", "success");
      }
    }
    setDragOverDay(null);
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
          className={`day ${dragOverDay === dayString ? 'drag-over' : ''}`}
          key={day}
          onClick={() =>
            selectedTeam && setSelectedDay({ date: dayString, tasks: dayTodos })
          }
          onDragOver={handleDragOver}
          onDragEnter={(e) => handleDragEnter(e, dayString)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, dayString)}
        >
          <header>{day}</header>
          <div className="day-container">
            {dayTodos.map((todo) => (
              <div
                key={todo.id}
                className={`todo-item ${todo.is_done && "done"}`}
                draggable
                onDragStart={(e) => handleDragStart(e, todo)}
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

  return (
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
  );
};

export default Calendar;