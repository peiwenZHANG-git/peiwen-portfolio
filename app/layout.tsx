import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import { SiteAudio } from "@/components/site-audio";
import { WorldLink } from "@/components/world-link";
import { PeiwenCompanion } from "@/components/peiwen-companion";
import { PageTransitionProvider } from "@/components/page-transition";
import { RotateGuard } from "@/components/rotate-guard";
// from the plain module, not components/lang.tsx ("use client"): see components/lang-boot.ts
import { LANG_BOOT_SCRIPT } from "@/components/lang-boot";
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
  // Needed so the favicon/apple-icon/opengraph-image file-convention routes below
  // (app/icon.tsx, app/apple-icon.tsx, app/opengraph-image.tsx) resolve to absolute
  // URLs when the site is shared — without it Next warns and some link-preview
  // scrapers won't fetch a relative image URL at all.
  metadataBase: new URL("https://peiwen-little-world.vercel.app"),
  title: "Peiwen Zhang · HCI × AI Product",
  description: "Peiwen Zhang: building AI products people can understand and control, with product thinking and a technical AI background. MSc HCI, Université Paris-Saclay.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      // data-lang is set before paint by the script below (see components/lang.tsx)
      suppressHydrationWarning
    >
      <head>
        {/* fetched immediately, in parallel with the page shell, so the Chinese
            handwritten font is ready before any 中文 text paints — see components/lang.tsx */}
        <link rel="preload" href="/fonts/lxgw-wenkai-subset.woff" as="font" type="font/woff" crossOrigin="anonymous" />
        <script dangerouslySetInnerHTML={{ __html: LANG_BOOT_SCRIPT }} />
      </head>
      <body className="min-h-full flex flex-col">
        {/* Site-wide "turn your phone sideways" gate (Peiwen's decision, 2026-09-28):
            covers every route, not just About, and makes the rest of this subtree
            `inert` while its card is up — see components/rotate-guard.tsx. */}
        <RotateGuard>
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
        </RotateGuard>
        {/* Mounted here, not per route, so the loop survives client-side navigation. */}
        <SiteAudio />
      </body>
    </html>
  );
}
