import { DESIGN_IMAGE_MODEL } from "./config.js";
import { pickImageBase64, pickImageUrl, postJson } from "./siliconflow.js";
import { getCategorySpec } from "./asset-catalog.js";

async function requestDesignImage(payload) {
  const data = await postJson("/images/generations", payload);
  const firstImage = data?.images?.[0];
  if (!firstImage) {
    throw new Error("图片接口没有返回设计图。");
  }

  return {
    imageUrl: pickImageUrl(firstImage),
    imageBase64: pickImageBase64(firstImage),
  };
}

function buildSplitPrompt(basePrompt, area) {
  if (area.key === "top") {
    return `${basePrompt}\nDesign only for the top narrow band. Printable area ${area.widthMm}mm x ${area.heightMm}mm. Keep it extremely horizontal, concise, edge-to-edge, decorative, and suitable for wrapping around the upper strip of the mug. No large central illustration.`;
  }

  return `${basePrompt}\nDesign only for the lower main panel. Printable area ${area.widthMm}mm x ${area.heightMm}mm. Keep it horizontal, visually clear, and suitable as the main artwork of the mug. Leave safe margins.`;
}

export async function generateDesign({ categoryName, prompt, negativePrompt }) {
  const spec = getCategorySpec(categoryName);

  if (spec.mode === "single") {
    const result = await requestDesignImage({
      model: DESIGN_IMAGE_MODEL,
      prompt,
      negative_prompt: negativePrompt,
      image_size: spec.imageSize,
      num_inference_steps: 30,
      cfg: 4,
    });

    return {
      mode: "siliconflow",
      previewImageUrl: result.imageUrl,
      previewImageBase64: result.imageBase64,
      designParts: [
        {
          key: "main",
          imageUrl: result.imageUrl,
          imageBase64: result.imageBase64,
        },
      ],
    };
  }

  const parts = [];
  for (const area of spec.printAreas) {
    const result = await requestDesignImage({
      model: DESIGN_IMAGE_MODEL,
      prompt: buildSplitPrompt(prompt, area),
      negative_prompt: negativePrompt,
      image_size: spec.imageSize,
      num_inference_steps: 30,
      cfg: 4,
    });

    parts.push({
      key: area.key,
      imageUrl: result.imageUrl,
      imageBase64: result.imageBase64,
    });
  }

  const previewSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1200" height="900" viewBox="0 0 1200 900" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="900" rx="32" fill="#fff7f5"/>
  <rect x="80" y="70" width="1040" height="180" rx="24" fill="#ffffff" stroke="#f4c9c1" stroke-width="4"/>
  <rect x="80" y="300" width="1040" height="520" rx="24" fill="#ffffff" stroke="#f4c9c1" stroke-width="4"/>
  <image href="${parts[0]?.imageUrl || ""}" x="110" y="95" width="980" height="130" preserveAspectRatio="xMidYMid meet"/>
  <image href="${parts[1]?.imageUrl || ""}" x="110" y="325" width="980" height="470" preserveAspectRatio="xMidYMid meet"/>
</svg>`;

  return {
    mode: "siliconflow",
    previewSvg,
    designParts: parts,
  };
}
