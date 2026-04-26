# SvelteKit 本地部署指南

本文档记录了 SvelteKit 项目在本地部署的完整流程。

## 为什么需要 adapter-node？

SvelteKit 默认使用 `adapter-auto`，它会根据部署环境自动选择适配器，但不支持本地 Node.js 服务器部署。

要本地部署，需要使用 `@sveltejs/adapter-node`。

## 部署步骤

### 1. 安装 adapter-node

```bash
npm install @sveltejs/adapter-node
```

### 2. 修改 svelte.config.js

将 `adapter-auto` 替换为 `adapter-node`：

```js
// 修改前
import adapter from '@sveltejs/adapter-auto';

// 修改后
import adapter from '@sveltejs/adapter-node';
```

### 3. 构建项目

```bash
npm run build
```

构建完成后会生成 `build` 目录，包含可执行的服务器文件。

### 4. 启动服务

```bash
node build
```

默认运行在 `http://localhost:3000`。

### 5. 停止服务

在终端按 `Ctrl + C` 即可停止服务。

## 配置选项

可以通过环境变量自定义配置：

| 环境变量 | 说明 | 默认值 |
|---------|------|-------|
| `HOST` | 监听地址 | `0.0.0.0` |
| `PORT` | 监听端口 | `3000` |
| `ORIGIN` | 公开访问地址 | - |

示例：

```bash
HOST=127.0.0.1 PORT=8080 node build
```

## 常用命令总结

| 命令 | 说明 |
|-----|------|
| `npm run dev` | 开发模式，支持热更新 |
| `npm run build` | 构建生产版本 |
| `node build` | 运行生产服务器 |
| `npm run preview` | 预览构建结果（开发用） |

## 注意事项

1. `build` 目录是构建产物，不应提交到 git
2. 生产环境建议使用 `node build` 而非 `npm run preview`
3. 如需部署到其他平台（Vercel、Netlify 等），需要更换对应的 adapter
