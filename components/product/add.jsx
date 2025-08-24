"use client";

import { useEffect, useState } from "react";
import imageCompression from "browser-image-compression";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function UpdateProductModal({ product }) {
  const [form, setForm] = useState({
    id: product?.id || null,
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price || "",
    category_id: product?.category_id || "",
    stock: product?.stock || 0,
    sku: product?.sku || "",
    variants: product?.variants || JSON.stringify({ color: [], size: [] }),
    status: product?.status || "active",
    discount: product?.discount || 0,
    images: [],
  });
  const [categories, setCategories] = useState([]);
  const [previewImages, setPreviewImages] = useState(product?.images || []);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch("/api/categories");
        const data = await res.json();
        setCategories(data.categories || []);
      } catch (error) {
        console.error("Failed to load categories", error);
      }
    }
    fetchCategories();
  }, []);

  const handleChange = async (e) => {
    const { name, value, files } = e.target;

    if (name === "images") {
      let selectedFiles = Array.from(files);

      if (selectedFiles.length + form.images.length > 5) {
        alert("You can upload a maximum of 5 images");
        selectedFiles = selectedFiles.slice(0, 5 - form.images.length);
      }

      const compressedFiles = await Promise.all(
        selectedFiles.map(async (file) => {
          if (file.size / 1024 / 1024 > 1) {
            return await imageCompression(file, {
              maxSizeMB: 1,
              maxWidthOrHeight: 1920,
            });
          }
          return file;
        })
      );

      setForm({ ...form, images: [...form.images, ...compressedFiles] });
      setPreviewImages([
        ...previewImages,
        ...compressedFiles.map((f) => URL.createObjectURL(f)),
      ]);
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const removeImage = (index) => {
    setPreviewImages((prev) => prev.filter((_, i) => i !== index));
    if (index < form.images.length) {
      setForm({
        ...form,
        images: form.images.filter((_, i) => i !== index),
      });
    }
  };

  const handleCategoryChange = (value) =>
    setForm({ ...form, category_id: value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (key !== "images") formData.append(key, value);
    });
    form.images.forEach((img) => formData.append("images", img));

    const res = await fetch("/api/products/add", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setLoading(false);

    if (data.error) {
      alert(data.error);
    } else {
      alert("✅ Product updated successfully!");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-yellow-300 text-black rounded-2xl px-5 py-2 shadow-md hover:bg-pink-400 transition">
          Edit Product
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold tracking-tight">
            Update Product
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Product Name</Label>
            <Input
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="rounded-xl"
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              className="rounded-xl"
            />
          </div>

          <div>
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              required
              className="rounded-xl"
            />
          </div>

          <div>
            <Label htmlFor="category">Category</Label>
            <Select onValueChange={handleCategoryChange} value={form.category_id}>
              <SelectTrigger className="w-full rounded-xl">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id.toString()}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="stock">Stock</Label>
              <Input
                id="stock"
                type="number"
                name="stock"
                value={form.stock}
                onChange={handleChange}
                className="rounded-xl"
              />
            </div>

            <div>
              <Label htmlFor="sku">SKU</Label>
              <Input
                id="sku"
                name="sku"
                value={form.sku}
                onChange={handleChange}
                required
                className="rounded-xl"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="variants">Variants (JSON)</Label>
            <Input
              id="variants"
              name="variants"
              value={form.variants}
              onChange={handleChange}
              className="rounded-xl"
            />
          </div>

          <div>
            <Label htmlFor="status">Status</Label>
            <Select
              onValueChange={(val) => setForm({ ...form, status: val })}
              value={form.status}
            >
              <SelectTrigger className="w-full rounded-xl">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="discount">Discount (%)</Label>
            <Input
              id="discount"
              name="discount"
              type="number"
              value={form.discount}
              onChange={handleChange}
              className="rounded-xl"
            />
          </div>

          <div>
            <Label htmlFor="images">Images (Max 5)</Label>
            <Input
              id="images"
              type="file"
              name="images"
              accept="image/*"
              multiple
              onChange={handleChange}
              className="rounded-xl"
            />
            <div className="flex flex-wrap gap-2 mt-2">
              {previewImages.map((src, idx) => (
                <div
                  key={idx}
                  className="relative w-20 h-20 rounded-xl overflow-hidden"
                >
                  <img
                    src={typeof src === "string" ? src : URL.createObjectURL(src)}
                    alt={`preview ${idx}`}
                    className="object-cover w-full h-full"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs shadow"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-yellow-300 text-black py-2 rounded-2xl shadow-md hover:bg-pink-400 hover:text-white transition"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Product"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
