<!--
============================================================
全局布局组件
============================================================

【知识点】SvelteKit 布局系统
- +layout.svelte 是 SvelteKit 的特殊文件
- 定义所有页面共享的布局结构
- 所有页面都会被渲染到 {@render children()} 处

【知识点】布局的作用
- 设置全局样式（如 CSS 变量）
- 引入全局资源（如 favicon）
- 提供页面公共部分（如导航栏、页脚）
-->

<script lang="ts">
	/*
	【知识点】onMount 生命周期
	- Svelte 的组件挂载生命周期函数
	- 组件被插入 DOM 后执行
	- 类似于 React 的 useEffect(() => {}, [])
	
	【知识点】为什么用 onMount？
	- localStorage 和 DOM 操作只能在浏览器执行
	- onMount 只在浏览器端执行，SSR 时不执行
	- 这是 SvelteKit 开发的重要模式
	*/
	import { onMount } from 'svelte';
	import { themeStore } from '$lib/themeStore';
	import favicon from '$lib/assets/favicon.svg';

	/*
	【知识点】$props() 接收子内容
	- Svelte 5 的 props 接收方式
	- children 是特殊 prop，包含子页面内容
	- 用于 {@render children()} 渲染子页面
	*/
	let { children } = $props();

	/*
	【知识点】组件挂载时初始化主题
	- onMount 确保代码在浏览器执行
	- 读取用户保存的主题偏好
	- 应用主题到页面
	*/
	onMount(() => {
		themeStore.init();
	});
</script>

<!--
【知识点】<svelte:head> 特殊元素
- 在 HTML <head> 中插入内容
- 用于设置页面标题、meta 标签、favicon 等
- SSR 时会在服务端渲染，SEO 友好

【知识点】favicon 设置
- link rel="icon" 设置网站图标
- 显示在浏览器标签页上
-->
<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<!--
【知识点】{@render children()} 插槽渲染
- 渲染子页面的内容
- 类似于 React 的 {children}
- 每个页面的内容会被插入到这里

【知识点】渲染标签语法
- {@render ...} 是 Svelte 5 的新语法
- 用于渲染 Snippet（代码片段）
- children 本质上是一个 Snippet
-->
{@render children()}

<style>
	/*
	============================================================
	全局 CSS 变量定义
	============================================================
	
	【知识点】:global() 修饰符
	- Svelte 默认样式作用域隔离
	- :global() 让样式作用于全局
	- :global(:root) 选择 HTML 根元素 (<html>)
	
	【知识点】CSS 变量 (Custom Properties)
	- --var-name: value 定义变量
	- var(--var-name) 使用变量
	- 可以在 JavaScript 中动态修改
	- 实现主题切换的核心技术
	
	【知识点】变量命名约定
	- 使用 --color- 前缀表示颜色
	- 语义化命名：primary（主色）、text（文字）、bg（背景）
	- 避免使用具体颜色值作为名称（如 --blue）
	*/
	:global(:root) {
		/*
		【知识点】默认主题变量
		- 这些是默认值，会被 JavaScript 覆盖
		- 初始加载时避免闪烁
		- 用户选择的主题会更新这些变量
		*/
		--color-primary: #8b4513;           /* 主色调 */
		--color-primary-hover: #a0522d;     /* 主色调悬停 */
		--color-text: #333333;              /* 主要文字 */
		--color-text-secondary: #666666;    /* 次要文字 */
		--color-bg: #ffffff;                /* 背景色 */
		--color-bg-hover: #f5f5f5;          /* 背景悬停 */
		--color-border: #dddddd;            /* 边框色 */
	}

	/*
	【知识点】全局 body 样式
	- 设置全局字体、背景、文字颜色
	- 使用 CSS 变量，主题切换时自动更新
	*/
	:global(body) {
		margin: 0;  /* 移除默认边距 */
		
		/*
		【知识点】使用 CSS 变量
		- background-color: var(--color-bg)
		- 自动获取 --color-bg 的当前值
		- 主题切换时，背景色自动变化
		*/
		background-color: var(--color-bg);
		color: var(--color-text);
		
		/*
		【知识点】CSS 过渡动画
		- 主题切换时平滑过渡
		- 避免突兀的颜色变化
		- 0.3s 过渡时间，ease 缓动函数
		*/
		transition: background-color 0.3s ease, color 0.3s ease;
	}
</style>