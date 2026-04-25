/**
 * ============================================================
 * 单章节内容 API 路由
 * ============================================================
 * 
 * 【知识点】SvelteKit 动态路由
 * - [id] 是动态路由参数（命名参数）
 * - 匹配 /api/chapters/1, /api/chapters/2 等路径
 * - 参数值通过 params 对象获取
 * 
 * 【知识点】RESTful API 设计
 * - GET /api/chapters/:id 获取单个资源
 * - ID 是资源标识符
 */

import { json } from '@sveltejs/kit';
import { getChapterContent } from '$lib/novel';
import type { RequestHandler } from './$types';

/**
 * 处理 GET /api/chapters/:id 请求
 * 
 * 【知识点】解构赋值
 * - 从函数参数对象中提取特定属性
 * - { params } 等同于 event.params
 * 
 * 【知识点】SvelteKit 请求参数
 * - params 包含动态路由参数
 * - 例如 /api/chapters/123 对应 params.id = "123"
 * 
 * @param params 路由参数对象
 * @returns JSON 响应，包含章节内容
 */
export const GET: RequestHandler = async ({ params }) => {
	// 【知识点】类型转换
	// URL 参数总是字符串，需要转换为数字
	// parseInt() 将字符串转为整数
	const id = parseInt(params.id);
	
	// 获取章节内容
	const chapter = await getChapterContent(id);
	
	// 【知识点】条件响应
	// 资源不存在时返回 404 错误
	if (!chapter) {
		// 【知识点】json() 的第二个参数
		// 可以传递 ResponseInit 对象
		// status 设置 HTTP 状态码
		return json({ error: 'Chapter not found' }, { status: 404 });
	}
	
	// 返回章节内容
	return json(chapter);
};