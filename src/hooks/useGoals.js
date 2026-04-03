import { useState, useEffect } from "react";
import api from "../api";

export default function useGoals() {
  const [goals, setGoals] = useState([]);
  const [archivedGoals, setArchivedGoals] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchGoals() {
    try {
      const [active, archived] = await Promise.all([
        api.get("/api/goals"),
        api.get("/api/goals?archived=true"),
      ]);
      setGoals(active.data);
      setArchivedGoals(archived.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function createGoal(data) {
    const res = await api.post("/api/goals", data);
    setGoals((prev) => [res.data, ...prev]);
    return res.data;
  }

  async function updateGoal(id, data) {
    const res = await api.patch(`/api/goals/${id}`, data);
    setGoals((prev) => prev.map((g) => (g._id === id ? res.data : g)));
    return res.data;
  }

  async function deleteGoal(id) {
    await api.delete(`/api/goals/${id}`);
    setGoals((prev) => prev.filter((g) => g._id !== id));
    setArchivedGoals((prev) => prev.filter((g) => g._id !== id));
  }

  async function logDay(id, actual) {
    const res = await api.patch(`/api/goals/${id}/log-day`, { actual });
    setGoals((prev) => prev.map((g) => (g._id === id ? res.data : g)));
    return res.data;
  }

  async function unlogDay(id) {
    const res = await api.patch(`/api/goals/${id}/unlog-day`);
    setGoals((prev) => prev.map((g) => (g._id === id ? res.data : g)));
    return res.data;
  }

  async function overrideDay(id, day, newTarget) {
    const res = await api.patch(`/api/goals/${id}/override-day`, {
      day,
      newTarget,
    });
    setGoals((prev) => prev.map((g) => (g._id === id ? res.data : g)));
    return res.data;
  }

  async function archiveGoal(id) {
    const res = await api.patch(`/api/goals/${id}/archive`);
    // Move from active to archived
    setGoals((prev) => prev.filter((g) => g._id !== id));
    setArchivedGoals((prev) => [res.data, ...prev]);
    return res.data;
  }

  async function unarchiveGoal(id) {
    const res = await api.patch(`/api/goals/${id}/archive`);
    // Move from archived to active
    setArchivedGoals((prev) => prev.filter((g) => g._id !== id));
    setGoals((prev) => [res.data, ...prev]);
    return res.data;
  }

  async function duplicateGoal(id) {
    const res = await api.post(`/api/goals/${id}/duplicate`);
    setGoals((prev) => [res.data, ...prev]);
    return res.data;
  }

  async function getDetail(id) {
    const res = await api.get(`/api/goals/${id}/detail`);
    return res.data;
  }

  useEffect(() => {
    fetchGoals();
  }, []);

  function getTodayGoals() {
    const today = new Date().toISOString().split("T")[0];
    return goals
      .filter((g) => g.status === "active")
      .map((g) => {
        if (g.goalType === "numerical") {
          const todayTarget = g.dailyTargets?.find((d) => d.date === today);
          const doneToday = todayTarget?.locked || false;
          return { ...g, todayTarget, doneToday };
        } else {
          const doneToday = g.completedDays?.includes(today) || false;
          return { ...g, todayTarget: null, doneToday };
        }
      })
      .filter((g) => !g.doneToday);
  }

  return {
    goals,
    archivedGoals,
    getTodayGoals,
    loading,
    createGoal,
    updateGoal,
    deleteGoal,
    logDay,
    unlogDay,
    overrideDay,
    archiveGoal,
    unarchiveGoal,
    duplicateGoal,
    getDetail,
    refetch: fetchGoals,
  };
}
