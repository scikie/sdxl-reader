# 神雕侠侣阅读网站

基于 SvelteKit 构建的金庸小说《神雕侠侣》在线阅读网站。

## 功能特点

- 自动解析小说章节文件，按章节合并分页内容
- 章节目录页面，清晰展示所有章节列表
- 沉浸式阅读页面，简洁舒适的阅读体验
- 章节导航，支持上一章/下一章快速切换
- 响应式设计，支持不同设备阅读

## 项目结构

```
├── 神雕侠侣/                    # 小说源文件目录
│   ├── 第一回 风月无情_金庸・神雕侠侣.txt
│   ├── 第一回 风月无情(2)_金庸・神雕侠侣.txt
│   └── ...
├── src/
│   ├── lib/
│   │   └── novel.ts             # 章节解析服务
│   └── routes/
│       ├── +page.svelte         # 章节目录首页
│       ├── +page.server.ts      # 首页数据加载
│       ├── api/
│       │   └── chapters/
│       │       ├── +server.ts   # 章节列表API
│       │       └── [id]/
│       │           └── +server.ts # 单章节内容API
│       └── chapter/
│           └── [id]/
│               ├── +page.svelte   # 章节阅读页面
│               └── +page.server.ts # 章节数据加载
├── static/                      # 静态资源
├── package.json
└── README.md
```

## 使用方法

### 安装依赖

```bash
npm install
```

### 开发模式

启动开发服务器：

```bash
npm run dev
```

访问 http://localhost:5173/ 即可开始阅读。

### 构建生产版本

```bash
npm run build
```

预览生产版本：

```bash
npm run preview
```

## 章节文件命名规范

小说文件放在 `神雕侠侣/` 目录下，命名格式支持：

- `第X回 章节名_金庸・神雕侠侣.txt` - 章节首页
- `第X回 章节名(N)_金庸・神雕侠侣.txt` - 章节分页（N为页码）

系统会自动识别并合并同一章节的所有分页内容。

## 学习资源

本项目代码中包含详细的学习注释，适合 Svelte 初学者阅读学习。注释涵盖：

### Svelte/SvelteKit 核心概念

| 知识点 | 文件位置 |
|--------|----------|
| `$props()` 接收数据 | `+page.svelte` |
| `$state()` 响应式状态 | 组件注释中 |
| `{#each}` 循环渲染 | `+page.svelte` |
| `{#if}` 条件渲染 | `chapter/[id]/+page.svelte` |
| `<svelte:head>` 页面头部 | 所有页面组件 |
| `load` 函数数据加载 | `+page.server.ts` |
| 动态路由 `[id]` | `chapter/[id]/` |

### TypeScript 基础

| 知识点 | 文件位置 |
|--------|----------|
| `interface` 接口定义 | `src/lib/novel.ts` |
| 类型导入导出 | 服务端文件 |
| 泛型和 Record | `src/lib/novel.ts` |

### 前端常见模式

- **正则表达式处理字符串**：`parseChapterNumber()` 等函数
- **数组方法链式调用**：`filter()`、`map()`、`sort()` 等
- **异步编程**：`async/await`、`Promise.all()`
- **ES Module 导入导出**：模块化设计
- **CSS Flexbox/Grid 布局**：样式注释中
- **CSS 过渡动画**：`.chapter-link:hover`

### Node.js 服务端技能

- **文件系统操作**：`node:fs/promises`
- **路径处理**：`node:path`
- **错误处理**：`try/catch` 和错误响应

### 阅读建议

推荐按以下顺序阅读代码：

1. `src/lib/novel.ts` - 理解核心数据处理逻辑
2. `src/routes/+page.server.ts` - 学习服务端数据加载
3. `src/routes/+page.svelte` - 学习页面组件编写
4. `src/routes/api/chapters/+server.ts` - 学习 API 路由
5. `src/routes/chapter/[id]/+page.svelte` - 学习动态路由

## 技术栈

- [SvelteKit](https://kit.svelte.dev/) - Web 框架
- [TypeScript](https://www.typescriptlang.org/) - 类型支持
- [Vite](https://vitejs.dev/) - 构建工具
