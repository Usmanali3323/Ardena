import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServerClient";

export async function POST(req) {
  const supabase = await supabaseServer();

  // get current user session
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  if (sessionError || !session?.user) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { cart, total, address, payement_status } = body;

  if (!address.country || !address.city || !address.street || !address.phone || !cart?.length) {
    return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
  }

  try {
    // 1. Create order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: session.user.id,
        total_amount: total,
        status: "pending",
        payment_status:payement_status
      })
      .select()
      .single();
    if (orderError) throw orderError;

    // 2. Insert shipping info
    const { data: shippingData, error: shippingError } = await supabase
      .from("shipping")
      .insert([
        {
          order_id: order.id,
          street: address.street,
          city: address.city,
          postcode: address.postcode,
          country: address.country,
          phone: address.phone,
        },
      ]);
    if (shippingError) throw shippingError;

    // 3. Insert order items
    const items = cart.map((item) => ({
      order_id: order.id,
      product_id: item.product_id.id,
      quantity: item.quantity,
      price: item.price,
      color: item.color
    }));

    const { error: itemsError } = await supabase.from("order_items").insert(items);
    if (itemsError) throw itemsError;

    // 4. Update stock & sold
    for (const item of cart) {
      const { data: product, error: fetchError } = await supabase
        .from("products")
        .select("stock, sold")
        .eq("id", item.product_id.id)
        .single();

      if (fetchError) continue;

      const { stock, sold } = product;
      if (stock >= item.quantity) {
        await supabase
          .from("products")
          .update({ stock: stock - item.quantity, sold: sold + item.quantity })
          .eq("id", item.product_id.id);
      } else {
        console.warn(`Product ${item.product_id.id} is out of stock ❌`);
      }
    }

    return NextResponse.json({ success: true, order, shipping: shippingData });
  } catch (err) {
    console.error("Order creation failed:", err.message);
    return NextResponse.json({ success: false, error: "Failed to create order" }, { status: 500 });
  }
}
