const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const SVG = "assets/brand/mark.svg";
const OUT = "assets";
const SIZE = 1024;
const INNER = 660;
const BG = { r: 0x05, g: 0x07, b: 0x0a, alpha: 1 };

async function main() {
  const svg = fs.readFileSync(SVG);

  // Render the SVG once at 660x660. density 300 is plenty.
  const logoPng = await sharp(svg, { density: 300 })
    .resize(INNER, INNER, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  // 1. FOREGROUND
  await sharp({
    create: { width: SIZE, height: SIZE, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
  })
    .composite([{ input: logoPng, gravity: "center" }])
    .png()
    .toFile(path.join(OUT, "android-icon-foreground.png"));

  // 2. BACKGROUND
  await sharp({
    create: { width: SIZE, height: SIZE, channels: 4, background: BG },
  })
    .png()
    .toFile(path.join(OUT, "android-icon-background.png"));

  // 3. MONOCHROME — rebuild from raw alpha as white silhouette
  const { data, info } = await sharp(logoPng)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const mono = Buffer.alloc(data.length);
  for (let i = 0; i < data.length; i += 4) {
    mono[i] = 255;
    mono[i + 1] = 255;
    mono[i + 2] = 255;
    mono[i + 3] = data[i + 3];
  }

  await sharp({
    create: { width: SIZE, height: SIZE, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
  })
    .composite([
      { input: mono, raw: { width: info.width, height: info.height, channels: 4 }, gravity: "center" },
    ])
    .png()
    .toFile(path.join(OUT, "android-icon-monochrome.png"));

  for (const f of ["android-icon-foreground.png", "android-icon-background.png", "android-icon-monochrome.png"]) {
    const m = await sharp(path.join(OUT, f)).metadata();
    console.log(`✅ ${f} — ${m.width}x${m.height}`);
  }
}

main().catch((e) => { console.error("❌", e); process.exit(1); });
