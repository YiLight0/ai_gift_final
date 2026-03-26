import { handleMugWorkflowRequest } from "../server/mug-workflow/handler.js";

export default async function handler(req, res) {
  await handleMugWorkflowRequest(req, res, "/api/generate-design");
}
