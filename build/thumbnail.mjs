// scripts/build-thumbnails.js
import sharp from "sharp";
import fs from "node:fs/promises";
import path from "node:path";

const SOURCE_DIR = "src/images";
const TARGET_DIR = "dist/thumbnails";

async function run() {
  await fs.mkdir(TARGET_DIR, { recursive: true });

  const files = await fs.readdir(SOURCE_DIR);

  for (const file of files) {
    const inputPath = path.join(SOURCE_DIR, file);
    const outputPath = path.join(TARGET_DIR, file);

    const stat = await fs.stat(inputPath);
    if (!stat.isFile()) continue;

    await sharp(inputPath)
      .resize(250, 250, {
        fit: "cover",
        position: "center",
      })
      .toFile(outputPath);
  }

  console.log("Thumbnails erzeugt.");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
