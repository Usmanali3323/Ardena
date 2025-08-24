"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [editCategory, setEditCategory] = useState({ id: null, name: "" });

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();
      setCategories(data.categories || []);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = async () => {
    if (!newCategory.trim()) return alert("Category name required");
    setLoading(true);
    try {
      const res = await fetch("/api/categories/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCategory }),
      });
      const data = await res.json();
      if (data.error) alert(data.error);
      else {
        setNewCategory("");
        fetchCategories();
      }
    } catch (err) {
      console.error(err);
      alert("Failed to add category");
    } finally {
      setLoading(false);
    }
  };

  const handleEditCategory = async () => {
    if (!editCategory.name.trim()) return alert("Category name required");
    setLoading(true);
    try {
      const res = await fetch(`/api/categories/${editCategory.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editCategory.name }),
      });
      const data = await res.json();
      if (data.error) alert(data.error);
      else {
        setEditCategory({ id: null, name: "" });
        fetchCategories();
      }
    } catch (err) {
      console.error(err);
      alert("Failed to update category");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-extrabold bg-gradient-to-r from-purple-500 via-pink-400 to-yellow-300 bg-clip-text text-transparent">
        Manage Categories
      </h1>

      {/* Add Category */}
      <div className="flex gap-3 items-center mb-4">
        <Input
          placeholder="New category name"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          className="flex-1 rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-pink-300"
        />
        <Button
          className="bg-gradient-to-r from-purple-500 via-pink-400 to-yellow-300 text-white px-6 py-2 rounded-lg shadow-md hover:opacity-90 transition"
          onClick={handleAddCategory}
          disabled={loading}
        >
          {loading ? "Adding..." : "+ Add Category"}
        </Button>
      </div>

      {/* Categories Table */}
      <div className="overflow-x-auto rounded-lg shadow border border-gray-200">
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-left">
              <th className="border px-4 py-2">ID</th>
              <th className="border px-4 py-2">Name</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat.id} className=" transition">
                <td className="border px-4 py-2">{cat.id}</td>
                <td className="border px-4 py-2">{cat.name}</td>
                <td className="border px-4 py-2 flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-pink-300 text-pink-400 hover:bg-pink-50"
                        onClick={() =>
                          setEditCategory({ id: cat.id, name: cat.name })
                        }
                      >
                        Edit
                      </Button>
                    </DialogTrigger>

                    <DialogContent className="sm:max-w-sm rounded-lg">
                      <DialogHeader>
                        <DialogTitle>Edit Category</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 mt-2">
                        <Label>Name</Label>
                        <Input
                          value={editCategory.name}
                          onChange={(e) =>
                            setEditCategory({
                              ...editCategory,
                              name: e.target.value,
                            })
                          }
                        />
                        <Button
                          className="w-full bg-gradient-to-r from-purple-500 via-pink-400 to-yellow-300 text-white rounded-lg shadow-md hover:opacity-90 transition"
                          onClick={handleEditCategory}
                          disabled={loading}
                        >
                          {loading ? "Saving..." : "Save Changes"}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
