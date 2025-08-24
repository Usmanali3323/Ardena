import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServerClient";

export async function DELETE(req) {
  try {
    const supabase = await supabaseServer();
    const body = await req.json();
    const { id } = body;

    if (!id) return NextResponse.json({ error: "Missing cart item id" }, { status: 400 });

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return NextResponse.json({ error: "User not logged in" }, { status: 401 });

    const { error } = await supabase.from("cart").delete().eq("id", id).eq("user_id", user.id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Delete cart error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
