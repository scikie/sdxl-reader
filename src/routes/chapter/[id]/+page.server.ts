/**
 * ============================================================
 * 章节阅读页面的动态路由
 * ============================================================
 * 
 * 【知识点】SvelteKit 动态路由参数
 * - [id] 文件夹名表示动态参数
 * - 匹配 /chapter/1, /chapter/2 等路径
 * - params.id 包含 URL 中的参数值
 * 
 * 【知识点】路由参数类型
 * - URL 参数总是字符串类型
 * - 需要手动转换为需要的类型
 */

import { getChapterContent, getChapters } from '$lib/novel';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

/**
 * 章节页面加载函数
 * 
 * 【知识点】并行数据加载
 * - Promise.all([...promises]) 同时执行多个异步操作
 * - 等待所有 Promise 完成
 * - 比顺序执行更快
 * - 适用于独立的异步任务
 * 
 * 【知识点】load 函数的参数
 * - { params } 路由参数对象
 * - params.id 对应 [id] 文件夹中的 id 参数
 * - 例如访问 /chapter/5 时，params.id = "5"
 * 
 * @param params 路由参数对象
 * @returns 章节内容和导航信息
 */
export const load: PageServerLoad = async ({ params }) => {
	// 将字符串参数转换为数字
	const id = parseInt(params.id);
	
	/**
	 * 【知识点】Promise.all 并行执行
	 * - 同时获取章节内容和章节列表
	 * - getChapterContent 用于当前章节内容
	 * - getChapters 用于计算上一章/下一章
	 * - 两个操作独立，可以并行执行提高效率
	 */
	const [chapter, chapters] = await Promise.all([
		getChapterContent(id),
		getChapters()
	]);
	
	/**
	 * 【知识点】SvelteKit error() 函数
	 * - 抛出 HTTP 错误响应
	 * - error(404, 'message') 返回 404 错误
	 * - SvelteKit 会渲染错误页面
	 * - 停止后续代码执行
	 */
	if (!chapter) {
		throw error(404, '章节不存在');
	}
	
	/**
	 * 【知识点】数组查找和计算
	 * - findIndex() 找到元素的索引位置
	 * - 用于计算相邻章节
	 */
	const currentIndex = chapters.findIndex(c => c.id === id);
	
	/**
	 * 【知识点】条件表达式计算相邻章节
	 * - currentIndex > 0 表示不是第一章节
	 * - currentIndex < length - 1 表示不是最后一章
	 * - 边界处理防止数组越界
	 */
	const prevChapter = currentIndex > 0 ? chapters[currentIndex - 1] : null;
	const nextChapter = currentIndex < chapters.length - 1 ? chapters[currentIndex + 1] : null;
	
	/**
	 * 【知识点】返回复杂数据结构
	 * - 包含章节内容、上一章、下一章信息
	 * - 所有数据都会传递给页面组件
	 * - 用于渲染页面内容
	 */
	return {
		chapter,    // 当前章节内容
		prevChapter, // 上一章信息（或 null）
		nextChapter  // 下一章信息（或 null）
	};
};