/**
 * ============================================================
 * 章节列表 API 路由
 * ============================================================
 * 
 * 【知识点】SvelteKit 服务端路由
 * - 文件路径决定 API 路径
 * - src/routes/api/chapters/+server.ts 对应 /api/chapters 路由
 * - 导出的函数名对应 HTTP 方法（GET, POST, PUT, DELETE 等）
 * 
 * 【知识点】SvelteKit 请求处理
 * - 每个请求都会调用对应的处理函数
 * - 函数接收 RequestEvent 参数，包含请求信息
 * - 返回 Response 对象
 */

// ============================================================
// 导入依赖
// ============================================================

/**
 * 【知识点】SvelteKit 模块导入
 * - @sveltejs/kit 是 SvelteKit 的核心包
 * - json() 是一个辅助函数，将数据转换为 JSON Response
 * - 不需要手动设置 Content-Type 等响应头
 */
import { json } from '@sveltejs/kit';

/**
 * 【知识点】模块导入
 * - $lib 是 SvelteKit 的路径别名
 * - 指向 src/lib 目录
 * - 方便在不同深度的文件中导入 lib 中的模块
 */
import { getChapters } from '$lib/novel';

/**
 * 【知识点】TypeScript 类型导入
 * - 从生成的类型文件中导入类型
 * - ./\$types 由 SvelteKit 自动生成
 * - 提供类型检查和代码提示
 */
import type { RequestHandler } from './$types';

// ============================================================
// GET 请求处理函数
// ============================================================

/**
 * 处理 GET /api/chapters 请求
 * 
 * 【知识点】RESTful API 设计
 * - GET 请求用于获取资源
 * - 无副作用，多次请求结果相同
 * - 返回章节列表的 JSON 数据
 * 
 * 【知识点】SvelteKit RequestHandler 类型
 * - 定义请求处理函数的类型
 * - 确保返回正确的 Response 类型
 * 
 * @returns JSON 响应，包含章节列表
 */
export const GET: RequestHandler = async () => {
	// 调用服务端函数获取章节数据
	// 【知识点】async/await
	// 等待异步操作完成
	const chapters = await getChapters();
	
	// 【知识点】返回 JSON 响应
	// json() 函数自动：
	// 1. 将数据序列化为 JSON
	// 2. 设置 Content-Type: application/json
	// 3. 创建 Response 对象
	return json(chapters);
};