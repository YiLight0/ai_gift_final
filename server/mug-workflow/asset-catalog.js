import { existsSync, readdirSync, statSync } from "node:fs";
import path from "node:path";

const IMAGE_EXTS = new Set([".png", ".jpg", ".jpeg", ".webp"]);
const ASSET_DIR_PARTS = ["public", "assets", "mugs"];
const ASSET_URL_PREFIX = "/assets/mugs";

export const CATEGORY_SPECS = {
  "META保温杯": {
    name: "META保温杯",
    mode: "single",
    imageSize: "1584x1056",
    printAreas: [
      {
        key: "main",
        label: "主体区域",
        widthMm: 240,
        heightMm: 132,
        aspectText: "240:132",
      },
    ],
  },
  "SWAG保温杯": {
    name: "SWAG保温杯",
    mode: "single",
    imageSize: "1664x928",
    printAreas: [
      {
        key: "main",
        label: "主体区域",
        widthMm: 209,
        heightMm: 120,
        aspectText: "209:120",
      },
    ],
  },
  "彩虹保温杯": {
    name: "彩虹保温杯",
    mode: "split",
    imageSize: "1664x928",
    printAreas: [
      {
        key: "top",
        label: "上方窄条区域",
        widthMm: 250.3,
        heightMm: 16,
        aspectText: "250.3:16",
      },
      {
        key: "bottom",
        label: "下方主区域",
        widthMm: 250.3,
        heightMm: 72,
        aspectText: "250.3:72",
      },
    ],
  },
};

function joinAssetPath(rootDir, ...parts) {
  return path.join(rootDir, ...ASSET_DIR_PARTS, ...parts);
}

function toAssetUrl(...parts) {
  return `${ASSET_URL_PREFIX}/${parts.map((part) => encodeURIComponent(part)).join("/")}`;
}

function isImageFile(filename) {
  return IMAGE_EXTS.has(path.extname(filename).toLowerCase());
}

function isMaskFile(filename) {
  return /mask/i.test(filename);
}

function getCategoryDir(rootDir, categoryName) {
  return joinAssetPath(rootDir, categoryName);
}

function pickExisting(dir, candidates) {
  for (const name of candidates) {
    const fullPath = path.join(dir, name);
    if (existsSync(fullPath)) {
      return { path: fullPath, filename: name, url: toAssetUrl(path.basename(dir), name) };
    }
  }
  return null;
}

export function getCategorySpec(categoryName) {
  return CATEGORY_SPECS[categoryName] ?? CATEGORY_SPECS["META保温杯"];
}

export function listCatalog(rootDir) {
  const orderedNames = Object.keys(CATEGORY_SPECS);

  return orderedNames
    .map((categoryName) => {
      const spec = getCategorySpec(categoryName);
      const categoryDir = getCategoryDir(rootDir, categoryName);
      const exists = existsSync(categoryDir) && statSync(categoryDir).isDirectory();
      const files = exists ? readdirSync(categoryDir) : [];
      const styles = files
        .filter((name) => isImageFile(name) && !isMaskFile(name))
        .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
        .map((filename) => ({
          id: filename,
          filename,
          url: toAssetUrl(categoryName, filename),
        }));

      return {
        id: categoryName,
        name: categoryName,
        mode: spec.mode,
        image_size: spec.imageSize,
        print_areas: spec.printAreas,
        exists,
        styles,
      };
    })
    .filter((item) => item.exists || item.styles.length > 0 || orderedNames.includes(item.id));
}

export function getStyleAssetSelection(rootDir, categoryName, styleFilename) {
  const spec = getCategorySpec(categoryName);
  const categoryDir = getCategoryDir(rootDir, categoryName);
  const styles = listCatalog(rootDir).find((item) => item.id === categoryName)?.styles ?? [];
  const fallbackStyle = styles[0]?.filename || "1.png";
  const filename = styleFilename || fallbackStyle;
  const mugPath = path.join(categoryDir, filename);
  const mugUrl = toAssetUrl(categoryName, filename);
  const mugExists = existsSync(mugPath);

  const singleMask = pickExisting(categoryDir, ["mask.png", "Mask.png"]);
  const topMask = pickExisting(categoryDir, ["mask-top.png", "mask_top.png", "top-mask.png", "mask-upper.png", "mask_up.png", "mask1.png"]);
  const bottomMask = pickExisting(categoryDir, ["mask-bottom.png", "mask_bottom.png", "bottom-mask.png", "mask-lower.png", "mask_down.png", "mask2.png"]);

  return {
    categoryName,
    mode: spec.mode,
    filename,
    mugPath,
    mugUrl,
    mugExists,
    mask: singleMask,
    masks: {
      top: topMask,
      bottom: bottomMask,
    },
    spec,
  };
}
