import { createMugWorkflowMiddleware } from "./mug-workflow/handler.js";

export function mugWorkflowPlugin() {
  return {
    name: "mug-workflow-plugin",
    configureServer(server) {
      server.middlewares.use(createMugWorkflowMiddleware());
    },
    configurePreviewServer(server) {
      server.middlewares.use(createMugWorkflowMiddleware());
    },
  };
}
