
// export const dynamic = 'force-dynamic';

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/lib/providers/next-theme-provider";
import {DM_Sans} from 'next/font/google'
import { twMerge } from "tailwind-merge";
import AppStateProvider from "@/lib/providers/state-provider";
import { SupabaseUserProvider } from "@/lib/providers/supabse-user-provider";
import { Toaster } from "@/components/ui/toaster";
import { SocketProvider } from "@/lib/providers/socket-provider";

const inter = DM_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({children}: Readonly<{children: React.ReactNode}>) {
  
  return (
    <html lang="en">
      <body className={twMerge('bg-background', inter.className)}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem >
        <AppStateProvider>
          <SocketProvider>
            <SupabaseUserProvider>
              <Toaster />
              {children}
            </SupabaseUserProvider>
          </SocketProvider>
        </AppStateProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
