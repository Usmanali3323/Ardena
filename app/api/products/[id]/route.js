import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServerClient";

export async function GET(req, { params }) {
  try {
    const supabase = await supabaseServer()
    const { id } = await params;

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
        category_id,
        categories:category_id(id, name),
        discount_percent
        `)
      .eq("id", id)
      .single();

    if (error) throw error;

    return NextResponse.json({product :data});
  } catch (error) {
    console.error("Fetch product error:", error);
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}
