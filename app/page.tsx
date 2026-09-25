import HomeDesk from "./home-desk";
import HomeMaster from "./home-master";

// 2026-09-21: Home replaced the frozen valley Static Master with the desk-scene
// design (HomeDesk) as the default route — see claude/home-desk-2026-09-21.md and
// STYLE_GUIDE.md §8.4. HomeMaster is kept only as a historical, rollback-only view
// behind these query flags; it is not linked from anywhere in the live site.
export default async function Home({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const query = await searchParams;
  if (query["peiwen-phase2"] === "1") return <HomeMaster phaseOne phaseTwo />;
  if (query["peiwen-phase1"] === "1") return <HomeMaster phaseOne />;
  if (query["static-reconstruction"] === "1") return <HomeMaster />;
  return <HomeDesk />;
}
