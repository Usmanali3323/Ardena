// app/api/products/add/route.js
import { NextResponse } from "next/server";
import { uploadImage } from "@/lib/cloudinary"; // Cloudinary helper
import { supabaseServer } from "@/lib/supabaseServerClient"; // Supabase server client

// Disable default body parsing (important for multipart/form-data)
export const config = {
  api: { bodyParser: false },
};

export async function POST(req) {
  try {
    const formData = await req.formData();

    // Extract fields
    const name = formData.get("name")?.trim();
    const description = formData.get("description")?.trim() || "";
    const price = Number(formData.get("price"));
    const category_id = formData.get("category_id") || null;
    const stock = Number(formData.get("stock")) || 0;
    const skuRaw = formData.get("sku") || "";
    const variantsRaw = formData.get("variants") || "{}";
    const status = formData.get("status") || "active";
    const discount = Number(formData.get("discount")) || 0;

    const supabase = await supabaseServer();

    // Validate required fields
    if (!name || isNaN(price) || price <= 0) {
      return NextResponse.json(
        { error: "Name and valid price are required." },
        { status: 400 }
      );
    }

    const files = formData.getAll("images");
    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: "At least one product image is required." },
        { status: 400 }
      );
    }

    // Upload all images to Cloudinary (parallel upload for speed)
    const uploadResults = await Promise.allSettled(
      files.map((file) => uploadImage(file, "heer-chain"))
    );
    const images = uploadResults
      .filter((res) => res.status === "fulfilled" && res.value)
      .map((res) => res.value);

    if (images.length === 0) {
      return NextResponse.json(
        { error: "Failed to upload product images." },
        { status: 500 }
      );
    }

    // Parse variants JSON safely
    let variants = { color: [], size: [] };
    try {
      const parsed = JSON.parse(variantsRaw);
      if (typeof parsed === "object" && parsed !== null) variants = parsed;
    } catch {
      console.warn("Invalid variants JSON, using default.");
    }

    // Normalize SKU → simple array
    const sku = skuRaw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    // Insert product into Supabase
    const { data, error } = await supabase
      .from("products")
      .insert([
        {
          name,
          description,
          price,
          category_id,
          stock,
          sku,
          variants,
          status,
          discount_percent: discount,
          images, // ✅ Cloudinary URLs
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { success: true, product: data },
      { status: 201 }
    );
  } catch (err) {
    console.error("Add Product API Error:", err);
    return NextResponse.json(
      { error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}
