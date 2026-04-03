import { useState, useEffect } from "react";
import api from "../api";

export default function useIdeaCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchCategories() {
    try {
      const res = await api.get("/api/ideacategories");
      setCategories(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function createCategory(data) {
    const res = await api.post("/api/ideacategories", data);
    setCategories((prev) => [...prev, res.data]);
    return res.data;
  }

  async function updateCategory(id, data) {
    const res = await api.patch(`/api/ideacategories/${id}`, data);
    setCategories((prev) => prev.map((c) => (c._id === id ? res.data : c)));
    return res.data;
  }

  async function deleteCategory(id) {
    await api.delete(`/api/ideacategories/${id}`);
    setCategories((prev) => prev.filter((c) => c._id !== id));
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
    refetch: fetchCategories,
  };
}
