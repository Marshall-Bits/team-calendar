
import { useState, useEffect, useCallback } from "react";
import supabase from "../supabase/config";

const useFetchData = (selectedTeam, selectedDay) => {
  const [teams, setTeams] = useState([]);
  const [todos, setTodos] = useState([]);

  const fetchTeams = useCallback(async () => {
    const { data, error } = await supabase.from("teams").select("*");
    if (error) {
      console.error("Error fetching teams", error);
    } else {
      setTeams(data);
    }
  }, []);

  const fetchTodos = useCallback(async () => {
    if (!selectedTeam) {
      setTodos([]);
      return;
    }
    const { data, error } = await supabase
      .from("todos")
      .select("*")
      .eq("team", selectedTeam)
      .order("is_done", { ascending: true });
    if (error) {
      console.error("Error fetching todos", error);
    } else {
      setTodos(data);
    }
  }, [selectedTeam]);

  useEffect(() => {
    fetchTeams();
  }, [fetchTeams]);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  return { teams, todos, fetchTodos };
};

export default useFetchData;