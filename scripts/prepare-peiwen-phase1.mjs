import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import sharp from "sharp";

const master = await readFile("public/home-master/master.png");
assert.equal(createHash("sha256").update(master).digest("hex"), "a84482f8854ef2d5e92cf2895a84922553fc9f023de0243175eef215b4de0b0d");
const out = "public/peiwen-phase1";
await mkdir(out, { recursive: true });
// Original artwork pixels, not the generated/reinterpreted character candidate.
const silhouette = `M870 620 C858 617 845 624 839 634 C834 645 832 662 825 674
 C816 685 809 691 812 699 C814 708 823 713 835 714
 L832 726 L826 732 L822 750 Q821 756 832 758 L828 768 L827 775
 Q831 780 844 781 L844 803 Q839 803 842 814 L842 821 Q844 826 853 825
 Q862 824 863 820 L861 803 L862 783 L870 783 L871 804 L870 818
 Q869 825 877 826 Q886 826 888 821 L887 805 L884 781
 Q896 780 905 775 L901 757 Q907 757 908 751 L904 737 L900 714
 Q910 710 909 700 C908 690 902 684 902 673 Q908 667 903 654
 C901 630 898 624 885 622 Z`;
const svg = body => Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="120" height="230" viewBox="800 608 120 230">${body}</svg>`);
const shape = svg(`<path d="${silhouette}" fill="white"/>`);
const origin = { left: 800, top: 608, width: 120, height: 230 };
await sharp(master).extract(origin).composite([{ input: shape, blend: "dest-in" }]).png().toFile(`${out}/peiwen-original.png`);
const generated = "design-assets/peiwen-phase1/origin-clean-source.png";
const patchMask = await sharp(svg(`<path d="${silhouette}" fill="white" stroke="white" stroke-width="6"/><ellipse cx="858" cy="825" rx="32" ry="7" fill="white"/>`)).blur(1.2).png().toBuffer();
// Inpainted 320px local crop starts at (704,560) in the master. Discard everything
// outside the original character silhouette, including all regenerated landscape.
const local = await sharp(generated).resize(320, 320).png().toBuffer();
await sharp(local).extract({ left: 96, top: 48, width: 120, height: 230 }).composite([{ input: patchMask, blend: "dest-in" }]).png().toFile(`${out}/origin-clean-plate.png`);
const frozen = {};
for (const file of ["public/home-master/master.png", "public/home-master/text-clean-plate.png", "public/home-master/text-regions.json", "app/home-master.module.css"]) {
  frozen[file] = createHash("sha256").update(await readFile(file)).digest("hex");
}
try {
  assert.deepEqual(JSON.parse(await readFile(`${out}/frozen-master-sha256.json`, "utf8")), frozen);
} catch (error) {
  if (error.code !== "ENOENT") throw error;
  await writeFile(`${out}/frozen-master-sha256.json`, JSON.stringify(frozen, null, 2) + "\n");
}
console.log("Original pixel sprite and silhouette-only clean plate prepared; master untouched.");
