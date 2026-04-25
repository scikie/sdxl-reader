/*
============================================================
主题配置文件
============================================================

【知识点】TypeScript 类型定义
- TypeScript 是 JavaScript 的超集，添加了类型系统
- 类型可以在开发时发现错误，提供更好的代码提示
- 这里定义了主题相关的类型，确保代码类型安全

【知识点】导出 (export)
- export 使定义的类型和常量可以在其他文件中导入使用
- SvelteKit 项目使用 ES Module 模块系统
- 导入方式：import { themes } from '$lib/themes'
*/

/**
 * 【知识点】联合类型 (Union Type)
 * - ThemeName 只能是列出的这几个字符串值之一
 * - 类型为 'classic' | 'jade' | 'ink' | 'bamboo' | 'sunset'
 * - 尝试赋值其他字符串会报错，保证类型安全
 * 
 * 例如：
 * let theme: ThemeName = 'classic'; // 正确
 * let theme: ThemeName = 'blue';    // 错误！'blue' 不是有效的主题名
 */
export type ThemeName = 'classic' | 'jade' | 'ink' | 'bamboo' | 'sunset';

/**
 * 【知识点】接口 (Interface)
 * - 定义对象的结构类型
 * - 描述一个主题对象应该有哪些属性
 * - 使用接口可以让代码更清晰，IDE 提供更好的提示
 * 
 * 【知识点】嵌套类型
 * - colors 属性又是一个对象，有特定的结构
 * - 这种嵌套定义让类型更加精确
 */
export interface Theme {
	name: ThemeName;      // 主题的内部标识符
	label: string;        // 主题的显示名称（中文）
	colors: {             // 主题的颜色配置
		primary: string;       // 主色调（用于链接、按钮等）
		primaryHover: string;  // 主色调悬停状态
		text: string;          // 主要文字颜色
		textSecondary: string; // 次要文字颜色
		background: string;    // 背景颜色
		backgroundHover: string; // 背景悬停颜色
		border: string;        // 边框颜色
	};
}

/**
 * 【知识点】Record 类型
 * - Record<KeyType, ValueType> 是 TypeScript 内置工具类型
 * - 创建一个对象类型，键是 KeyType，值是 ValueType
 * - Record<ThemeName, Theme> 表示：键是主题名，值是主题对象
 * 
 * 【知识点】对象字面量作为配置
 * - 把所有主题配置集中在一个对象中
 * - 便于管理和扩展新主题
 * - 可以通过 themes['ink'] 快速访问特定主题
 */
export const themes: Record<ThemeName, Theme> = {
	/*
	【知识点】古韵褐主题
	- 经典的褐色调，适合日常阅读
	- #8b4513 是 saddlebrown（鞍褐色）
	- 颜色命名可参考：https://www.color-hex.com
	*/
	classic: {
		name: 'classic',
		label: '古韵褐',
		colors: {
			primary: '#8b4513',        // 鞍褐色
			primaryHover: '#a0522d',   // 悬停时稍亮的褐色
			text: '#333333',           // 深灰文字，比纯黑柔和
			textSecondary: '#666666',  // 次要文字用更浅的灰色
			background: '#ffffff',     // 纯白背景
			backgroundHover: '#f5f5f5', // 浅灰悬停背景
			border: '#dddddd'          // 浅灰边框
		}
	},

	/*
	【知识点】碧玉青主题
	- 清新的绿色调，护眼舒适
	- #2e8b57 是 seagreen（海绿色）
	- 背景使用 #f0fff0（蜜瓜绿），与主题色呼应
	*/
	jade: {
		name: 'jade',
		label: '碧玉青',
		colors: {
			primary: '#2e8b57',
			primaryHover: '#3cb371',
			text: '#1a1a1a',
			textSecondary: '#555555',
			background: '#f0fff0',      // 带绿色的浅背景
			backgroundHover: '#e0f0e0',
			border: '#a8d8a8'           // 边框也带绿色调
		}
	},

	/*
	【知识点】水墨黑主题（深色模式）
	- 深色背景，浅色文字
	- 适合夜间阅读，减少眼睛疲劳
	- 注意深色模式下的颜色对比度
	*/
	ink: {
		name: 'ink',
		label: '水墨黑',
		colors: {
			primary: '#a0a0a0',         // 浅灰作为主色
			primaryHover: '#b8b8b8',
			text: '#e0e0e0',            // 浅色文字
			textSecondary: '#a0a0a0',   // 次要文字稍暗
			background: '#1a1a1a',      // 深黑背景
			backgroundHover: '#2a2a2a', // 悬停时稍亮
			border: '#3a3a3a'           // 深灰边框
		}
	},

	/*
	【知识点】竹简黄主题
	- 模仿古代竹简的色调
	- 使用暖黄色调，营造古典氛围
	- 文字颜色偏棕色，与背景协调
	*/
	bamboo: {
		name: 'bamboo',
		label: '竹简黄',
		colors: {
			primary: '#b8860b',         // 暗金色
			primaryHover: '#d4a017',
			text: '#3d2914',            // 棕色文字
			textSecondary: '#5d4930',
			background: '#fdf5e6',      // 旧蕾丝色，类似竹简
			backgroundHover: '#f5ead0',
			border: '#d4b896'           // 棕灰边框
		}
	},

	/*
	【知识点】残阳红主题
	- 温暖的红橙色调
	- 背景使用 oldlace（旧蕾丝色）
	- 适合营造温馨的阅读氛围
	*/
	sunset: {
		name: 'sunset',
		label: '残阳红',
		colors: {
			primary: '#cd5c5c',         // 印度红
			primaryHover: '#dc6b6b',
			text: '#2d2d2d',
			textSecondary: '#5a5a5a',
			background: '#fffaf0',      // 花白色，温暖的白
			backgroundHover: '#fff0e0',
			border: '#e8d0c0'           // 带红调的灰边框
		}
	}
};

/**
 * 【知识点】默认主题
 * - 当用户首次访问时使用的主题
 * - 类型为 ThemeName，只能赋值为有效主题名
 */
export const defaultTheme: ThemeName = 'classic';
