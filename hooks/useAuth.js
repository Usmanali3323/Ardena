"use client";
import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export function useAuth() {
  const supabase = createClientComponentClient();
  const [user, setUser] = useState(null);
  const [valid, setValid] = useState(false);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
        setValid(true);
      } else {
        setUser(null);
        setValid(false);
        console.error(error);
      }
    };

    getSession();
  }, [supabase]);

  return { valid, user };
}
