// app/api/review/route.js
import { supabaseServer } from "@/lib/supabaseServerClient"; // your Supabase client
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const supabase = await supabaseServer();
    const { rating, comment, userId, username, productId } = await req.json();

    if (!rating || !userId || !productId) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if the user already has a review for this product
    const { data: existingReview, error: fetchError } = await supabase
      .from("reviews")
      .select("*")
      .eq("user_id", userId)
      .eq("product_id", productId)
      .limit(1)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") { 
      // PGRST116 is "No rows found", which is okay
      return NextResponse.json({ success: false, error: fetchError.message }, { status: 400 });
    }

    let result;
    if (existingReview) {
      // Update existing review
      const { data, error } = await supabase
        .from("reviews")
        .update({
          rating,
          comment: comment || "",
          username, // update username if needed
        })
        .eq("id", existingReview.id);

      if (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
      }

      result = data;
    } else {
      // Insert new review
      const { data, error } = await supabase.from("reviews").insert([
        {
          product_id: productId,
          user_id: userId,
          username,
          rating,
          comment: comment || "",
        },
      ]);

      if (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
      }

      result = data;
    }

    return NextResponse.json({ success: true, review: result }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
