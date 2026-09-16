/**
 * Typefaces for the Experience route only. Same pair and setup as /about:
 * Patrick Hand for handwritten UI, Nunito for body copy. Scoped via next/font,
 * the root layout and every other route are untouched.
 */
import { Nunito, Patrick_Hand } from "next/font/google";

export const handFont = Patrick_Hand({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--exp-hand",
});

export const bodyFont = Nunito({
  weight: ["400", "600"],
  subsets: ["latin"],
  display: "swap",
  variable: "--exp-body",
});
