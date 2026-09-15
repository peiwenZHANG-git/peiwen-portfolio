import type { Metadata } from "next";
import AboutPage from "./about-page";

export const metadata: Metadata = {
  title: "About me · Peiwen Zhang",
  description:
    "Peiwen Zhang — HCI master's student at Université Paris-Saclay, working across product, AI and XR.",
};

export default function About() {
  return <AboutPage />;
}
