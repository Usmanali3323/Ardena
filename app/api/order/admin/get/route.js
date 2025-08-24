import { supabaseServer } from "@/lib/supabaseServerClient";

export async function GET() {
  try {
    const supabase = await supabaseServer();

    // fetch orders with shipping + items + product info
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
      `)
      .order("created_at", { ascending: false });

    if (error) {
      return new Response(
        JSON.stringify({ success: false, error: error.message }),
        { status: 400 }
      );
    }

    return new Response(
      JSON.stringify({ success: true, orders: data }),
      { status: 200 }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      { status: 500 }
    );
  }
}
