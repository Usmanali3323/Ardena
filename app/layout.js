"use client";

import '@/app/global.css'
import { ThemeProvider } from "next-themes";
import Navbar from "@/components/navbar";
import Footer from '@/components/footer';
// import { SessionProvider } from "@supabase/auth-helpers-react";

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div className="max-w-7xl mx-auto sm:px-3 lg:px-5">
              <Navbar />
              {children}
              <Footer />
            </div>
          </ThemeProvider>
      </body>
    </html>
  );
}
