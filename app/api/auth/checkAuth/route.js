import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServerClient";

export async function GET() {
  const supabase = await supabaseServer();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    return NextResponse.json({ valid: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    valid: true,
    user: user ? { id: user.id, email: user.email } : null,
  });
}
