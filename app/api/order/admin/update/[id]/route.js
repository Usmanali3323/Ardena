import { supabaseServer } from "@/lib/supabaseServerClient"; // your server supabase client

export async function PUT(req, { params }) {
  try {
    const { id } = params; // order id from URL
    const body = await req.json();
    const { status } = body;

    if (!status) {
      return new Response(
        JSON.stringify({ success: false, error: "Status is required" }),
        { status: 400 }
      );
    }

    const supabase = await supabaseServer();

    // ✅ Update only the status field
    const { data, error } = await supabase
      .from("orders")
      .update({ status })
      .eq("id", id)
      .select();

    if (error) {
      return new Response(
        JSON.stringify({ success: false, error: error.message }),
        { status: 400 }
      );
    }

    if (!data || data.length === 0) {
      return new Response(
        JSON.stringify({ success: false, error: "Order not found" }),
        { status: 404 }
      );
    }

    return new Response(JSON.stringify({ success: true, order: data[0] }), {
      status: 200,
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      { status: 500 }
    );
  }
}
