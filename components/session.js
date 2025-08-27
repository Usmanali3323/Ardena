"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function useUser({ redirectToLogin = true } = {}) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    async function getUser() {
      const { data, error } = await supabase.auth.getUser();
      
      if (error) {
        console.error("Error fetching user:", error.message);
      }

      if (!data?.user && redirectToLogin) {
        setUser(null)
        setLoading(false)
      } else {
        setUser(data?.user || null);
      }

      setLoading(false);
    }

    getUser();
  }, [router, supabase, redirectToLogin]);

  return { user, load: loading };
}

// export async function checkAdmin() {
//     const [admin, setAdmin] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const router = useRouter();
//   const supabase = createClientComponentClient();
//   useEffect(()=>{
//     async  function isAdmin(){
//       const { data, error } = await supabase.auth.getUser();
//       if (error) {
//         console.error("Error fetching user:", error.message);
//       }
//       if(!data.user && redirectToLogin){
//         router.push("/login");
//       }

//       if (data?.user.app_metadata.role !=="admin") {
//         router.push("/");
//       } else {
//         setUser(data?.user || null);
//       }

//       setLoading(false);
            
//     }
//     isAdmin()
//       },[admin,load,redirectToLogin])
//       return  {admin,load}
// } 