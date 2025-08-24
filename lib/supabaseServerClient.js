// lib/supabaseServerClient.js
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function supabaseServer() {
  const cookieStore = await cookies(); // ❌ no await
  return createServerComponentClient({ cookies: () => cookieStore });
}
