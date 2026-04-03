import { useState, useEffect } from "react";
import api from "../api";

export default function useCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchCategories() {
    try {
      const res = await api.get("/api/categories");
      setCategories(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function createCategory(data) {
    const res = await api.post("/api/categories", data);
    setCategories((prev) => [...prev, res.data]);
    return res.data;
  }

  async function updateCategory(id, data) {
    const res = await api.patch(`/api/categories/${id}`, data);
    setCategories((prev) => prev.map((c) => (c._id === id ? res.data : c)));
    return res.data;
  }

  async function deleteCategory(id) {
    await api.delete(`/api/categories/${id}`);
    setCategories((prev) => prev.filter((c) => c._id !== id));
  }

  async function reorderCategories(reordered) {
    setCategories(reordered);
    try {
      await api.patch("/api/categories/reorder", {
        ids: reordered.map((c) => c._id),
      });
    } catch (err) {
      console.error("Reorder failed:", err);
      fetchCategories();
    }
  }

  async function restoreDefaults() {
    await api.post("/api/categories/restore-defaults");
    await fetchCategories();
  }

  useEffect(() => {
    fetchCategories();
  }, []);

  return {
    categories,
    loading,
    createCategory,
    updateCategory,
    deleteCategory,
    reorderCategories,
    restoreDefaults,
    refetch: fetchCategories,
  };
}
