<!-- 
============================================================
章节目录首页组件
============================================================

【知识点】Svelte 组件结构
- 每个 .svelte 文件是一个组件
- 由三部分组成：<script>、模板、<style>
- <script> 包含组件逻辑和状态
- 模板定义 HTML 结构和渲染
- <style> 定义组件样式（自动作用域隔离）

【知识点】Svelte 5 新特性
- 使用 $state() 创建响应式状态
- 使用 $props() 接收父组件传递的数据
- 使用 $derived() 创建派生状态
- 更简洁的语法，更强大的响应式系统
-->

<script lang="ts">
	/**
	 * ============================================================
	 * 组件脚本部分
	 * ============================================================
	 * 
	 * 【知识点】组件导入
	 * - 使用 import 导入其他组件
	 * - ThemeSwitcher 是主题切换器组件
	 * - 组件可以在其他组件中嵌套使用
	 */
	import ThemeSwitcher from '$lib/components/ThemeSwitcher.svelte';
	import { readingProgressStore } from '$lib/readingProgressStore';
	
	/**
	 * 【知识点】Svelte 5 Props 接收
	 * - $props() 是 Svelte 5 新的 props 接收方式
	 * - 替代了旧的 export let xxx 语法
	 * - 更明确地表示这是从父组件接收的数据
	 * 
	 * 【知识点】Props vs State
	 * - Props: 从父组件传入，组件内部只读
	 * - State: 组件内部定义和管理的响应式数据
	 */
	
	/**
	 * 接收从服务端 load 函数返回的数据
	 * 
	 * 【知识点】SvelteKit 数据流
	 * - +page.server.ts 的 load 函数返回数据
	 * - 数据自动传递给页面组件
	 * - 通过 $props() 的 data 属性访问
	 * 
	 * 【知识点】$props() 返回对象
	 * - 包含所有传入的 props
	 * - 这里我们使用解构提取 data
	 */
	let { data } = $props();
	
	let progress = $state<{ chapterId: number; chapterTitle: string } | null>(null);
	let unsubscribe: (() => void) | null = null;
	
	$effect(() => {
		unsubscribe = readingProgressStore.subscribe((value) => {
			progress = value;
		});
		return () => {
			if (unsubscribe) unsubscribe();
		};
	});
	
	/**
	 * 【知识点】响应式状态 $state()
	 * - 创建一个响应式变量
	 * - 当值改变时，视图自动更新
	 * - 这是 Svelte 5 的核心响应式机制
	 * 
	 * 【知识点】何时使用 $state()
	 * - 当变量需要在组件内部修改时
	 * - 当变量改变需要触发视图更新时
	 * - 本例中 data 是 props，不需要 $state()
	 */
	
	// 如果我们需要一个可修改的状态，可以这样：
	// let searchQuery = $state('');
	// 这样 searchQuery 改变时，视图会自动更新
</script>

<!-- 
============================================================
Svelte 特殊元素：svelte:head
============================================================

【知识点】<svelte:head>
- 在 HTML <head> 中插入内容
- 用于设置页面标题、meta 标签等
- 内容会被合并到最终的 HTML 文档中
- SSR 时会在服务端渲染，SEO 句子

【知识点】页面标题管理
- 每个页面可以有独立的标题
- 切换页面时标题自动更新
- 对用户体验和 SEO 都很重要
-->
<svelte:head>
	<title>神雕侠侣 - 金庸</title>
</svelte:head>

<!-- 
============================================================
HTML 模板部分
============================================================

【知识点】Svelte 模板语法
- 看起来像普通 HTML
- 可以插入 JavaScript 表达式
- 使用 {} 包裹表达式
- 支持 {#if}, {#each}, {#await} 等块
-->

<!-- 容器元素 -->
<div class="container">
	
	<!-- 
	【知识点】页面头部
	- 使用语义化 HTML 元素
	- <header> 表示页面或区域的头部
	-->
	<header>
		<!--
		【知识点】Flexbox 布局实践
		- header-top 用于放置主题切换器
		- display: flex 创建弹性容器
		- justify-content: space-between 两端对齐
		- 左边空元素占位，右边放切换器
		- 两端对齐的技巧：用一个空 div 占位
		
		【知识点】组件嵌套
		- ThemeSwitcher 是独立组件
		- 可以在任何地方使用
		- 显示在页面右上角
		-->
		<div class="header-top">
			<div></div>
			<ThemeSwitcher />
		</div>
		<h1>神雕侠侣</h1>
		<p class="author">金庸 著</p>
		
		{#if progress}
			<a href="/chapter/{progress.chapterId}" class="continue-reading">
				<span class="continue-label">继续阅读</span>
				<span class="continue-chapter">{progress.chapterTitle}</span>
			</a>
		{/if}
	</header>
	
	<!-- 章节列表容器 -->
	<div class="chapters">
		
		<!--
		============================================================
		Svelte 循环：{#each}
		============================================================
		
		【知识点】{#each} 块语法
		- {#each array as item} 循环渲染数组元素
		- 每个元素生成对应的 DOM 元素
		- 比 JavaScript map() 更高效（更新时智能复用 DOM）
		
		【知识点】{#each} 带索引
		- {#each array as item, index}
		- 索引从 0 开始
		
		【知识点】{#each} 带 key（推荐）
		- {#each array as item (item.id)}
		- key 帮助 Svelte 识别元素，优化更新
		- 当数据变化时，能正确匹配新旧元素
		- 避免不必要的 DOM 操作
		
		【知识点】表达式插值
		- {data.chapters} 插入数组
		- {chapter.id} 插入章节编号
		- {chapter.title} 插入章节标题
		- 任何 JavaScript 表达式都可以
		-->
		{#each data.chapters as chapter (chapter.id)}
			<!-- 
			【知识点】动态属性
			- href="/chapter/{chapter.id}" 动态设置链接
			- {} 中可以是任何表达式
			- 编译后是普通的 href 属性
			
			【知识点】class 动态绑定
			- class="chapter-link" 静态类名
			- class:selected={isSelected} 条件类名
			- 类名会根据条件动态添加/移除
			-->
			<a href="/chapter/{chapter.id}" class="chapter-link">
				<span class="chapter-num">第{chapter.id}回</span>
				<span class="chapter-title">{chapter.title}</span>
			</a>
		{/each}
	</div>
</div>

<!--
============================================================
组件样式部分
============================================================

【知识点】Svelte 样式作用域
- <style> 中的样式自动限制在当前组件
- 类名会被自动添加唯一标识符
- 不会影响其他组件，也不会被其他组件影响
- 例如 class="container" 可能编译为 class="container svelte-xxx"

【知识点】CSS 属性说明
- 以下注释解释关键 CSS 属性的作用

【知识点】CSS 变量在样式中的使用
- 使用 var(--color-primary) 引用全局变量
- 主题切换时，这些值会自动更新
- 实现动态主题效果
-->

<style>
	/*
	============================================================
	布局容器
	============================================================
	
	【知识点】max-width + margin auto 居中
	- max-width: 限制最大宽度，防止在大屏幕上太宽
	- margin: 0 auto; 左右外边距自动分配，实现水平居中
	- 这是经典的居中布局方案
	*/
	.container {
		max-width: 560px;
		margin: 0 auto;
		padding: 2rem; /* 内边距，留出内容与边框的间距 */
	}
	
	/*
	============================================================
	头部布局（新增主题切换器）
	============================================================
	
	【知识点】Flexbox 两端对齐技巧
	- display: flex 创建弹性容器
	- justify-content: space-between 两端对齐
	- 第一个子元素在左，最后一个在右
	- 使用空 div 占位，让切换器靠右显示
	
	【知识点】组件布局实践
	- header-top 专门用于放置切换器
	- 与下方标题保持适当间距
	- margin-bottom: 1rem 留出空间
	*/
	.header-top {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1rem;
	}

	/*
	【知识点】text-align 文本对齐
	- center: 文字居中
	- left/right: 左/右对齐
	*/
	header {
		text-align: center;
		margin-bottom: 3rem; /* 底部外边距，与下方内容的间距 */
		padding-bottom: 2rem;
		
		/*
		【知识点】CSS 变量使用
		- border-color 使用 var(--color-border)
		- 主题切换时边框颜色自动变化
		*/
		border-bottom: 1px solid var(--color-border);
	}
	
	/*
	【知识点】字体大小单位
	- rem: 相对于根元素字体大小（html）
	- 响应式友好，用户调整浏览器字体时会自动适应
	- px: 固定像素值，不响应用户设置
	*/
	h1 {
		font-size: 2.5rem;
		
		/*
		【知识点】CSS 变量应用
		- color: var(--color-text)
		- 主题切换时文字颜色自动变化
		- 水墨黑主题：深色背景 + 浅色文字
		*/
		color: var(--color-text);
		margin-bottom: 0.5rem;
	}
	
	/*
	【知识点】class 选择器
	- .author 匹配 class="author" 的元素
	- 比标签选择器更精确
	*/
	.author {
		color: var(--color-text-secondary); /* 使用变量，次要文字色 */
		font-size: 1.1rem;
	}
	
	/*
	============================================================
	章节列表布局
	============================================================
	
	【知识点】Grid 布局
	- display: grid; 创建网格布局容器
	- gap: 子元素之间的间距
	- 比使用 margin 更简洁
	*/
	.chapters {
		display: grid;
		gap: 0.5rem;
	}
	
	/*
	============================================================
	章节链接样式（使用 CSS 变量）
	============================================================
	
	【知识点】Flexbox 布局
	- display: flex; 子元素水平排列（默认）
	- align-items: center; 子元素垂直居中
	- 用于行内布局
	
	【知识点】去除链接默认样式
	- text-decoration: none; 去除下划线
	- 自定义链接外观更灵活
	
	【知识点】主题适配
	- 所有颜色使用 CSS 变量
	- 主题切换时自动更新
	*/
	.chapter-link {
		display: flex;
		align-items: center;
		padding: 1rem;
		
		/*
		【知识点】背景色变量
		- var(--color-bg) 默认背景色
		- 水墨黑主题时变为深黑色
		*/
		background: var(--color-bg);
		border-radius: 8px; /* 圆角，现代的外观 */
		text-decoration: none;
		color: var(--color-text);
		
		/*
		【知识点】边框使用变量
		- border: 1px solid var(--color-border)
		- 主题切换时边框颜色变化
		- 深色主题边框更深，浅色主题边框更浅
		*/
		border: 1px solid var(--color-border);
		
		/*
		【知识点】CSS 过渡动画
		- transition: 属性名 持续时间;
		- 当属性值变化时，平滑过渡
		- all 表示监听所有属性
		- 0.2s 过渡持续时间
		- 创建流畅的视觉体验
		*/
		transition: all 0.2s;
	}
	
	/*
	【知识点】CSS 伪类 :hover
	- 鼠标悬停时的样式
	- 与 transition 配合实现平滑效果
	- 不需要 JavaScript，纯 CSS 实现
	*/
	.chapter-link:hover {
		background: var(--color-bg-hover); /* 悬停背景使用变量 */
		transform: translateX(5px); /* 向右移动 */
		border-color: var(--color-primary); /* 边框变为主色 */
	}
	
	/*
	【知识点】min-width 最小宽度
	- 确保元素至少有指定宽度
	- 配合 flexbox 使用，固定部分元素宽度
	*/
	.chapter-num {
		font-weight: bold;
		min-width: 80px;
		color: var(--color-primary); /* 主色，随主题变化 */
	}
	
	.chapter-title {
		margin-left: 1rem;
	}

	/*
	============================================================
	继续阅读按钮样式
	============================================================
	
	【知识点】视觉突出
	- 使用主色调作为背景
	- 吸引用户注意，方便快速继续阅读
	*/
	.continue-reading {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 1rem;
		margin: 1.5rem 0;
		background: var(--color-primary);
		color: white;
		border-radius: 8px;
		text-decoration: none;
		transition: all 0.2s;
	}

	.continue-reading:hover {
		background: var(--color-primary-hover);
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
	}

	.continue-label {
		font-size: 0.85rem;
		opacity: 0.9;
		margin-bottom: 0.25rem;
	}

	.continue-chapter {
		font-weight: bold;
		font-size: 1rem;
	}
</style>