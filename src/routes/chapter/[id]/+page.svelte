<!--
============================================================
章节阅读页面组件
============================================================

【知识点】组件职责
- 显示章节标题和内容
- 提供上一章/下一章导航
- 返回目录的链接
- 提供主题切换功能

【知识点】数据流
- data 从 +page.server.ts 的 load 函数获取
- 包含 chapter, prevChapter, nextChapter
-->

<script>
	/**
	 * 【知识点】组件导入
	 * - ThemeSwitcher 在章节页也可用
	 * - 用户阅读时可随时切换主题
	 */
	import ThemeSwitcher from '$lib/components/ThemeSwitcher.svelte';
	import { readingProgressStore } from '$lib/readingProgressStore';
	import { onMount } from 'svelte';

	/**
	 * 【知识点】$props() 接收数据
	 * - 从服务端 load 函数返回的数据
	 * - 自动传递给页面组件
	 * - 包含章节内容和导航信息
	 */
	let { data } = $props();

	/**
	 * 【知识点】响应式状态
	 * - $state() 创建响应式变量
	 * - showBackButton 控制悬浮按钮显示
	 */
	let showBackButton = $state(false);

	/**
	 * 【知识点】滚动事件处理
	 * - onMount 中添加滚动监听
	 * - 滚动超过 300px 显示悬浮按钮
	 */
	onMount(() => {
		readingProgressStore.setProgress(data.chapter.id, data.chapter.title);
		
		const handleScroll = () => {
			showBackButton = window.scrollY > 300;
		};
		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	});
</script>

<!--
【知识点】动态页面标题
- 根据章节标题设置不同的页面标题
- {data.chapter.title} 插入章节标题
- 格式：章节标题 - 书名
-->
<svelte:head>
	<title>{data.chapter.title} - 神雕侠侣</title>
</svelte:head>

<div class="container">
	<!--
	============================================================
	页面头部
	============================================================
	
	【知识点】返回链接
	- href="/" 返回首页（章节目录）
	- 使用语义化 <header> 标签
	-->
	<header class="header">
		<!--
		【知识点】Flexbox 布局应用
		- header-row 实现返回链接和切换器两端对齐
		- 左边：返回目录链接
		- 右边：主题切换器
		- 响应式设计，在不同屏幕尺寸都能正常显示
		-->
		<div class="header-row">
			<a href="/" class="back-link">← 目录</a>
			<ThemeSwitcher />
		</div>
		<h1>{data.chapter.title}</h1>
	</header>
	
	<!--
	============================================================
	章节内容区域
	============================================================
	
	【知识点】语义化 HTML
	- <article> 表示独立的内容单元
	- 比 <div> 更有语义，对 SEO 和辅助技术友好
	-->
	<article class="content">
		
		<!--
		============================================================
		复杂循环：处理章节段落
		============================================================
		
		【知识点】JavaScript 表达式在模板中
		- data.chapter.content.split('\n') 分割文本为段落数组
		- 可以在 {} 中使用任意 JavaScript 表达式
		- Svelte 会在访问时执行表达式
		
		【知识点】{#each} 带索引
		- {#each array as item, index}
		- index 是循环索引（从 0 开始）
		- 可用于生成唯一 key
		*/
		-->
		{#each data.chapter.content.split('\n') as paragraph, i (i)}
			<!--
			============================================================
			Svelte 条件渲染：{#if}
			============================================================
			
			【知识点】{#if} 块语法
			- {#if condition} ... {/if}
			- 条件为真时渲染内容
			- 条件为假时跳过渲染
			
			【知识点】条件链
			- {:else if condition} 多条件判断
			- {:else} 默认情况
			- 类似 JavaScript 的 if/else if/else
			
			【知识点】paragraph.trim() 过滤空行
			- trim() 去除首尾空白
			- 空字符串是 falsy 值，不渲染
			- 保持文本整洁，避免多余空行
			-->
			{#if paragraph.trim()}
				<p>{paragraph.trim()}</p>
			{/if}
		{/each}
	</article>
	
	<!--
	============================================================
	章节导航区域
	============================================================
	
	【知识点】语义化导航
	- <nav> 表示导航区域
	- 辅助技术可以识别并跳过
	-->
	<nav class="navigation">
		
		<!--
		============================================================
		条件渲染上一章链接
		============================================================
		
		【知识点】{#if} 块条件渲染
		- data.prevChapter 存在时渲染链接
		- 不存在时渲染空 <span> 占位
		- 保持布局对称
		
		【知识点】嵌套条件渲染
		- {:else} 分支渲染空元素
		- 用于布局占位，保持 flexbox 对称
		*/
		-->
		{#if data.prevChapter}
			<a href="/chapter/{data.prevChapter.id}" class="nav-link prev">
				← 第{data.prevChapter.id}回 {data.prevChapter.title}
			</a>
		{:else}
			<span></span>
		{/if}
		
		<!--
		============================================================
		条件渲染下一章链接
		============================================================
		-->
		{#if data.nextChapter}
			<a href="/chapter/{data.nextChapter.id}" class="nav-link next">
				第{data.nextChapter.id}回 {data.nextChapter.title} →
			</a>
		{:else}
			<span></span>
		{/if}
	</nav>
</div>

{#if showBackButton}
	<a href="/" class="floating-back" title="返回目录">
		<span class="icon">☰</span>
	</a>
{/if}

<style>
	/*
	============================================================
	基础布局
	============================================================
	
	【知识点】CSS 变量在布局中的应用
	- 所有颜色都使用 var(--color-xxx)
	- 主题切换时自动更新
	- 无需修改样式代码
	*/
	
	.container {
		max-width: 560px;
		margin: 0 auto;
		padding: 2rem;
	}
	
	/*
	============================================================
	页面头部样式
	============================================================
	
	【知识点】视觉层级
	- 通过字体大小、颜色、间距建立层级
	- 标题最大最显眼
	- 次要元素（返回链接）较小较淡
	*/
	.header {
		margin-bottom: 2rem;
		padding-bottom: 1rem;
		
		/*
		【知识点】CSS 变量应用
		- 边框颜色使用变量
		- 水墨黑主题：边框变为深灰（#3a3a3a）
		- 古韵褐主题：边框为浅灰（#dddddd）
		*/
		border-bottom: 1px solid var(--color-border);
	}

	/*
	【知识点】Flexbox 两端对齐
	- header-row 用于放置返回链接和切换器
	- 左边返回目录，右边切换主题
	- 这种布局在工具栏、导航栏中常用
	*/
	.header-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 0.5rem;
	}
	
	/*
	【知识点】链接样式设计
	- 使用主题色（CSS 变量）
	- 去除默认下划线，更简洁
	- 鼠标悬停时添加下划线提示可点击
	
	【知识点】颜色变量使用
	- var(--color-primary) 在主题切换时变化
	- 无需为不同主题写不同样式
	*/
	.back-link {
		color: var(--color-primary);
		text-decoration: none;
		font-size: 0.9rem;
	}
	
	.back-link:hover {
		text-decoration: underline;
	}
	
	/*
	【知识点】标题排版
	- margin-top 为返回链接留出空间
	- 适当的间距让内容更易阅读
	*/
	h1 {
		font-size: 1.8rem;
		color: var(--color-text); /* 使用变量 */
		margin-top: 0.5rem;
	}
	
	/*
	============================================================
	阅读内容样式
	============================================================
	
	【知识点】中文排版
	- line-height: 2 行高为字号的 2 倍
	- 中文阅读通常需要更大的行高
	- text-indent: 2em 首行缩进两个字符
	- 符合中文排版习惯
	
	【知识点】深色模式排版
	- 水墨黑主题：浅色文字（#e0e0e0）
	- 古韵褐主题：深色文字（#333333）
	- 通过 var(--color-text) 自动切换
	*/
	.content {
		line-height: 2;
		text-indent: 2em;
		font-size: 1.1rem;
		color: var(--color-text); /* 随主题变化 */
	}
	
	/*
	【知识点】段落间距
	- margin-bottom 段落之间的间距
	- 配合 text-indent 形成传统的中文段落样式
	*/
	.content p {
		margin-bottom: 1rem;
	}
	
	/*
	============================================================
	导航栏样式
	============================================================
	
	【知识点】Flexbox 两端对齐
	- display: flex 创建弹性容器
	- justify-content: space-between 子元素两端对齐
	- 第一个元素在左，最后一个元素在右
	*/
	.navigation {
		display: flex;
		justify-content: space-between;
		margin-top: 3rem;
		padding-top: 2rem;
		border-top: 1px solid var(--color-border); /* 使用变量 */
	}
	
	/*
	【知识点】导航链接按钮样式
	- padding 内边距，增大点击区域
	- border 边框，形成按钮外观
	- border-radius 圆角，现代外观
	
	【知识点】主题适配
	- border-color 和 color 使用同一变量
	- 保持颜色一致性
	- 悬停时背景色使用主色，文字使用背景色
	*/
	.nav-link {
		color: var(--color-primary);
		text-decoration: none;
		padding: 0.5rem 1rem;
		border: 1px solid var(--color-primary);
		border-radius: 4px;
		transition: all 0.2s;
	}
	
	/*
	【知识点】hover 状态设计
	- 背景色和文字颜色反转
	- 提供明确的视觉反馈
	- 表示元素可交互
	
	【知识点】文字与背景的对比
	- 背景：var(--color-primary) 主色
	- 文字：var(--color-bg) 背景色
	- 确保悬停时文字清晰可读
	- 水墨黑主题：灰背景 + 深黑文字
	- 古韵褐主题：褐背景 + 白色文字
	*/
	.nav-link:hover {
		background: var(--color-primary);
		color: var(--color-bg); /* 使用背景色，形成对比 */
	}

	/*
	============================================================
	悬浮返回按钮
	============================================================
	
	【知识点】固定定位
	- position: fixed 相对于视窗定位
	- 滚动时保持在屏幕固定位置
	*/
	.floating-back {
		position: fixed;
		bottom: 2rem;
		right: 2rem;
		width: 3rem;
		height: 3rem;
		border-radius: 50%;
		background: var(--color-primary);
		color: var(--color-bg);
		display: flex;
		align-items: center;
		justify-content: center;
		text-decoration: none;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
		transition: all 0.3s ease;
		z-index: 1000;
	}

	.floating-back:hover {
		background: var(--color-primary-hover);
		transform: scale(1.1);
		box-shadow: 0 6px 16px rgba(0, 0, 0, 0.25);
	}

	.icon {
		font-size: 1.2rem;
	}
</style>