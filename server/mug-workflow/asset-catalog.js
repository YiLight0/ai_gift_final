import { existsSync } from "node:fs";
import path from "node:path";
import { CATALOG_DATA, DEFAULT_CATEGORY_ID } from "./catalog-data.js";

const ASSET_DIR_PARTS = ["public", "assets", "mugs"];
const ASSET_URL_PREFIX = "/assets/mugs";

function joinAssetPath(rootDir, ...parts) {
  return path.join(rootDir, ...ASSET_DIR_PARTS, ...parts);
}

function toAssetUrl(...parts) {
  return `${ASSET_URL_PREFIX}/${parts.map((part) => encodeURIComponent(part)).join("/")}`;
}

function toMaskAsset(categoryId, filename) {
  if (!filename) {
    return null;
  }

  return {
    path: null,
    filename,
    url: toAssetUrl(categoryId, filename),
  };
}

export function getDefaultCategoryId() {
  return DEFAULT_CATEGORY_ID;
}

export function getCategorySpec(categoryId = DEFAULT_CATEGORY_ID) {
  return (
    CATALOG_DATA.find((item) => item.id === categoryId) ??
    CATALOG_DATA.find((item) => item.id === DEFAULT_CATEGORY_ID)
  );
}

export function listCatalog() {
  return CATALOG_DATA.map((item) => ({
    id: item.id,
    name: item.name,
    mode: item.mode,
    image_size: item.imageSize,
    print_areas: item.printAreas,
    exists: true,
    styles: item.styles.map((filename) => ({
      id: filename,
      filename,
      url: toAssetUrl(item.id, filename),
    })),
  }));
}

export function getStyleAssetSelection(rootDir, categoryId, styleFilename) {
  const spec = getCategorySpec(categoryId);
  const fallbackStyle = spec.styles[0] || "1.png";
  const filename = styleFilename || fallbackStyle;
  const mugPath = joinAssetPath(rootDir, spec.id, filename);
  const mugUrl = toAssetUrl(spec.id, filename);

  const singleMaskPath = spec.masks?.single
    ? joinAssetPath(rootDir, spec.id, spec.masks.single)
    : null;
  const topMaskPath = spec.masks?.top ? joinAssetPath(rootDir, spec.id, spec.masks.top) : null;
  const bottomMaskPath = spec.masks?.bottom
    ? joinAssetPath(rootDir, spec.id, spec.masks.bottom)
    : null;

  return {
    categoryName: spec.name,
    categoryId: spec.id,
    mode: spec.mode,
    filename,
    mugPath,
    mugUrl,
    mugExists: existsSync(mugPath),
    mask:
      spec.masks?.single && singleMaskPath && existsSync(singleMaskPath)
        ? { path: singleMaskPath, filename: spec.masks.single, url: toAssetUrl(spec.id, spec.masks.single) }
        : toMaskAsset(spec.id, spec.masks?.single),
    masks: {
      top:
        spec.masks?.top && topMaskPath && existsSync(topMaskPath)
          ? { path: topMaskPath, filename: spec.masks.top, url: toAssetUrl(spec.id, spec.masks.top) }
          : toMaskAsset(spec.id, spec.masks?.top),
      bottom:
        spec.masks?.bottom && bottomMaskPath && existsSync(bottomMaskPath)
          ? {
              path: bottomMaskPath,
              filename: spec.masks.bottom,
              url: toAssetUrl(spec.id, spec.masks.bottom),
            }
          : toMaskAsset(spec.id, spec.masks?.bottom),
    },
    spec,
  };
}
