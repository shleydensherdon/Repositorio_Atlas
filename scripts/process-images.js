const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const heicConvert = require('heic-convert');

const ROOT_DIR = path.resolve(__dirname, '..');
const OUTPUT_DIR = path.join(ROOT_DIR, 'public', 'uploads');
const PRODUCTS_OUTPUT_DIR = path.join(OUTPUT_DIR, 'products');

const FOLDERS = [
  { name: 'loica sanitaria', categorySlug: 'loica-sanitaria', title: 'Loiça Sanitária' },
  { name: 'portas', categorySlug: 'portas', title: 'Portas' },
  { name: 'tijoleiras', categorySlug: 'tijoleiras', title: 'Tijoleiras' },
  { name: 'torneiras', categorySlug: 'torneiras', title: 'Torneiras' },
];

async function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

async function convertAndOptimizeImage(inputPath, outputPathJpg, outputPathWebp) {
  const ext = path.extname(inputPath).toLowerCase();
  let imageBuffer = fs.readFileSync(inputPath);

  if (ext === '.heic') {
    try {
      imageBuffer = await heicConvert({
        buffer: imageBuffer,
        format: 'JPEG',
        quality: 0.92,
      });
    } catch (err) {
      console.error(`Error converting HEIC ${inputPath}:`, err.message);
      return false;
    }
  }

  try {
    // Save optimized JPEG
    await sharp(imageBuffer)
      .resize(1600, 1600, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 85, progressive: true })
      .toFile(outputPathJpg);

    // Save modern WebP
    await sharp(imageBuffer)
      .resize(1600, 1600, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 85 })
      .toFile(outputPathWebp);

    return true;
  } catch (err) {
    console.error(`Error optimizing image ${inputPath}:`, err.message);
    return false;
  }
}

async function processAll() {
  console.log('--- Processando Assets Reais da Atlas Materials ---');
  await ensureDir(PRODUCTS_OUTPUT_DIR);
  await ensureDir(path.join(ROOT_DIR, 'public'));

  // 1. Process Logo
  const logoSource = path.join(ROOT_DIR, 'Logotipo', 'Atlas 1.jpg.jpeg');
  const logoTarget = path.join(ROOT_DIR, 'public', 'logo.png');
  if (fs.existsSync(logoSource)) {
    fs.copyFileSync(logoSource, logoTarget);
    console.log('✓ Logotipo copiado para /public/logo.png');
  }

  const manifest = [];

  for (const folder of FOLDERS) {
    const folderPath = path.join(ROOT_DIR, folder.name);
    if (!fs.existsSync(folderPath)) {
      console.warn(`Pasta ${folder.name} não encontrada.`);
      continue;
    }

    const files = fs.readdirSync(folderPath).filter(f => !f.startsWith('.'));
    console.log(`Processando pasta [${folder.name}]: ${files.length} ficheiros encontrados...`);

    const folderCategoryDir = path.join(PRODUCTS_OUTPUT_DIR, folder.categorySlug);
    await ensureDir(folderCategoryDir);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const ext = path.extname(file).toLowerCase();
      const baseName = path.basename(file, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
      const inputPath = path.join(folderPath, file);

      const targetJpg = path.join(folderCategoryDir, `${baseName}.jpg`);
      const targetWebp = path.join(folderCategoryDir, `${baseName}.webp`);

      const success = await convertAndOptimizeImage(inputPath, targetJpg, targetWebp);
      if (success) {
        manifest.push({
          categorySlug: folder.categorySlug,
          categoryTitle: folder.title,
          originalName: file,
          webpPath: `/uploads/products/${folder.categorySlug}/${baseName}.webp`,
          jpgPath: `/uploads/products/${folder.categorySlug}/${baseName}.jpg`,
          isPrimary: i === 0,
          index: i
        });
        console.log(`  ✓ Otimizado: ${folder.categorySlug}/${baseName}.webp`);
      }
    }
  }

  fs.writeFileSync(
    path.join(ROOT_DIR, 'public', 'uploads', 'manifest.json'),
    JSON.stringify(manifest, null, 2)
  );

  console.log(`\nConcluído! ${manifest.length} imagens processadas e salvas no diretório público.`);
}

processAll().catch(err => {
  console.error('Fatal error during image processing:', err);
  process.exit(1);
});
