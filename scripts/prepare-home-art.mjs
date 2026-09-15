// Deterministic derivatives of existing Hub drawings; source files stay unchanged.
import sharp from "sharp";

const { data, info } = await sharp("design-assets/hub/house-exterior-v1.jpg")
  .extract({ left: 330, top: 90, width: 570, height: 660 }).ensureAlpha()
  .raw().toBuffer({ resolveWithObject: true });
// Remove connected exterior paper only; enclosed walls/windows retain their original paint.
const visited = new Uint8Array(info.width * info.height);
const queue = [];
for (let x = 0; x < info.width; x++) queue.push(x, (info.height - 1) * info.width + x);
for (let y = 0; y < info.height; y++) queue.push(y * info.width, y * info.width + info.width - 1);
for (let head = 0; head < queue.length; head++) {
  const index = queue[head];
  if (visited[index]) continue;
  visited[index] = 1;
  const offset = index * 4;
  const rgb = [data[offset], data[offset + 1], data[offset + 2]];
  if (Math.min(...rgb) < 205 || Math.max(...rgb) - Math.min(...rgb) > 45) continue;
  data[offset + 3] = 0;
  const x = index % info.width, y = Math.floor(index / info.width);
  if (x) queue.push(index - 1);
  if (x + 1 < info.width) queue.push(index + 1);
  if (y) queue.push(index - info.width);
  if (y + 1 < info.height) queue.push(index + info.width);
}
await sharp(data, { raw: info }).webp({ quality: 88 })
  .toFile("public/assets/hub/house-drawing.webp");
await sharp("design-assets/hub/fence-v1.jpg")
  .extract({ left: 300, top: 200, width: 800, height: 385 })
  .resize({ width: 600 }).webp({ quality: 85 })
  .toFile("public/assets/hub/fence-drawing.webp");
