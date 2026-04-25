/*
============================================================
主题状态管理 Store
============================================================

【知识点】什么是 Store？
- Store 是 Svelte 的响应式状态管理机制
- 当 Store 的值变化时，所有订阅该 Store 的组件都会自动更新
- 类似于 React 的 Context + useState，但更简洁

【知识点】为什么需要 Store？
- 多个组件需要共享同一状态（当前主题）
- 需要在组件间同步状态
- 避免 prop drilling（层层传递 props）

【知识点】$app/environment 模块
- SvelteKit 提供的环境变量模块
- browser 变量判断代码是否在浏览器环境运行
- SSR（服务端渲染）时代码会在服务器运行，此时 browser 为 false
*/

import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import { themes, defaultTheme, type ThemeName, type Theme } from './themes';

/**
 * 【知识点】创建自定义 Store
 * - writable() 创建一个可写的 Store
 * - 我们封装了额外的逻辑，形成自定义 Store
 * - 返回的对象包含 subscribe 方法和自定义方法
 * 
 * 【知识点】闭包 (Closure)
 * - getInitialTheme 和 applyTheme 函数在 createThemeStore 内部定义
 * - 它们可以访问外部作用域的 subscribe, set, update 等变量
 * - 这是 JavaScript 闭包特性的应用
 */
function createThemeStore() {
	/**
	 * 【知识点】获取初始主题
	 * - 首先检查浏览器 localStorage 是否保存了用户偏好
	 * - 如果没有或无效，使用默认主题
	 * 
	 * 【知识点】localStorage
	 * - 浏览器提供的本地存储 API
	 * - 数据持久化保存在用户浏览器中
	 * - 只能存储字符串，对象需要用 JSON.stringify 转换
	 * 
	 * 【知识点】类型断言 as ThemeName
	 * - localStorage.getItem 返回 string | null
	 * - as ThemeName 告诉 TypeScript 我们确定它是 ThemeName 类型
	 * - 后续的 themes[stored] 检查确保类型安全
	 * 
	 * @returns 返回初始主题名称
	 */
	const getInitialTheme = (): ThemeName => {
		/*
		【知识点】browser 检查
		- SSR 时 browser 为 false，localStorage 不存在
		- 必须检查，否则服务端渲染会报错
		- 这是 SvelteKit 开发中的重要模式
		*/
		if (browser) {
			// 从 localStorage 读取保存的主题
			const stored = localStorage.getItem('theme') as ThemeName;
			
			// 【知识点】类型守卫
			// 检查存储的主题是否有效（存在于 themes 对象中）
			if (stored && themes[stored]) {
				return stored;
			}
		}
		// 默认返回经典主题
		return defaultTheme;
	};

	/*
	【知识点】writable Store
	- writable(initialValue) 创建可写 Store
	- 返回对象包含 { subscribe, set, update }
	- subscribe: 订阅值变化
	- set: 直接设置新值
	- update: 基于旧值计算新值
	*/
	const { subscribe, set, update } = writable<ThemeName>(getInitialTheme());

	/**
	 * 【知识点】应用主题到 DOM
	 * - 通过 CSS 变量动态修改页面样式
	 * - 同时保存到 localStorage 实现持久化
	 * 
	 * 【知识点】CSS 变量 (Custom Properties)
	 * - --variable-name 是 CSS 变量语法
	 * - 在 :root 或元素上设置后，可在 CSS 中使用 var(--variable-name)
	 * - JavaScript 可以动态修改，实现主题切换
	 * 
	 * 【知识点】document.documentElement
	 * - 返回文档的根元素 (<html>)
	 * - 通常在这里设置全局 CSS 变量
	 * - 所有子元素都可以继承这些变量
	 * 
	 * @param themeName - 要应用的主题名称
	 */
	const applyTheme = (themeName: ThemeName) => {
		const theme = themes[themeName];
		
		// 【知识点】早期返回模式
		// 如果主题不存在或不在浏览器环境，直接返回
		// 避免后续代码执行，提高代码可读性
		if (!theme || !browser) return;

		// 获取根元素
		const root = document.documentElement;
		
		/*
		【知识点】设置 CSS 变量
		- style.setProperty('--var-name', 'value')
		- 这会修改 CSS 变量的值
		- 页面所有使用该变量的地方都会自动更新
		
		【知识点】CSS 变量命名约定
		- 使用 --color- 前缀表示颜色
		- 使用语义化命名（primary, text 等）而非具体值
		- 便于维护和理解
		*/
		root.style.setProperty('--color-primary', theme.colors.primary);
		root.style.setProperty('--color-primary-hover', theme.colors.primaryHover);
		root.style.setProperty('--color-text', theme.colors.text);
		root.style.setProperty('--color-text-secondary', theme.colors.textSecondary);
		root.style.setProperty('--color-bg', theme.colors.background);
		root.style.setProperty('--color-bg-hover', theme.colors.backgroundHover);
		root.style.setProperty('--color-border', theme.colors.border);

		/*
		【知识点】持久化用户偏好
		- 保存到 localStorage，下次访问时恢复
		- 用户体验优化，记住用户的选择
		*/
		localStorage.setItem('theme', themeName);
	};

	/*
	【知识点】返回 Store 接口
	- subscribe: 必须提供，让组件能订阅变化
	- setTheme: 自定义方法，设置新主题
	- getTheme: 根据名称获取主题对象
	- getAllThemes: 获取所有主题列表
	- init: 初始化主题（在组件挂载时调用）
	
	【知识点】对象字面量简写
	- 当属性名和变量名相同时，可以简写
	- subscribe: subscribe 可简写为 subscribe
	*/
	return {
		subscribe,
		
		/**
		 * 设置主题
		 * @param themeName - 主题名称
		 */
		setTheme: (themeName: ThemeName) => {
			set(themeName);         // 更新 Store 值
			applyTheme(themeName);  // 应用到 DOM
		},
		
		/**
		 * 根据名称获取主题对象
		 * @param name - 主题名称
		 * @returns 主题配置对象
		 */
		getTheme: (name: ThemeName): Theme => themes[name],
		
		/**
		 * 获取所有主题列表
		 * @returns 主题对象数组
		 * 
		 * 【知识点】Object.values()
		 * - 返回对象所有值组成的数组
		 * - { a: 1, b: 2 } => [1, 2]
		 * - 用于遍历对象值时很方便
		 */
		getAllThemes: () => Object.values(themes),
		
		/**
		 * 初始化主题
		 * - 在应用启动时调用
		 * - 读取保存的主题并应用
		 * 
		 * 【知识点】为什么需要 init？
		 * - Store 的初始值在服务端也会执行
		 * - 但 localStorage 和 DOM 操作只能在浏览器执行
		 * - 所以需要 init 方法在 onMount 中调用
		 */
		init: () => {
			const theme = getInitialTheme();
			applyTheme(theme);
		}
	};
}

/*
【知识点】导出 Store 实例
- 创建并导出单一的 Store 实例
- 这是一个单例模式 (Singleton)
- 所有导入此 Store 的组件共享同一状态

【知识点】命名约定
- Store 通常以 $ 结尾命名，或命名为 xxxStore
- 这里使用 themeStore 命名，清晰表明是 Store
*/
export const themeStore = createThemeStore();