import React, { useState } from "react";
import "./DayDetails.css";
import supabase from "../supabase/config";

const DayDetails = ({ day, onClose, fetchTodos, selectedTeam, addToast }) => {
  if (!day) return null;

  const [showInputs, setShowInputs] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");

  const addTask = async () => {
    const { data, error } = await supabase.from("todos").insert([
      {
        title: newTitle,
        description: newDescription,
        team: selectedTeam,
        date: day.date,
        is_done: false,
      },
    ]);
    if (error) {
      console.error("Error adding task", error);
      addToast("Error al agregar la tarea", "error");
    } else {
      setNewTitle("");
      setNewDescription("");
      setShowInputs(false);
      fetchTodos();
      addToast("Tarea agregada 😀", "success");
    }
  };

  const toggleTaskStatus = async (taskId, currentStatus) => {
    const { data, error } = await supabase
      .from("todos")
      .update({ is_done: !currentStatus })
      .eq("id", taskId);
    if (error) {
      console.error("Error updating task status", error);
    } else {
      fetchTodos();
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {showInputs ? (
          <div className="add-task-form">
            <h2>Agregar Nueva Tarea</h2>
            <input
              type="text"
              placeholder="Título"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
            <input
              type="text"
              placeholder="Descripción"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
            />
            <button onClick={addTask}>Guardar Tarea</button>
          </div>
        ) : (
          <>
            <h2>Detalles del Día {day.date}</h2>
            {day.tasks.length > 0 ? (
              <ul>
                {day.tasks.map((task) => (
                  <li key={task.id} className={task.is_done ? "completed" : ""}>
                    <input
                      type="checkbox"
                      checked={task.is_done}
                      onChange={() => toggleTaskStatus(task.id, task.is_done)}
                    />
                    <strong>{task.title}</strong>: {task.description}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No hay tareas para este día.</p>
            )}
          </>
        )}
        <div className="buttons-modal">
          <button className="btn-secondary" onClick={onClose}>
            Cerrar
          </button>
          {!showInputs && (
            <button className="btn-primary" onClick={() => setShowInputs(true)}>
              Agregar nueva tarea
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DayDetails;
