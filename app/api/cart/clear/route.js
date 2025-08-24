// app/api/cart/clear/route.js
import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServerClient";

export async function POST(req) {
  try {
    const supabase = await supabaseServer();

    // get the current session
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
console.log(userId);

    const { error } = await supabase
      .from("cart")
      .delete()
      .eq("user_id", userId);

    if (error) throw error;

    return NextResponse.json({ success: true, message: "Cart cleared" }, { status: 200 });
  } catch (err) {
    console.error("Error clearing cart:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
