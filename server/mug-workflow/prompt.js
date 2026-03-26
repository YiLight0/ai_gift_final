import { CHAT_MODEL } from "./config.js";
import { parseChatJsonResponse, postJson } from "./siliconflow.js";
import { getCategorySpec, getDefaultCategoryId } from "./asset-catalog.js";

const NEGATIVE_TEMPLATE = "blurry, deformed, cropped, product photo, mockup, watermark, text error";

function summarizeUserText(userText) {
  const cleaned = userText.trim().replace(/\s+/g, " ");
  if (!cleaned) {
    return "a warm and friendly custom illustration for a mug";
  }
  return cleaned;
}

function buildCategoryConstraint(categoryId) {
  const spec = getCategorySpec(categoryId);
  if (spec.mode === "single") {
    const area = spec.printAreas[0];
    return `该品类只有一个印刷区域，尺寸 ${area.widthMm}mm x ${area.heightMm}mm，比例 ${area.aspectText}，需要横向构图、居中布局，并保留安全边距。`;
  }

  const top = spec.printAreas[0];
  const bottom = spec.printAreas[1];
  return `该品类有两个独立印刷区域：上方区域尺寸 ${top.widthMm}mm x ${top.heightMm}mm，下方区域尺寸 ${bottom.widthMm}mm x ${bottom.heightMm}mm。请整理成统一主题，其中上方更适合窄条纹样，下方更适合作为主画面。`;
}

export async function buildPrompt(userText, categoryId = getDefaultCategoryId()) {
  const summary = summarizeUserText(userText);
  const spec = getCategorySpec(categoryId);
  const categoryConstraint = buildCategoryConstraint(categoryId);

  const data = await postJson("/chat/completions", {
    model: CHAT_MODEL,
    temperature: 0.7,
    max_tokens: 700,
    stream: false,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: [
          "你是一个杯子图案提示词助手。",
          "请基于完整对话整理需求，而不是只看最后一句。",
          "请把用户需求整理成适合生成杯身平面图案的 prompt。",
          "输出必须是 JSON，并且只包含 reply、prompt、negative_prompt 三个字段。",
          categoryConstraint,
          "prompt 必须明确包含这些约束：horizontal composition、centered layout、no mockup、no product、clean background、safe margins。",
          `negative_prompt 固定为: ${NEGATIVE_TEMPLATE}`,
          "reply 用简短中文总结你理解到的设计方向。",
        ].join("\n"),
      },
      {
        role: "user",
        content: `品类：${spec.name}\n完整对话如下：\n${summary}`,
      },
    ],
  });

  const parsed = parseChatJsonResponse(data);
  return {
    reply: parsed.reply || `好的，我会按 ${spec.name} 的印刷区域来整理这段对话里的设计需求。`,
    prompt: parsed.prompt,
    negative_prompt: parsed.negative_prompt || NEGATIVE_TEMPLATE,
  };
}
