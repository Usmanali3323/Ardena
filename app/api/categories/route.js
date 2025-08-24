import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServerClient";

export async function GET() {
  try {
    const supabase = await supabaseServer()
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("name", { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, categories: data }, { status: 200 });
  } catch (err) {
    console.error("Get Categories API Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
