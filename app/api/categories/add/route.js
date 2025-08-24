import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServerClient"; // your server-side Supabase client

export async function POST(req) {
  try {
    const supabase = await supabaseServer()
    const body = await req.json();
    const { name } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ error: "Category name is required" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("categories")
      .insert([{ name: name.trim() }])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, category: data }, { status: 201 });
  } catch (err) {
    console.error("Add Category API Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
