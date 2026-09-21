export type Project = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  rotation: number;
  size: "large" | "wide" | "photo" | "square" | "note";
  year: string;
  role: string;
  tools: string[];
};

// Demo categories, not claims about completed projects or personal contributions.
export const projects: Project[] = [
  { id: "01", title: "AI Products", subtitle: "research · prototype · explore", description: "Exploring how thoughtful AI tools could fit into everyday life.", image: "/assets/about/desk-scene.webp", rotation: -1.8, size: "large", year: "To add", role: "To add", tools: ["To add"] },
  { id: "02", title: "Interactive Storytelling", subtitle: "story · experiment · play", description: "Small worlds, playful interactions, and stories you can wander through.", image: "/assets/about/place-japan.webp", rotation: 1.4, size: "wide", year: "To add", role: "To add", tools: ["To add"] },
  { id: "03", title: "Research & Prototype", subtitle: "research · prototype · iterate", description: "A space for questions, early experiments, and things learned by making.", image: "/assets/about/desk-scene.webp", rotation: -0.9, size: "photo", year: "To add", role: "To add", tools: ["To add"] },
  { id: "04", title: "Visual Narratives", subtitle: "illustration · visual design", description: "Collecting quiet moments and turning them into illustrated stories.", image: "/assets/about/place-paris.webp", rotation: 1.8, size: "square", year: "To add", role: "To add", tools: ["To add"] },
  { id: "05", title: "Work in progress...", subtitle: "a little room for what’s next", description: "Something new is taking shape. More to come.", image: "/assets/about/place-beijing.webp", rotation: -2, size: "note", year: "To add", role: "To add", tools: ["To add"] },
];
