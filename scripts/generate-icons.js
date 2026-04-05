const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const ASSETS_DIR = path.join(__dirname, "../assets/images");
const SOURCE_IMAGE = path.join(ASSETS_DIR, "icon.png");

// Tamanho do ícone iOS/Web
const ICON_SIZE = 1024;

function buildGradientSvg(size) {
  return `
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:#bf1e86;stop-opacity:1" />
          <stop offset="50%" style="stop-color:#bf1e86;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#111111;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="${size}" height="${size}" fill="url(#grad)"/>
    </svg>
  `;
}

async function generateIcons() {
  try {
    // Verificar se a imagem fonte existe
    if (!fs.existsSync(SOURCE_IMAGE)) {
      console.error(`❌ Imagem fonte não encontrada: ${SOURCE_IMAGE}`);
      process.exit(1);
    }

    console.log("🎨 Gerando ícones do app...\n");

    // Gerar icon.png principal (1024x1024 para iOS/Web)
    const iconPath = path.join(ASSETS_DIR, "icon.png");
    // iOS não aceita transparência no ícone. Criamos um fundo opaco (degradê)
    // e aplicamos o logo por cima, removendo o canal alpha.
    const iconGradient = Buffer.from(buildGradientSvg(ICON_SIZE));
    const logoSize = Math.floor(ICON_SIZE * 0.6);
    const logoBuffer = await sharp(SOURCE_IMAGE)
      .resize(logoSize, logoSize, {
        fit: "contain",
        background: { r: 255, g: 255, b: 255, alpha: 0 },
      })
      .png()
      .toBuffer();

    await sharp(iconGradient)
      .composite([
        {
          input: logoBuffer,
          left: Math.floor((ICON_SIZE - logoSize) / 2),
          top: Math.floor((ICON_SIZE - logoSize) / 2),
        },
      ])
      .png()
      .flatten({ background: "#ffffff" })
      .removeAlpha()
      .toFile(iconPath);
    console.log(`✅ Gerado: icon.png (${ICON_SIZE}x${ICON_SIZE})`);

    // Gerar splashscreen.png (com padding para evitar cortes)
    const splashPath = path.join(ASSETS_DIR, "splashscreen.png");
    await sharp(SOURCE_IMAGE)
      .resize(800, 800, {
        fit: "contain",
        background: { r: 255, g: 255, b: 255, alpha: 0 },
      })
      .png()
      .toFile(splashPath);
    console.log(`✅ Gerado: splashscreen.png (800x800 com padding)`);

    // Gerar adaptive icons do Android (432x432)
    // Safe zone do Android é ~66% do centro, então usamos 60% para dar margem
    console.log("\n📱 Gerando adaptive icons do Android...");

    // Foreground (ícone principal com padding para safe zone)
    const foregroundPath = path.join(
      ASSETS_DIR,
      "adaptive-icon-foreground.png",
    );
    const safeZoneSize = Math.floor(432 * 0.6); // 60% = ~259px
    await sharp(SOURCE_IMAGE)
      .resize(safeZoneSize, safeZoneSize, {
        fit: "contain",
        background: { r: 255, g: 255, b: 255, alpha: 0 },
      })
      .extend({
        top: Math.floor((432 - safeZoneSize) / 2),
        bottom: Math.floor((432 - safeZoneSize) / 2),
        left: Math.floor((432 - safeZoneSize) / 2),
        right: Math.floor((432 - safeZoneSize) / 2),
        background: { r: 255, g: 255, b: 255, alpha: 0 },
      })
      .png()
      .toFile(foregroundPath);
    console.log(
      `✅ Gerado: adaptive-icon-foreground.png (432x432 com safe zone)`,
    );

    // Background (degradê vermelho/laranja para roxo)
    const backgroundPath = path.join(
      ASSETS_DIR,
      "adaptive-icon-background.png",
    );

    await sharp(Buffer.from(buildGradientSvg(432)))
      .png()
      .toFile(backgroundPath);
    console.log(
      `✅ Gerado: adaptive-icon-background.png (432x432 com degradê)`,
    );

    // Monochrome (versão monocromática com safe zone)
    const monochromePath = path.join(
      ASSETS_DIR,
      "adaptive-icon-monochrome.png",
    );
    await sharp(SOURCE_IMAGE)
      .resize(safeZoneSize, safeZoneSize, {
        fit: "contain",
        background: { r: 255, g: 255, b: 255, alpha: 0 },
      })
      .greyscale()
      .extend({
        top: Math.floor((432 - safeZoneSize) / 2),
        bottom: Math.floor((432 - safeZoneSize) / 2),
        left: Math.floor((432 - safeZoneSize) / 2),
        right: Math.floor((432 - safeZoneSize) / 2),
        background: { r: 255, g: 255, b: 255, alpha: 0 },
      })
      .png()
      .toFile(monochromePath);
    console.log(
      `✅ Gerado: adaptive-icon-monochrome.png (432x432 com safe zone)`,
    );

    console.log("\n✨ Todos os ícones foram gerados com sucesso!");
    console.log(
      "\n📝 Próximo passo: Rebuild do app Android para aplicar os novos ícones",
    );
    console.log("   Execute: yarn android\n");
  } catch (error) {
    console.error("❌ Erro ao gerar ícones:", error.message);
    process.exit(1);
  }
}

generateIcons();
