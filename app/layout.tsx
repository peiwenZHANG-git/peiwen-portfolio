import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import { SiteAudio } from "@/components/site-audio";
import { WorldLink } from "@/components/world-link";
import { PeiwenCompanion } from "@/components/peiwen-companion";
import { PageTransitionProvider } from "@/components/page-transition";
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
      <body className="min-h-full flex flex-col">
        {/* Mounted here, not per route, so the wash overlay survives client-side
            navigation and the same instance carries every route change — see
            components/page-transition.tsx. `children` is already server-rendered; this
            client component just wraps it, it doesn't re-render it. */}
        <PageTransitionProvider>
          {children}
          {/* snow + the desk keepsake that walks back Home, on every inner page */}
          <WorldLink />
          {/* little Peiwen in the bottom-right corner of every page — "ask me" */}
          <PeiwenCompanion />
        </PageTransitionProvider>
        {/* Mounted here, not per route, so the loop survives client-side navigation. */}
        <SiteAudio />
      </body>
    </html>
  );
}
