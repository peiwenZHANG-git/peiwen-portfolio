/**
 * Typefaces for the desk-scene Home route only.
 *
 * Real webfonts: next/font downloads and self-hosts them at build time. Scoped to this
 * component — the root layout and every other route are untouched.
 *
 * Patrick Hand — logo, nav, the hidden page title, captions.
 * Nunito       — the skip link and any body-weight text.
 *
 * The `variable` names (`--home-hand` / `--home-body`) feed the shared
 * `components/site-header.module.css`, whose `--pw-hand` fallback chain already checks
 * `--exp-hand` and `--about-hand` from the other two routes that mount this header; a
 * `--home-hand` link was added there alongside this file so the header picks up the
 * real webfont here too, instead of silently falling back to the OS cursive stack.
 */
import { Nunito, Patrick_Hand } from "next/font/google";

export const handFont = Patrick_Hand({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--home-hand",
});

export const bodyFont = Nunito({
  subsets: ["latin"],
  display: "swap",
  variable: "--home-body",
});
