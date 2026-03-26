import path from "node:path";
import { EDIT_IMAGE_MODEL } from "./config.js";
import { fileToDataUrl, pickImageBase64, pickImageUrl, postJson } from "./siliconflow.js";
import { getStyleAssetSelection } from "./asset-catalog.js";

function getDesignInput(part) {
  if (!part) {
    return null;
  }
  if (part.imageUrl) {
    return part.imageUrl;
  }
  if (part.imageBase64) {
    return `data:image/png;base64,${part.imageBase64}`;
  }
  return null;
}

async function resolveImageInput(rootDir, input) {
  if (!input) {
    throw new Error("缺少设计图输入。");
  }

  if (/^https?:\/\//i.test(input) || /^data:/i.test(input)) {
    return input;
  }

  if (input.startsWith("/")) {
    return fileToDataUrl(path.join(rootDir, input.replace(/^\//, "")));
  }

  throw new Error("设计图输入格式不支持。");
}

async function editOnce(baseImage, maskImage, designImage, prompt) {
  const data = await postJson("/images/generations", {
    model: EDIT_IMAGE_MODEL,
    prompt,
    image: baseImage,
    image2: maskImage,
    image3: designImage,
    num_inference_steps: 30,
    cfg: 4,
  });

  const firstImage = data?.images?.[0];
  if (!firstImage) {
    throw new Error("图片接口没有返回效果图。");
  }

  const imageUrl = pickImageUrl(firstImage);
  const imageBase64 = pickImageBase64(firstImage);
  if (imageBase64) {
    return `data:image/png;base64,${imageBase64}`;
  }
  if (imageUrl) {
    return imageUrl;
  }
  throw new Error("编辑模型没有返回可用图片。");
}

export async function renderMockup({ rootDir, categoryName, styleFilename, designParts }) {
  const assets = getStyleAssetSelection(rootDir, categoryName, styleFilename);
  if (!assets.mugExists) {
    throw new Error(`缺少款式原图: ${assets.filename}`);
  }

  let currentBase = await fileToDataUrl(assets.mugPath);

  if (assets.mode === "single") {
    if (!assets.mask) {
      throw new Error("缺少单区域蒙版文件: mask.png");
    }

    const designImage = await resolveImageInput(rootDir, getDesignInput(designParts?.[0]));
    currentBase = await editOnce(
      currentBase,
      await fileToDataUrl(assets.mask.path),
      designImage,
      "Apply the provided design onto the mug surface, only edit the masked region, keep original lighting and material, realistic mug mockup, do not change other parts. The top and bottom edges of the generated design must align tightly with the top and bottom edges of the mask area, then wrap naturally around the mug surface.",
    );
  } else {
    if (!assets.masks.top || !assets.masks.bottom) {
      throw new Error("彩虹保温杯缺少上下两块蒙版。请提供 mask-top.png 和 mask-bottom.png，或兼容命名文件。");
    }

    const topDesign = await resolveImageInput(rootDir, getDesignInput(designParts?.find((item) => item.key === "top")));
    currentBase = await editOnce(
      currentBase,
      await fileToDataUrl(assets.masks.top.path),
      topDesign,
      "Apply the provided design onto the top narrow printable band of the mug. Only edit the masked top region. Keep the design tightly aligned to the top band boundaries and wrap it naturally around the mug. Preserve all other parts, materials, lighting, and perspective.",
    );

    const bottomDesign = await resolveImageInput(rootDir, getDesignInput(designParts?.find((item) => item.key === "bottom")));
    currentBase = await editOnce(
      currentBase,
      await fileToDataUrl(assets.masks.bottom.path),
      bottomDesign,
      "Apply the provided design onto the lower main printable region of the mug. Only edit the masked bottom region. Keep the top narrow band unchanged, align the bottom design tightly to the mask boundaries, and wrap it naturally around the mug. Preserve all other parts, materials, lighting, and perspective.",
    );
  }

  return {
    mode: "siliconflow",
    imageUrl: /^https?:\/\//i.test(currentBase) ? currentBase : null,
    imageBase64: /^data:image\/png;base64,/.test(currentBase) ? currentBase.replace(/^data:image\/png;base64,/, "") : null,
    assets,
  };
}
