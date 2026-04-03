import { useState, useEffect } from "react";
import api from "../api";

export default function useTemplates() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchTemplates() {
    try {
      const res = await api.get("/api/templates");
      setTemplates(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function createTemplate(data) {
    const res = await api.post("/api/templates", data);
    setTemplates((prev) => [res.data, ...prev]);
    return res.data;
  }

  async function updateTemplate(id, data) {
    const res = await api.patch(`/api/templates/${id}`, data);
    setTemplates((prev) => prev.map((t) => (t._id === id ? res.data : t)));
    return res.data;
  }

  async function deleteTemplate(id) {
    await api.delete(`/api/templates/${id}`);
    setTemplates((prev) => prev.filter((t) => t._id !== id));
  }

  async function duplicateTemplate(id) {
    const res = await api.post(`/api/templates/${id}/duplicate`);
    setTemplates((prev) => [res.data, ...prev]);
    return res.data;
  }

  async function addHabitToTemplate(id, habit) {
    const res = await api.post(`/api/templates/${id}/habits`, habit);
    setTemplates((prev) => prev.map((t) => (t._id === id ? res.data : t)));
    return res.data;
  }

  async function removeHabitFromTemplate(id, habitIndex) {
    const res = await api.delete(`/api/templates/${id}/habits/${habitIndex}`);
    setTemplates((prev) => prev.map((t) => (t._id === id ? res.data : t)));
    return res.data;
  }

  async function updateHabitInTemplate(id, habitIndex, data) {
    const res = await api.patch(
      `/api/templates/${id}/habits/${habitIndex}`,
      data,
    );
    setTemplates((prev) => prev.map((t) => (t._id === id ? res.data : t)));
    return res.data;
  }

  useEffect(() => {
    fetchTemplates();
  }, []);

  return {
    templates,
    loading,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    duplicateTemplate,
    addHabitToTemplate,
    removeHabitFromTemplate,
    updateHabitInTemplate,
    refetch: fetchTemplates,
  };
}
