"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("latest"); // latest | popular

  const [editingRowId, setEditingRowId] = useState(null);
  const [formData, setFormData] = useState({});
  const [savingId, setSavingId] = useState(null);

  // Fetch categories once
  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();
      if (data.categories) setCategories(data.categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  }

  // Fetch products whenever category or sort changes
  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, sortBy]);

  async function fetchProducts() {
    try {
      setLoading(true);
      let url = `/api/products/get?sort=${sortBy}`;
      if (selectedCategory !== "all") {
        url = `/api/products/category/${selectedCategory}?sort=${sortBy}`;
      }

      const res = await fetch(url);
      const data = await res.json();
      if (data.products) setProducts(data.products);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  }

  function handleEdit(product) {
    setEditingRowId(product.id);
    setFormData({
      name: product.name,
      price: product.price,
      stock: product.stock,
      status: product.status,
      description: product.description || "",
    });
  }

  function handleCancel() {
    setEditingRowId(null);
    setFormData({});
  }

  async function handleSave(id) {
    try {
      setSavingId(id);
      const res = await fetch(`/api/products/update/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        setProducts((prev) =>
          prev.map((p) => (p.id === id ? { ...p, ...data.product } : p))
        );
        setEditingRowId(null);
      } else {
        alert("Failed to update product: " + data.error);
      }
    } catch (error) {
      console.error("Error updating product:", error);
    } finally {
      setSavingId(null);
    }
  }


  return (
    <div className="">
      <h1 className="text-3xl font-semibold mb-3 text-gray-800  dark:bg-gray-900 dark:text-white">📦 Products</h1>

      {/* Filters */}
      <div className="flex gap-4 mb-4">
        {/* Category Filter */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border border-gray-300  dark:bg-gray-900 dark:text-white rounded px-3 py-2"
        >
          <option value="all">All Categories</option>
          {categories?.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        {/* Sort Filter */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border border-gray-300  dark:bg-gray-900 dark:text-white rounded px-3 py-2"
        >
          <option value="latest">Latest</option>
          <option value="popular">Popular</option>
        </select>
      </div>
{loading ? <p className="p-6">Loading products...</p> :(<>
      {products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div className="overflow-x-auto overflow-y-auto max-h-[70vh] shadow-md rounded-lg ">
          <table className="min-w-full border border-gray-300 text-sm text-gray-700">
            <thead className="bg-gray-100 text-gray-800  dark:bg-gray-900 dark:text-white uppercase text-xs tracking-wider sticky top-0">
              <tr>
                {[
                  "ID",
                  "Image",
                  "Name",
                  "Description",
                  "Price",
                  "Stock",
                  "Sold",
                  "Category",
                  "Status",
                  "Actions",
                ].map((header) => (
                  <th
                    key={header}
                    className="border px-3 py-2 font-medium text-center"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map((product, idx) => {
                const isEditing = editingRowId === product.id;
                const isSaving = savingId === product.id;

                return (
                  <tr
                    key={product.id}
                    className={`${
                      idx % 2 === 0 ? "bg-white  dark:bg-gray-900 dark:text-white" : "bg-gray-50  dark:bg-gray-900 dark:text-white"
                    } hover:bg-yellow-50 dark:hover:bg-gray-700 transition `}
                  >
                    <td className="border px-3 py-2 text-center">{product.id}</td>
                    <td className="border px-3 py-2 text-center">
                      {product.images?.length > 0 && (
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          width={45}
                          height={45}
                          className="object-cover rounded mx-auto"
                        />
                      )}
                    </td>

                    {/* Name */}
                    <td className="border px-3 py-2">
                      {isEditing ? (
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                        />
                      ) : (
                        <span className="font-medium">{product.name.length > 25 ? product.name.slice(0,25)+"..." : product.name}</span>
                      )}
                    </td>

                    {/* Description */}
                    <td className="border px-3 py-2">
                      {isEditing ? (
                        <textarea
                          value={formData.description}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              description: e.target.value,
                            })
                          }
                          className="w-full border border-gray-300 rounded px-2 py-1 text-sm resize-none h-14"
                        />
                      ) : (
                        <span className="text-gray-600">
                          {product.description
                            ? product.description.slice(0, 30) +
                              (product.description.length > 30 ? "..." : "")
                            : "-"}
                        </span>
                      )}
                    </td>

                    {/* Price */}
                    <td className="border px-3 py-2 text-right">
                      {isEditing ? (
                        <input
                          type="number"
                          value={formData.price}
                          onChange={(e) =>
                            setFormData({ ...formData, price: e.target.value })
                          }
                          className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                        />
                      ) : (
                        <span className="font-semibold">{process.env.NEXT_PUBLIC_CURRENCY}{product.price}</span>
                      )}
                    </td>

                    {/* Stock */}
                    <td className="border px-3 py-2 text-center">
                      {isEditing ? (
                        <input
                          type="number"
                          value={formData.stock}
                          onChange={(e) =>
                            setFormData({ ...formData, stock: e.target.value })
                          }
                          className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                        />
                      ) : (
                        product.stock
                      )}
                    </td>

                    <td className="border px-3 py-2 text-center">
                      {product.sold || 0}
                    </td>

                    <td className="border px-3 py-2 text-center">
                      {product.category?.name || "-"}
                    </td>

                    {/* Status */}
                    <td className="border px-3 py-2 text-center">
                      {isEditing ? (
                        <select
                          value={formData.status}
                          onChange={(e) =>
                            setFormData({ ...formData, status: e.target.value })
                          }
                          className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                        >
                          <option value="active">Active</option>
                          <option value="draft">Draft</option>
                          <option value="archived">Archived</option>
                        </select>
                      ) : (
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            product.status === "active"
                              ? "bg-green-100 text-green-700"
                              : product.status === "draft"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-gray-200 text-gray-700"
                          }`}
                        >
                          {product.status}
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="border px-3 py-2 text-center">
                      {isEditing ? (
                        <div className="flex flex-col items-center gap-2">
                          <Button
                            size="sm"
                            disabled={isSaving}
                            className="bg-green-500 hover:bg-green-600 text-white"
                            onClick={() => handleSave(product.id)}
                          >
                            {isSaving ? "Saving..." : "Save"}
                          </Button>
                          <Button
                            size="sm"
                            disabled={isSaving}
                            className="bg-gray-400 hover:bg-gray-500 text-white"
                            onClick={handleCancel}
                          >
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <Button
                          size="sm"
                          className="bg-yellow-400 hover:bg-yellow-500 text-black"
                          onClick={() => handleEdit(product)}
                        >
                          Edit
                        </Button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      </>)}
    </div>
  );
}
