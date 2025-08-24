import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServerClient";

export async function GET(req,{params}) {
  try {
    const supabase = await supabaseServer();
    const {id} = params;
 const { data: reviews, error } = await supabase
  .from("reviews")
  .select("id,username,rating,comment")
  .eq("product_id", id); // column name as string, value as second argument


    if (error) {
      return NextResponse.json(
        { success: false, error: error.message, message: "Failed to fetch reviews" },
    
      );
    }

    return NextResponse.json(
      { success: true, data: reviews, message: "Successfully fetched reviews" },
    
    );
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err.message, message: "Server error" },
    
    );
  }
}
