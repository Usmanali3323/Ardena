import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServerClient";

export async function POST(req) {
  try {
    const body = await req.json();
    const { productId, price, size, quantity, color } = body;

    if (!productId || !quantity || !price) {
      return NextResponse.json(
        { error: "Missing required fields: productId, sku, quantity" },
        { status: 400 }
      );
    }

    const quantityNumber = parseInt(quantity, 10);
    if (isNaN(quantityNumber) || quantityNumber < 1) {
      return NextResponse.json({ error: "Invalid quantity" }, { status: 400 });
    }

    const supabase = await supabaseServer();

    // ✅ Get logged-in user from Supabase session
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError) throw sessionError;

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id; // ✅ this is a proper UUID

    // Check if cart item exists
    const { data: existing, error: findError } = await supabase
      .from("cart")
      .select("*")
      .eq("user_id", userId)
      .eq("product_id", productId)
      .eq("size", size || "")
      .eq("color",color)
      .maybeSingle();

    if (findError) throw findError;

    let result;

    if (existing) {
      const { data, error } = await supabase
        .from("cart")
        .update({ quantity: existing.quantity + quantityNumber })
        .eq("id", existing.id)
        .select()
        .single();
      if (error) throw error;
      result = data;
    } else {
      const { data, error } = await supabase
        .from("cart")
        .insert([
          {
            user_id: userId,
            product_id: productId,
            price,
            size: size || "",
            quantity: quantityNumber,
            color,
          },
        ])
        .select()
        .single();
      if (error) throw error;
      result = data;
    }

    return NextResponse.json({ success: true, cartItem: result }, { status: 201 });
  } catch (err) {
    console.error("Add to cart error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
