import { readFile } from "node:fs/promises";
import path from "node:path";
import { API_BASE_URL, API_KEY, ensureApiKey } from "./config.js";

function stripCodeFence(text) {
  return String(text || "")
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```$/, "")
    .trim();
}

function extractJson(text) {
  const cleaned = stripCodeFence(text);
  try {
    return JSON.parse(cleaned);
  } catch {
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");
    if (start >= 0 && end > start) {
      return JSON.parse(cleaned.slice(start, end + 1));
    }
    throw new Error("模型返回内容不是有效 JSON。");
  }
}

export async function postJson(endpoint, payload) {
  ensureApiKey();
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`API 请求失败 (${response.status}): ${text}`);
  }

  return response.json();
}

export function parseChatJsonResponse(data) {
  const content = data?.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error("对话接口未返回有效内容。");
  }
  return extractJson(content);
}

export async function fileToDataUrl(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const mime = ext === ".png" ? "image/png" : "application/octet-stream";
  const buffer = await readFile(filePath);
  return `data:${mime};base64,${buffer.toString("base64")}`;
}

export function pickImageUrl(imageItem) {
  return imageItem?.url || imageItem?.image_url || imageItem?.image || imageItem?.uri || null;
}

export function pickImageBase64(imageItem) {
  const raw = imageItem?.b64_json || imageItem?.base64 || imageItem?.b64 || null;
  if (!raw) {
    return null;
  }
  return String(raw).replace(/^data:image\/[a-zA-Z+]+;base64,/, "");
}
