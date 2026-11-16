import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const frontendDir = path.join(rootDir, 'frontend');

const require = createRequire(import.meta.url);
const sharp = require(path.join(frontendDir, 'node_modules', 'sharp'));

const logoPath = path.join(frontendDir, 'public', 'logo.jpeg');

if (!fs.existsSync(logoPath)) {
  console.error(`Source logo not found at ${logoPath}`);
  process.exit(1);
}

async function buildIcons() {
  console.log('Reading source logo:', logoPath);

  // 1. Generate 512x512 app icon
  const iconAppPath = path.join(frontendDir, 'src', 'app', 'icon.png');
  await sharp(logoPath)
    .resize(512, 512, { fit: 'cover', position: 'center' })
    .png()
    .toFile(iconAppPath);
  console.log('Created:', iconAppPath);

  // 2. Generate 180x180 apple touch icon
  const appleIconAppPath = path.join(frontendDir, 'src', 'app', 'apple-icon.png');
  await sharp(logoPath)
    .resize(180, 180, { fit: 'cover', position: 'center' })
    .png()
    .toFile(appleIconAppPath);
  console.log('Created:', appleIconAppPath);

  // 3. Generate multi-size favicon.ico (16x16, 32x32, 48x48)
  const sizes = [16, 32, 48];
  const images = [];

  for (const s of sizes) {
    const buf = await sharp(logoPath)
      .resize(s, s, { fit: 'cover', position: 'center' })
      .png()
      .toBuffer();
    images.push({ size: s, buffer: buf });
  }

  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // ICO type 1 = icon
  header.writeUInt16LE(images.length, 4); // number of images

  let offset = 6 + (16 * images.length);
  const entryBuffers = [];

  for (const img of images) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(img.size, 0); // width
    entry.writeUInt8(img.size, 1); // height
    entry.writeUInt8(0, 2); // color count
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // planes
    entry.writeUInt16LE(32, 6); // bpp
    entry.writeUInt32LE(img.buffer.length, 8); // size
    entry.writeUInt32LE(offset, 12); // offset
    entryBuffers.push(entry);
    offset += img.buffer.length;
  }

  const icoBuffer = Buffer.concat([header, ...entryBuffers, ...images.map((i) => i.buffer)]);

  const faviconAppPath = path.join(frontendDir, 'src', 'app', 'favicon.ico');
  fs.writeFileSync(faviconAppPath, icoBuffer);
  console.log('Created:', faviconAppPath);

  console.log('All icons generated successfully!');
}

buildIcons().catch((err) => {
  console.error('Error generating icons:', err);
  process.exit(1);
});
