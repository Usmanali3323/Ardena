import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServerClient";

export async function GET(req) {
  try {
    const supabase = await supabaseServer();

    // Get user from auth (replace with real session)
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ cart: [] });
    }

    const userId = user.id;
const { data, error } = await supabase
  .from("cart")
  .select(`
    id,
    price,
    size,
    quantity,
    color,
    created_at,
    product_id (
      id,
      images,
      name
    )
  `)
  .eq("user_id", userId);

    if (error) throw error;

    return NextResponse.json({ cart: data });
  } catch (err) {
    console.error("Fetch cart error:", err);
    return NextResponse.json({ cart: [], error: err.message }, { status: 500 });
  }
}
