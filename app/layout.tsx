import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import { PageTransitionProvider } from "@/components/page-transition";
import { SiteAudio } from "@/components/site-audio";
import { WorldLink } from "@/components/world-link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Peiwen Zhang — HCI × AI Agents",
  description: "Peiwen Zhang's portfolio in HCI, AI agents, and UX.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col"><PageTransitionProvider>
          {children}
          {/* snow + the desk keepsake that walks back Home, on every inner page */}
          <WorldLink />
        </PageTransitionProvider>
        {/* Mounted once so the music loop survives route changes. */}
        <SiteAudio />
      </body>
    </html>
  );
}
