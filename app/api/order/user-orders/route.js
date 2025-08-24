// /app/api/order/user-orders/route.js
import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServerClient";

export async function GET() {
  const supabase = await supabaseServer()


  // get current session
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError || !session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  // fetch orders of logged in user
    const { data, error } = await supabase
      .from("orders")
      .select(`
        id,
        user_id,
        total_amount,
        status,
        payment_status,
        created_at,
        shipping:shipping(order_id, street, city, postcode, country, phone),
        order_items(
          id,
          quantity,
          price,
          
          product:products(id, name, images)
        )
      `).eq("user_id",userId)
      .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ orders: data });
}
