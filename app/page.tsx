import HomeDesk from "./home-desk";
import HomeHub from "./home-hub";
import HomeMaster from "./home-master";

// 2026-09-24: the desk-scene Home (claude/home-opening-2026-09-24.md) is the default
// `/`, same as on visual-direction-v2. The old valley hub stays reachable at ?hub=1.
export default async function Home({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const query = await searchParams;
  if (query["peiwen-phase5"] === "1") return <HomeMaster phaseOne phaseTwo phaseThree phaseFour phaseFive />;
  if (query["peiwen-phase4"] === "1") return <HomeMaster phaseOne phaseTwo phaseThree phaseFour />;
  if (query["peiwen-phase3"] === "1") return <HomeMaster phaseOne phaseTwo phaseThree />;
  if (query["peiwen-phase2"] === "1") return <HomeMaster phaseOne phaseTwo />;
  if (query["peiwen-phase1"] === "1") return <HomeMaster phaseOne />;
  if (query["static-reconstruction"] === "1") return <HomeMaster />;
  // 2026-09-24: the desk-scene Home (claude/home-opening-2026-09-24.md) is the default
  // `/`, same as on visual-direction-v2. The old valley hub stays reachable at ?hub=1.
  if (query["hub"] === "1") return <HomeHub />;
  return <HomeDesk />;
}
