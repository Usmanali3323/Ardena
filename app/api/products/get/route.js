// app/api/products/get/route.js
import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServerClient";

export async function GET() {
  try {
    const supabase = await supabaseServer()
    const { data, error } = await supabase
      .from("products")
      .select(`
        id,
        name,
        description,
        price,
        images,
        stock,
        sold,
        sku,
        variants,
        status,
        created_at,
        updated_at,
        discount_percent,
        category_id,
        categories:category_id(id, name)
      `)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ products: data });
  } catch (err) {
    console.error("Fetch products error:", err);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
