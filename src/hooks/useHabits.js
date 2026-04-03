import { useState, useEffect } from "react";
import api from "../api";

export default function useHabits() {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchHabits() {
    try {
      const res = await api.get("/api/habits");
      setHabits(res.data.filter((h) => !h.archived));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function createHabit(data) {
    const res = await api.post("/api/habits", data);
    setHabits((prev) => [...prev, res.data]);
    return res.data;
  }

  async function updateHabit(id, data) {
    const res = await api.patch(`/api/habits/${id}`, data);
    setHabits((prev) => prev.map((h) => (h._id === id ? res.data : h)));
    return res.data;
  }

  async function deleteHabit(id) {
    await api.delete(`/api/habits/${id}`);
    setHabits((prev) => prev.filter((h) => h._id !== id));
  }

  async function checkin(id, data) {
    const res = await api.post(`/api/habits/${id}/checkin`, data);
    setHabits((prev) => prev.map((h) => (h._id === id ? res.data : h)));
    return res.data;
  }

  async function undoCheckin(id, date) {
    const res = await api.delete(`/api/habits/${id}/checkin/${date}`);
    setHabits((prev) => prev.map((h) => (h._id === id ? res.data : h)));
    return res.data;
  }

  async function archiveHabit(id) {
    const res = await api.patch(`/api/habits/${id}/archive`);
    setHabits((prev) => prev.filter((h) => h._id !== id));
    return res.data;
  }

  async function duplicateHabit(id) {
    const res = await api.post(`/api/habits/${id}/duplicate`);
    setHabits((prev) => [...prev, res.data]);
    return res.data;
  }

  async function fetchTemplates() {
    const res = await api.get("/api/habits/templates");
    return res.data;
  }

  async function addBulkHabits(habits) {
    const res = await api.post("/api/habits/bulk", { habits });
    setHabits((prev) => [...prev, ...res.data]);
    return res.data;
  }

  async function getDetail(id) {
    const res = await api.get(`/api/habits/${id}/detail`);
    return res.data;
  }

  async function getTimeLogs(id) {
    const res = await api.get(`/api/habits/${id}/timelogs`);
    return res.data;
  }

  async function saveTimeLog(id, data) {
    const res = await api.post(`/api/habits/${id}/timelogs`, data);
    return res.data;
  }

  async function deleteTimeLog(habitId, logId) {
    await api.delete(`/api/habits/${habitId}/timelogs/${logId}`);
  }

  useEffect(() => {
    fetchHabits();
  }, []);

  return {
    habits,
    loading,
    createHabit,
    updateHabit,
    deleteHabit,
    checkin,
    undoCheckin,
    archiveHabit,
    duplicateHabit,
    fetchTemplates,
    addBulkHabits,
    getDetail,
    getTimeLogs,
    saveTimeLog,
    deleteTimeLog,
    refetch: fetchHabits,
  };
}
