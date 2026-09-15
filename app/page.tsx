import HomeHub from "./home-hub";
import HomeMaster from "./home-master";

export default async function Home({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const query = await searchParams;
  if (query["peiwen-phase2"] === "1") return <HomeMaster phaseOne phaseTwo />;
  if (query["peiwen-phase1"] === "1") return <HomeMaster phaseOne />;
  if (query["static-reconstruction"] === "1") return <HomeMaster />;
  return <HomeHub />;
}
