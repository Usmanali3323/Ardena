import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServerClient"; // server-side Supabase client

export async function PUT(req) {
  try {
    const supabase = supabaseServer();
    const { id } = params; // category id from URL
    const body = await req.json();
    const { name } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ error: "Category name is required" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("categories")
      .update({ name: name.trim() })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, category: data }, { status: 200 });
  } catch (err) {
    console.error("Edit Category API Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
