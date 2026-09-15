import sharp from "sharp";
const target = "design-assets/home-v2/home-visual-target.png";
const reconstruction = "visualizations/home-v2/static-idle-1536.png";
await sharp(target).composite([{ input: reconstruction, blend: "over", opacity: 0.5 }]).png().toFile("visualizations/home-v2/overlay-50.png");
await sharp(target).composite([{ input: reconstruction, blend: "difference" }]).modulate({ brightness: 1.8, saturation: 0 }).png().toFile("visualizations/home-v2/difference.png");
console.log("Wrote 50% overlay and difference previews.");
