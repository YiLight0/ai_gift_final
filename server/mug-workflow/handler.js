import path from "node:path";
import { fileURLToPath } from "node:url";
import { getDefaultCategoryId, listCatalog } from "./asset-catalog.js";
import { buildPrompt } from "./prompt.js";
import { generateDesign } from "./generate.js";
import { renderMockup } from "./render.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..", "..");

function getPathname(url) {
  return new URL(url || "/", "http://127.0.0.1").pathname;
}

function sendJson(res, statusCode, payload) {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(payload));
}

function getBody(req) {
  return new Promise((resolve, reject) => {
    let raw = "";
    req.on("data", (chunk) => {
      raw += chunk;
    });
    req.on("end", () => {
      if (!raw) {
        resolve({});
        return;
      }

      try {
        resolve(JSON.parse(raw));
      } catch {
        reject(new Error("Invalid JSON body"));
      }
    });
    req.on("error", reject);
  });
}

function svgToDataUrl(svg) {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

async function finalizeImageResult(prefix, result) {
  if (result.previewSvg) {
    return svgToDataUrl(result.previewSvg);
  }
  if (result.previewImageUrl) {
    return result.previewImageUrl;
  }
  if (result.previewImageBase64) {
    return `data:image/png;base64,${result.previewImageBase64}`;
  }
  if (result.imageUrl) {
    return result.imageUrl;
  }
  if (result.imageBase64) {
    return `data:image/png;base64,${result.imageBase64}`;
  }
  throw new Error(`${prefix} 接口没有返回可用的图片地址。`);
}

async function finalizeDesignParts(designParts = []) {
  return Promise.all(
    designParts.map(async (part) => {
      if (part.imageUrl || !part.imageBase64) {
        return part;
      }
      return {
        ...part,
        imageUrl: `data:image/png;base64,${part.imageBase64}`,
      };
    }),
  );
}

async function handleApi(req, res, pathname) {
  if (req.method === "GET" && pathname === "/api/catalog") {
    sendJson(res, 200, { categories: listCatalog(projectRoot) });
    return true;
  }

  if (req.method === "POST" && pathname === "/api/prompt") {
    const body = await getBody(req);
    const result = await buildPrompt(
      body.user_text ?? "",
      body.category_name ?? getDefaultCategoryId(),
    );
    sendJson(res, 200, result);
    return true;
  }

  if (req.method === "POST" && pathname === "/api/generate-design") {
    const body = await getBody(req);
    const result = await generateDesign({
      categoryName: body.category_name ?? getDefaultCategoryId(),
      prompt: body.prompt ?? "",
      negativePrompt: body.negative_prompt ?? "",
    });
    const designParts = await finalizeDesignParts(result.designParts ?? []);
    const previewUrl =
      result.previewSvg || result.previewImageUrl || result.previewImageBase64
        ? await finalizeImageResult("design", result)
        : designParts[0]?.imageUrl ?? null;

    sendJson(res, 200, {
      image_url: previewUrl,
      mode: result.mode,
      design_parts: designParts,
    });
    return true;
  }

  if (req.method === "POST" && pathname === "/api/render-mockup") {
    const body = await getBody(req);
    const result = await renderMockup({
      rootDir: projectRoot,
      categoryName: body.category_name ?? getDefaultCategoryId(),
      styleFilename: body.style_filename ?? "",
      designParts: body.design_parts ?? [],
    });
    const fileUrl = await finalizeImageResult("mockup", result);
    sendJson(res, 200, {
      mockup_image_url: fileUrl,
      mode: result.mode,
      assets: result.assets,
    });
    return true;
  }

  return false;
}

export async function handleMugWorkflowRequest(req, res, pathnameOverride) {
  const pathname = pathnameOverride || getPathname(req.url);
  try {
    const handled = await handleApi(req, res, pathname);
    if (!handled) {
      sendJson(res, 404, { error: "Not found" });
    }
  } catch (error) {
    sendJson(res, 500, { error: error.message || "Server error" });
  }
}

export function createMugWorkflowMiddleware() {
  return async (req, res, next) => {
    const pathname = getPathname(req.url);

    if (!pathname.startsWith("/api/")) {
      next();
      return;
    }

    const handledPaths = new Set([
      "/api/catalog",
      "/api/prompt",
      "/api/generate-design",
      "/api/render-mockup",
    ]);

    if (!handledPaths.has(pathname)) {
      next();
      return;
    }

    await handleMugWorkflowRequest(req, res, pathname);
  };
}
