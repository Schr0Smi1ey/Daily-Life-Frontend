import { useState, useEffect } from "react";
import api from "../api";

export default function useIdeas() {
  const [ideas, setIdeas] = useState([]);
  const [archivedIdeas, setArchivedIdeas] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchIdeas() {
    try {
      const [active, archived] = await Promise.all([
        api.get("/api/ideas"),
        api.get("/api/ideas?archived=true"),
      ]);
      setIdeas(active.data);
      setArchivedIdeas(archived.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function createIdea(data) {
    const res = await api.post("/api/ideas", data);
    setIdeas((prev) => [res.data, ...prev]);
    return res.data;
  }

  async function updateIdea(id, data) {
    const res = await api.patch(`/api/ideas/${id}`, data);
    setIdeas((prev) => prev.map((i) => (i._id === id ? res.data : i)));
    return res.data;
  }

  async function deleteIdea(id) {
    await api.delete(`/api/ideas/${id}`);
    setIdeas((prev) => prev.filter((i) => i._id !== id));
  }

  async function archiveIdea(id) {
    const res = await api.patch(`/api/ideas/${id}`, { archived: true });
    setIdeas((prev) => prev.filter((i) => i._id !== id));
    setArchivedIdeas((prev) => [res.data, ...prev]);
  }

  async function unarchiveIdea(id) {
    const res = await api.patch(`/api/ideas/${id}`, { archived: false });
    setArchivedIdeas((prev) => prev.filter((i) => i._id !== id));
    setIdeas((prev) => [res.data, ...prev]);
  }

  async function toggleFavorite(id, current) {
    const res = await api.patch(`/api/ideas/${id}`, { favorite: !current });
    setIdeas((prev) => prev.map((i) => (i._id === id ? res.data : i)));
  }

  async function togglePin(id, current) {
    const res = await api.patch(`/api/ideas/${id}`, { pinned: !current });
    setIdeas((prev) => prev.map((i) => (i._id === id ? res.data : i)));
  }

  useEffect(() => {
    fetchIdeas();
  }, []);

  return {
    ideas,
    archivedIdeas,
    loading,
    createIdea,
    updateIdea,
    deleteIdea,
    archiveIdea,
    unarchiveIdea,
    toggleFavorite,
    togglePin,
    refetch: fetchIdeas,
  };
}
