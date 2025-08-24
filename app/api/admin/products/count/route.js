// app/api/admin/products/count/route.js
import { supabaseServer } from "@/lib/supabaseServerClient";

export async function GET() {
  try {
    const supabase = await supabaseServer();

    const { count, error } = await supabase
      .from("products")
      .select("*", { count: "exact", head: true });

    if (error) throw error;

    return new Response(
      JSON.stringify({ count, success: true }),
      { status: 200 }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message, success: false }),
      { status: 500 }
    );
  }
}
