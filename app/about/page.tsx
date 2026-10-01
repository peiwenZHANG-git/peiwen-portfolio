import type { Metadata } from "next";
import AboutPage from "./about-page";

export const metadata: Metadata = {
  title: "About me · Peiwen Zhang",
  description:
    "Peiwen Zhang, HCI master's student at Université Paris-Saclay. Building AI products people can understand and control, with product thinking and a technical AI background.",
};

export default function About() {
  return <AboutPage />;
}
