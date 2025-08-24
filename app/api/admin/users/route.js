import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {
  try {
    // List all users (or you can paginate if many)
    const { data, error } = await supabaseAdmin.auth.admin.listUsers();

    if (error) throw error;

    // Filter users created in the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentUsers = data.users.filter(
      (user) => new Date(user.created_at) >= thirtyDaysAgo
    );

    return new Response(
      JSON.stringify({ success: true, count: recentUsers.length }),
      { status: 200 }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      { status: 500 }
    );
  }
}