import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServerClient";

export async function PUT(req) {
  try {
    const supabase = await supabaseServer();
    const body = await req.json();
    const { id, quantity } = body;

    if (!id || !quantity) {
      return NextResponse.json({ error: "Missing id or quantity" }, { status: 400 });
    }

    const quantityNumber = parseInt(quantity, 10);
    if (isNaN(quantityNumber) || quantityNumber < 1) {
      return NextResponse.json({ error: "Invalid quantity" }, { status: 400 });
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return NextResponse.json({ error: "User not logged in" }, { status: 401 });

    const { data, error } = await supabase
      .from("cart")
      .update({ quantity: quantityNumber })
      .eq("id", id)
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, quantity: data.quantity });
  } catch (err) {
    console.error("Update cart error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
