import { useState, useEffect, useCallback } from "react";
import supabase from "../supabase/config";

const useFetchData = (selectedTeam, selectedDay) => {
  const [teams, setTeams] = useState([]);
  const [todos, setTodos] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);

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
      .eq("team", selectedTeam);
    if (error) {
      console.error("Error fetching todos", error);
    } else {
      setTodos(data);
    }
  }, [selectedTeam]);

  const fetchTeamMembers = useCallback(async () => {
    if (!selectedTeam) {
      setTeamMembers([]);
      return;
    }
    const { data, error } = await supabase
      .from("team_members")
      .select("*")
      .eq("team", selectedTeam);
    if (error) {
      console.error("Error fetching team members", error);
    } else {
      setTeamMembers(data);
    }
  }, [selectedTeam]);

  useEffect(() => {
    fetchTeams();
  }, [fetchTeams]);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  useEffect(() => {
    fetchTeamMembers();
  }, [fetchTeamMembers]);

  return { teams, todos, teamMembers, fetchTodos };
};

export default useFetchData;
