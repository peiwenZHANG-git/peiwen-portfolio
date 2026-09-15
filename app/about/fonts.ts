/**
 * Typefaces for the About route only.
 *
 * Real webfonts: next/font downloads and self-hosts them at build time, so visitors
 * never fall back to an OS cursive. Scoped to `/about` — the root layout and every
 * other route are untouched.
 *
 * Patrick Hand — headings, photo captions, margin annotations.
 * Nunito       — body copy, details, languages, contact values and URLs.
 *
 * If the build machine cannot reach fonts.gstatic.com, swap these for next/font/local
 * pointing at woff2 files committed under app/about/.
 */
import { Nunito, Patrick_Hand } from "next/font/google";

export const handFont = Patrick_Hand({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--about-hand",
});

export const bodyFont = Nunito({
  subsets: ["latin"],
  display: "swap",
  variable: "--about-body",
});
