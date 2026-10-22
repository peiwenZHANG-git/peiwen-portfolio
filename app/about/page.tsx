import type { Metadata } from "next";
import AboutPage from "./about-page";

export const metadata: Metadata = {
  title: "About me · Peiwen Zhang",
  description:
    "HCI M.Sc. @ Université Paris-Saclay | AI Product & UX Research | Building AI products people can understand and control | Seeking a 6-month internship",
};

export default function About() {
  return <AboutPage />;
}
