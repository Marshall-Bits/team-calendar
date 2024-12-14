import React, { useState, useCallback, memo, useEffect } from "react";
import "./DayDetails.css";
import supabase from "../supabase/config";

const DayDetails = memo(
  ({
    selectedDay,
    onClose,
    fetchTodos,
    selectedTeam,
    addToast,
    setSelectedDay,
    todos,
  }) => {
    const [showInputs, setShowInputs] = useState(false);
    const [newTitle, setNewTitle] = useState("");
    const [newDescription, setNewDescription] = useState("");

    useEffect(() => {
      const updatedDay = {
        ...selectedDay,
        tasks: todos.filter((todo) => todo.date === selectedDay.date),
      };

      setSelectedDay(updatedDay);
    }, [todos]);

    const addTask = useCallback(async () => {
      const { data, error } = await supabase.from("todos").insert([
        {
          title: newTitle,
          description: newDescription,
          team: selectedTeam,
          date: selectedDay.date,
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
    }, [
      newTitle,
      newDescription,
      selectedTeam,
      selectedDay.date,
      fetchTodos,
      addToast,
    ]);

    const toggleTaskStatus = useCallback(
      async (taskId, currentStatus) => {
        const { data, error } = await supabase
          .from("todos")
          .update({ is_done: !currentStatus })
          .eq("id", taskId);
        if (error) {
          console.error("Error updating task status", error);
        } else {
          fetchTodos();
        }
      },
      [fetchTodos]
    );

    const handleDelete = useCallback(
      async (taskId) => {
        console.log(taskId);
        
        const { data, error } = await supabase
          .from("todos")
          .delete()
          .eq("id", taskId);
        if (error) {
          console.error("Error deleting task", error);
          addToast("Error al borrar la tarea", "error");
        } else {
          fetchTodos();
          addToast("Tarea eliminada correctamente 🚮", "success");
        }
      },
      [fetchTodos]
    );

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
              <h2>{selectedDay.date}</h2>
              {selectedDay.tasks.length > 0 ? (
                <ul>
                  {selectedDay.tasks.map((task) => (
                    <li
                      key={task.id}
                      className={task.is_done ? "completed" : ""}
                    >
                      <input
                        type="checkbox"
                        checked={task.is_done}
                        onChange={() => toggleTaskStatus(task.id, task.is_done)}
                      />
                      <strong>{task.title}</strong>: {task.description}
                      <button onClick={() => handleDelete(task.id)}>
                        Borrar
                      </button>
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
              <button
                className="btn-primary"
                onClick={() => setShowInputs(true)}
              >
                Agregar nueva tarea
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }
);

export default DayDetails;
