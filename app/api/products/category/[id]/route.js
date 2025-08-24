import { supabaseServer } from "@/lib/supabaseServerClient";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  const { id } = await params; // category id from URL
  const { searchParams } = new URL(req.url);
  const sort = searchParams.get("sort") || "latest"; // get ?sort= value

  const supabase = await supabaseServer();

  let query = supabase
    .from("products")
    .select(
      `
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
    `
    )
    .eq("category_id", id);

  // ✅ apply sort
  if (sort === "latest") {
    query = query.order("created_at", { ascending: false });
  } else if (sort === "popular") {
    query = query.order("sold", { ascending: false });
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    products: data,
  });
}
