import type { Metadata } from "next";
import ExperiencePage from "./experience-page";
import { bodyFont, handFont } from "./fonts";

export const metadata: Metadata = {
  title: "Experience · Peiwen Zhang",
  description: "Walk with Peiwen through Paris-Saclay, Beijing and Osaka.",
};

export default function Page() {
  return (
    <div className={`${handFont.variable} ${bodyFont.variable}`}>
      <ExperiencePage />
    </div>
  );
}
