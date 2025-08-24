import { supabaseServer } from "@/lib/supabaseServerClient";
import { NextResponse } from "next/server";



export async function GET() {
    const supabase = await supabaseServer()
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("sold", { ascending: false }) // most sold first
    .limit(3);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
