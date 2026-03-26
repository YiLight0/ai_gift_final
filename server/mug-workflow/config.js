export const API_BASE_URL = process.env.SILICONFLOW_API_BASE_URL || "https://api.siliconflow.cn/v1";

export const API_KEY = process.env.SILICONFLOW_API_KEY || "";

export const CHAT_MODEL = "Pro/MiniMaxAI/MiniMax-M2.5";
export const DESIGN_IMAGE_MODEL = "Qwen/Qwen-Image";
export const EDIT_IMAGE_MODEL = "Qwen/Qwen-Image-Edit-2509";

export function ensureApiKey() {
  if (!API_KEY) {
    throw new Error("未配置 SILICONFLOW_API_KEY，请在环境变量中设置后再调用生成能力。");
  }
}
