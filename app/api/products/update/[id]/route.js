import { supabaseServer } from "@/lib/supabaseServerClient";

export async function PUT(req, { params }) {
  try {
    const { id } = params; // product id from URL
    const body = await req.json();

    const supabase = await supabaseServer();

    // Allowed fields only
    const allowedFields = ["name", "description", "price", "stock", "status"];
    const updateData = {};

    for (const key of allowedFields) {
      if (body[key] !== undefined) {
        updateData[key] = body[key];
      }
    }

    if (Object.keys(updateData).length === 0) {
      return new Response(
        JSON.stringify({ success: false, error: "No valid fields to update" }),
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("products")
      .update(updateData)
      .eq("id", id)
      .select();

    if (error) {
      return new Response(
        JSON.stringify({ success: false, error: error.message }),
        { status: 400 }
      );
    }

    return new Response(
      JSON.stringify({ success: true, product: data[0] }),
      { status: 200 }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      { status: 500 }
    );
  }
}
