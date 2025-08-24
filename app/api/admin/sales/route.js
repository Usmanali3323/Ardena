// app/api/admin/dashboard/route.js
import { supabaseServer } from "@/lib/supabaseServerClient";

export async function GET(req) {
  try {
    const supabase = await supabaseServer();

    // Total sales from delivered orders
    const { data: totalData, error: totalError } = await supabase
      .from("orders")
      .select("total_amount")
      .eq("status", "delivered");

    if (totalError) throw totalError;

    const totalSales = totalData.reduce(
      (sum, o) => sum + parseFloat(o.total_amount || 0),
      0
    );

    // Monthly sales aggregation
    const { data: orders, error } = await supabase
      .from("orders")
      .select("total_amount, created_at")
      .eq("status", "delivered");

    if (error) throw error;

    const monthly = Array.from({ length: 12 }, (_, i) => {
      const month = new Date(0, i).toLocaleString("default", { month: "short" });
      const sales = orders
        .filter((o) => new Date(o.created_at).getMonth() === i)
        .reduce((sum, o) => sum + parseFloat(o.total_amount || 0), 0);
      return { month, sales };
    });

    return new Response(
      JSON.stringify({ success: true, totalSales, monthly }),
      { status: 200 }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      { status: 500 }
    );
  }
}
