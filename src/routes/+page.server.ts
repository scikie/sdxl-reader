/**
 * ============================================================
 * 首页服务端数据加载
 * ============================================================
 * 
 * 【知识点】SvelteKit 页面服务端加载
 * - +page.server.ts 在服务端运行
 * - load 函数在渲染页面之前执行
 * - 返回的数据会传递给页面组件
 * 
 * 【知识点】服务端渲染 (SSR)
 * - 数据在服务端获取并渲染
 * - 用户看到的是完整的 HTML（对 SEO 友好）
 * - 然后客户端接管进行交互（hydration）
 */

import { getChapters } from '$lib/novel';
import type { PageServerLoad } from './$types';

/**
 * 页面加载函数
 * 
 * 【知识点】PageServerLoad 类型
 * - 定义服务端加载函数的类型
 * - 返回值类型会自动推断并传递给页面组件
 * 
 * 【知识点】async 函数
 * - load 函数可以是异步的
 * - SvelteKit 会等待 Promise 完成
 * 
 * @returns 页面数据对象，包含章节列表
 */
export const load: PageServerLoad = async () => {
	// 获取所有章节
	const chapters = await getChapters();
	
	// 【知识点】返回数据
	// 返回的对象会被传递给 +page.svelte
	// 在页面中通过 `data` prop 访问
	return { chapters };
};