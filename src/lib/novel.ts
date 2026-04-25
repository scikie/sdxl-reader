/**
 * ============================================================
 * 小说解析模块 - 服务端数据处理
 * ============================================================
 * 
 * 这个文件运行在服务端（Node.js 环境），负责读取和处理小说文件。
 * 
 * 【知识点】TypeScript 模块
 * - 使用 `export` 导出函数和类型，使其可以在其他文件中导入使用
 * - TypeScript 的类型注解帮助我们在编码时发现错误
 * 
 * 【知识点】Node.js 文件系统 API
 * - `node:fs/promises` 提供 Promise 风格的文件操作 API
 * - `node:path` 提供跨平台的路径处理工具
 * 
 * 【知识点】SvelteKit 服务端代码
 * - 这段代码只在服务端运行，不会被打包到客户端
 * - 可以安全地使用 Node.js API，如文件系统操作
 */

// ============================================================
// 导入 Node.js 内置模块
// ============================================================

/**
 * 【知识点】ES Module 导入语法
 * - `import { xxx } from 'module'` 是 ES6 的模块导入语法
 * - `node:fs/promises` 是 Node.js 的内置模块，使用 `node:` 前缀明确表示
 * - 使用 Promise 版本可以配合 async/await 进行异步操作
 */
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

// ============================================================
// 配置常量
// ============================================================

/**
 * 【知识点】process.cwd()
 * - 返回当前 Node.js 进程的工作目录
 * - 在 SvelteKit 项目中，通常是项目根目录
 * 
 * 【知识点】join() 路径拼接
 * - 跨平台地拼接路径（Windows 用 \，Unix 用 /）
 * - 比直接字符串拼接更安全可靠
 */
const NOVEL_DIR = join(process.cwd(), '神雕侠侣');

// ============================================================
// TypeScript 类型定义
// ============================================================

/**
 * 【知识点】TypeScript interface（接口）
 * - 定义对象的结构和类型
 * - 提供类型检查和代码提示
 * - 这里的 Chapter 类型描述了一个章节数据的结构
 */
export interface Chapter {
	id: number;      // 章节编号，如 1, 2, 3...
	title: string;   // 章节标题，如 "风月无情"
	files: string[]; // 该章节对应的所有文件名（一个章节可能分成多个文件）
}

// ============================================================
// 辅助函数：中文数字转换
// ============================================================

/**
 * 从文件名中解析章节编号
 * 
 * 【知识点】正则表达式
 * - `/第([零一二三四五六七八九十百]+)回/` 匹配中文数字章节
 * - `()` 捕获组，提取匹配的部分
 * - `[零一二三四五六七八九十百]+` 匹配一个或多个中文字符
 * 
 * @param filename 文件名，如 "第一回 风月无情_金庸・神雕侠侣.txt"
 * @returns 章节编号，解析失败返回 0
 */
function parseChapterNumber(filename: string): number {
	// 【知识点】String.match() 和正则表达式
	// match() 返回匹配结果数组，如果没有匹配则返回 null
	const match = filename.match(/第([零一二三四五六七八九十百]+)回/);
	if (!match) return 0; // 没有匹配到，返回 0
	
	// match[0] 是整个匹配的字符串，如 "第一回"
	// match[1] 是第一个捕获组，如 "一"
	const chineseNum = match[1];
	
	// 【知识点】对象字面量作为映射表
	// 使用对象来存储键值对映射，比 if-else 更清晰
	const numMap: Record<string, number> = {
		'零': 0, '一': 1, '二': 2, '三': 3, '四': 4,
		'五': 5, '六': 6, '七': 7, '八': 8, '九': 9,
		'十': 10, '二十': 20, '三十': 30
	};
	
	// 处理特殊情况：十一到十九、二十一以上等
	if (chineseNum === '十') return 10;
	if (chineseNum.startsWith('二十')) return 20 + (numMap[chineseNum[2]] || 0);
	if (chineseNum.startsWith('三十')) return 30 + (numMap[chineseNum[2]] || 0);
	
	// 简单累加（一位数）
	let result = 0;
	for (const char of chineseNum) {
		result += numMap[char] || 0;
	}
	return result;
}

/**
 * 从文件名中提取章节标题
 * 
 * 【知识点】正则表达式非贪婪匹配
 * - `[^(]+` 匹配非左括号的字符
 * - 提取 "第X回" 和 "(" 之间的内容作为标题
 * 
 * @param filename 文件名
 * @returns 章节标题
 */
function parseChapterTitle(filename: string): string {
	// 【知识点】正则表达式详解
	// /第[零一二三四五六七八九十百]+回\s+([^(]+)/
	// - 第[零一二三四五六七八九十百]+回  匹配 "第X回"
	// - \s+                              匹配一个或多个空白字符
	// - ([^(]+)                          捕获组，匹配非 '(' 的字符
	const match = filename.match(/第[零一二三四五六七八九十百]+回\s+([^(]+)/);
	return match ? match[1].trim() : ''; // trim() 去除首尾空格
}

/**
 * 从文件名中提取分页编号
 * 
 * 【知识点】可选链和默认值
 * - match 可能返回 null，使用 ?. 安全访问
 * - 如果 match 成功，返回解析的数字；否则返回默认值 1
 * 
 * @param filename 文件名，如 "第一回 风月无情(2)_金庸・神雕侠侣.txt"
 * @returns 分页编号，无分页标记时返回 1
 */
function getFilePart(filename: string): number {
	// 匹配 "(数字)" 格式的分页标记
	const match = filename.match(/\((\d+)\)_/);
	// 【知识点】三元表达式
	// condition ? valueIfTrue : valueIfFalse
	return match ? parseInt(match[1]) : 1;
}

/**
 * 将阿拉伯数字转换为中文数字
 * 
 * 【知识点】纯函数
 * - 输入相同，输出永远相同
 * - 不依赖外部状态，不修改外部状态
 * - 易于测试和理解
 * 
 * @param num 阿拉伯数字（1-39）
 * @returns 中文数字字符串
 */
function numberToChinese(num: number): string {
	const chineseNums = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
	if (num <= 10) return chineseNums[num];
	if (num < 20) return '十' + chineseNums[num - 10];      // 11-19: 十一、十二...
	if (num % 10 === 0) return chineseNums[Math.floor(num / 10)] + '十'; // 20, 30: 二十、三十
	return chineseNums[Math.floor(num / 10)] + '十' + chineseNums[num % 10]; // 21-29, 31-39
}

// ============================================================
// 主要导出函数
// ============================================================

/**
 * 获取所有章节列表
 * 
 * 【知识点】async/await 异步编程
 * - async 函数返回 Promise
 * - await 等待 Promise 完成
 * - 比传统的 .then() 链式调用更易读
 * 
 * 【知识点】Map 数据结构
 * - Map 比 Object 更适合存储键值对集合
 * - 键可以是任意类型
 * - 提供有用的方法如 has(), get(), set(), values()
 * 
 * @returns 章节数组，按章节编号排序
 */
export async function getChapters(): Promise<Chapter[]> {
	try {
		// 【知识点】异步文件操作
		// readdir 读取目录内容，返回文件名数组
		const files = await readdir(NOVEL_DIR);
		
		// 【知识点】数组方法 filter()
		// 创建新数组，只包含满足条件的元素
		// 原数组不变（纯函数特性）
		const txtFiles = files.filter(f => f.endsWith('.txt'));
		
		// 【知识点】Map 数据结构
		// 用于按章节编号分组存储章节数据
		const chapterMap = new Map<number, Chapter>();
		
		// 【知识点】for...of 循环
		// 遍历可迭代对象（数组、字符串、Map 等）
		for (const file of txtFiles) {
			const num = parseChapterNumber(file);
			if (num === 0) continue; // 跳过解析失败的文件
			
			// 如果章节还不存在于 Map 中，创建新条目
			if (!chapterMap.has(num)) {
				chapterMap.set(num, {
					id: num,
					title: parseChapterTitle(file),
					files: [] // 初始化空数组
				});
			}
			
			// 获取章节对象并添加文件
			// 【知识点】非空断言操作符 !
			// 告诉 TypeScript 我们确定这个值不是 null/undefined
			const chapter = chapterMap.get(num)!;
			chapter.files.push(file);
		}
		
		// 对每个章节的文件按分页编号排序
		// 【知识点】数组解构赋值
		// for...of 配合 .values() 遍历 Map 的所有值
		for (const chapter of chapterMap.values()) {
			// 【知识点】数组方法 sort()
			// 就地排序（会修改原数组）
			// 比较函数返回负数/零/正数决定排序顺序
			chapter.files.sort((a, b) => {
				const partA = getFilePart(a);
				const partB = getFilePart(b);
				return partA - partB; // 升序排序
			});
		}
		
		// 【知识点】数组方法组合
		// Array.from() 将可迭代对象转为数组
		// .sort() 对数组排序
		// 返回排序后的章节列表
		return Array.from(chapterMap.values()).sort((a, b) => a.id - b.id);
		
	} catch (e) {
		// 【知识点】错误处理
		// 如果目录不存在或读取失败，返回空数组
		// 保证程序不会崩溃
		console.error('Failed to read chapters:', e);
		return [];
	}
}

/**
 * 获取单个章节的完整内容
 * 
 * 【知识点】Promise.all() 并行异步操作
 * - 同时执行多个 Promise
 * - 等待所有 Promise 完成
 * - 比顺序执行更快
 * 
 * @param chapterId 章节编号
 * @returns 章节标题和内容，章节不存在返回 null
 */
export async function getChapterContent(chapterId: number): Promise<{ title: string; content: string } | null> {
	// 获取章节列表
	const chapters = await getChapters();
	
	// 【知识点】数组方法 find()
	// 返回第一个满足条件的元素，未找到返回 undefined
	const chapter = chapters.find(c => c.id === chapterId);
	
	if (!chapter) return null; // 章节不存在
	
	// 用于存储每个文件的内容
	const contents: string[] = [];
	
	// 按顺序读取所有分页文件
	// 【知识点】顺序异步操作
	// 这里需要按顺序读取，所以使用 for...of 循环
	for (const file of chapter.files) {
		const filePath = join(NOVEL_DIR, file);
		try {
			// 【知识点】文件读取
			// readFile 读取文件内容，'utf-8' 指定编码
			const content = await readFile(filePath, 'utf-8');
			contents.push(content.trim()); // trim() 去除首尾空白
		} catch (e) {
			// 单个文件读取失败，记录错误但继续处理
			console.error(`Failed to read file: ${file}`);
		}
	}
	
	// 【知识点】模板字符串和字符串方法
	// 模板字符串 `...` 支持多行和插值
	// ${} 插值语法嵌入表达式
	return {
		title: `第${numberToChinese(chapterId)}回 ${chapter.title}`,
		content: contents.join('\n\n') // 用两个换行符连接各部分
	};
}