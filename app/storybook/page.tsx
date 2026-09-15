import type { Metadata } from "next";
import StorybookReview from "./storybook-review";
import { parseStorybookProgress } from "@/lib/storybook";

export const metadata: Metadata = {
  title: "Storybook review · Peiwen Zhang",
  robots: { index: false, follow: false },
};

export default async function StorybookPage({ searchParams }: {
  searchParams: Promise<{ progress?: string | string[] }>;
}) {
  const { progress } = await searchParams;
  return <StorybookReview initialProgress={parseStorybookProgress(typeof progress === "string" ? progress : undefined)} />;
}
