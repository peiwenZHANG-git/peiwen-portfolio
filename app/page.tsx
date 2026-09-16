import HomeHub from "./home-hub";
import HomeMaster from "./home-master";

export default async function Home({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const query = await searchParams;
  if (query["peiwen-phase5"] === "1") return <HomeMaster phaseOne phaseTwo phaseThree phaseFour phaseFive />;
  if (query["peiwen-phase4"] === "1") return <HomeMaster phaseOne phaseTwo phaseThree phaseFour />;
  if (query["peiwen-phase3"] === "1") return <HomeMaster phaseOne phaseTwo phaseThree />;
  if (query["peiwen-phase2"] === "1") return <HomeMaster phaseOne phaseTwo />;
  if (query["peiwen-phase1"] === "1") return <HomeMaster phaseOne />;
  if (query["static-reconstruction"] === "1") return <HomeMaster />;
  return <HomeHub />;
}
