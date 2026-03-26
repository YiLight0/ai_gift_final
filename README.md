# AI 的礼物

一个面向用户的 AI 文创定制平台前端站点，当前已经接入三种杯型的真实工作流：

- 对话收集需求
- 整理用户需求摘要
- 生成杯身图案
- 渲染杯子效果图

项目基于 `React + TypeScript + Vite`，并在 `api/` 下提供了可直接部署到 Vercel 的服务端接口。

## 本地运行

```bash
pnpm install
pnpm dev
```

默认访问：

```text
http://127.0.0.1:5173
```

## 环境变量

复制 `.env.example` 为 `.env.local`，至少填写：

```bash
SILICONFLOW_API_KEY=your_siliconflow_api_key
```

可选变量：

```bash
SILICONFLOW_API_BASE_URL=https://api.siliconflow.cn/v1
BUILD_MODE=prod
```

## Vercel 部署

1. 将本项目上传到 GitHub。
2. 在 Vercel 中导入该仓库。
3. Framework Preset 选择 `Vite`。
4. 在 Vercel 项目环境变量中配置：
   - `SILICONFLOW_API_KEY`
   - `SILICONFLOW_API_BASE_URL`（可选）
   - `BUILD_MODE=prod`（可选）
5. 直接部署。

当前项目已经包含：

- `vercel.json`
- `api/catalog.js`
- `api/prompt.js`
- `api/generate-design.js`
- `api/render-mockup.js`

这些文件用于让本地开发和 Vercel 部署共用同一套杯子工作流接口。

## 常用命令

```bash
pnpm dev
pnpm lint
pnpm build
pnpm preview
```

## 目录说明

- `src/`：前端页面与组件
- `public/assets/mugs/`：杯型素材与蒙版
- `server/mug-workflow/`：工作流核心逻辑
- `api/`：Vercel Serverless Functions 入口

## 发布前检查

- 确认 `.env.local` 没有提交到仓库
- 确认 `SILICONFLOW_API_KEY` 只配置在本地或 Vercel 环境变量中
- 运行 `pnpm lint`
- 运行 `pnpm build`
