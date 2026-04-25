<!--
============================================================
主题切换器组件
============================================================

【知识点】Svelte 组件结构
- <script> 标签：JavaScript/TypeScript 逻辑
- HTML 模板：组件的结构和内容
- <style> 标签：组件的样式（自动作用域隔离）

【知识点】组件的职责
- 显示主题切换按钮
- 展示可选主题列表
- 处理主题切换逻辑
-->

<script lang="ts">
	/*
	【知识点】导入路径别名
	- $lib 是 SvelteKit 的路径别名
	- 指向 src/lib 目录
	- 避免使用相对路径 ../../../lib/themeStore
	- 在 svelte.config.js 中配置
	*/
	import { themeStore } from '$lib/themeStore';

	/*
	【知识点】$state() 响应式状态
	- Svelte 5 新的状态声明方式
	- 创建响应式变量，值变化时自动更新视图
	- 替代了 Svelte 4 的 let xxx = value
	
	【知识点】$state() vs 普通变量
	- let x = 1;           // 普通变量，变化时视图不更新
	- let x = $state(1);   // 响应式状态，变化时视图自动更新
	*/
	
	/*
	【知识点】从 Store 派生状态
	- $themeStore 是 Svelte 的特殊语法
	- 自动订阅 Store，获取其当前值
	- Store 值变化时，组件自动重新渲染
	
	【知识点】$ 语法糖
	- $store 是 Svelte 的自动订阅语法
	- 等价于：
	  let unsubscribe = store.subscribe(value => { ... });
	  onDestroy(unsubscribe);
	- Svelte 自动处理订阅和取消订阅
	*/
	
	// 当前选中的主题名称（响应式状态）
	let currentTheme = $state($themeStore);
	
	// 下拉菜单是否展开（响应式状态）
	let isOpen = $state(false);

	/*
	【知识点】$effect() 副作用
	- Svelte 5 新的副作用处理方式
	- 当依赖的响应式值变化时自动执行
	- 用于处理副作用（订阅、事件监听等）
	
	【知识点】$effect vs $:（Svelte 4）
	- Svelte 4: $: console.log(value)
	- Svelte 5: $effect(() => { console.log(value) })
	- $effect 更明确地表示这是副作用
	
	【知识点】返回清理函数
	- $effect 可以返回一个函数
	- 该函数在下次 effect 执行前或组件销毁时调用
	- 用于清理订阅、定时器等，防止内存泄漏
	*/
	$effect(() => {
		// 订阅 themeStore 的变化
		const unsubscribe = themeStore.subscribe((value) => {
			currentTheme = value;
		});
		
		// 返回清理函数，取消订阅
		return unsubscribe;
	});

	/**
	 * 处理主题切换
	 * 
	 * 【知识点】按钮点击处理函数
	 * - 在 Svelte 中，使用 onclick 而非 onClick
	 * - 直接传递函数引用，无需 bind(this)
	 * 
	 * 【知识点】any 类型（临时使用）
	 * - 这里为了简单使用了 any 类型断言
	 * - 实际项目中应使用更精确的类型
	 * 
	 * @param themeName - 选中的主题名称
	 */
	function handleThemeChange(themeName: string) {
		// 调用 Store 的 setTheme 方法
		themeStore.setTheme(themeName as any);
		
		// 关闭下拉菜单
		isOpen = false;
	}

	/*
	【知识点】调用 Store 方法
	- getAllThemes() 返回所有主题的数组
	- 在模板中使用 each 循环渲染
	
	【知识点】const 在 <script> 中
	- 顶层 const 变量可在模板中使用
	- 不同于 $state()，const 值不会触发重新渲染
	- 这里 getAllThemes 每次都返回新数组，但内容相同，不需要响应式
	*/
	const allThemes = themeStore.getAllThemes();
</script>

<!--
============================================================
主题切换按钮区域
============================================================

【知识点】Svelte class 指令
- class="theme-switcher" 定义基础样式类
- class:selected={condition} 条件类名
- 当 condition 为真时添加 selected 类

【知识点】aria-label 无障碍
- 为屏幕阅读器提供可访问性标签
- 图标按钮必须提供，帮助视障用户理解按钮用途
-->

<div class="theme-switcher">
	<!--
	【知识点】onclick 事件处理
	- onclick={() => ...} 内联事件处理
	- 点击按钮切换菜单展开状态
	- !$state 取反（true 变 false，false 变 true）
	
	【知识点】aria-label 属性
	- 无障碍属性，为屏幕阅读器提供文字描述
	- 图标按钮缺少这些属性时对视障用户不友好
	- title 属性提供鼠标悬停提示
	-->
	<button
		class="theme-button"
		onclick={() => (isOpen = !isOpen)}
		aria-label="切换主题"
		title="切换主题"
	>
		<!--
		【知识点】SVG 图标
		- 内联 SVG 比 图标库更轻量
		- 直接写在模板中，无需额外请求
		- 所有属性均可自定义（颜色、大小等）
		
		【知识点】SVG 属性说明
		- xmlns: SVG 命名空间，必须声明
		- width/height: 图标尺寸
		- viewBox: 坐标系统 "x y width height"
		- stroke: 线条颜色，currentColor 继承父元素颜色
		- stroke-width: 线条粗细
		- stroke-linecap: 线条端点样式
		- stroke-linejoin: 线条连接处样式
		- fill: 填充，none 表示只有线条
		-->
		<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
			<!-- 太阳图标的各个部分 -->
			<circle cx="12" cy="12" r="4"></circle>        <!-- 中心圆 -->
			<path d="M12 2v2"></path>                       <!-- 上 -->
			<path d="M12 20v2"></path>                     <!-- 下 -->
			<path d="m4.93 4.93 1.41 1.41"></path>         <!-- 左上 -->
			<path d="m17.66 17.66 1.41 1.41"></path>       <!-- 右下 -->
			<path d="M2 12h2"></path>                       <!-- 左 -->
			<path d="M20 12h2"></path>                     <!-- 右 -->
			<path d="m6.34 17.66-1.41 1.41"></path>       <!-- 左下 -->
			<path d="m19.07 4.93-1.41 1.41"></path>       <!-- 右上 -->
		</svg>
	</button>

	<!--
	【知识点】条件渲染 {#if}
	- 根据条件决定是否渲染某部分 DOM
	- isOpen 为 true 时渲染菜单
	-isOpen 为 false 时完全移除 DOM 元素
	-->
	{#if isOpen}
		<!--
		【知识点】下拉菜单
		- 使用绝对定位，悬浮在页面上方
		- 位置相对于父元素 .theme-switcher
		-->
		<div class="theme-menu">
			<!--
			【知识点】{#each} 循环
			- 遍历 allThemes 数组，为每个主题生成按钮
			- (theme.name) 是 key，帮助 Svelte 识别元素
			- 有 key 时，列表更新效率更高
			
			【知识点】key 的作用
			- 帮助 Svelte 追踪列表元素
			- 当数据变化时，能正确复用或更新 DOM
			- 使用稳定的唯一标识符（如 id）作为 key
			-->
			{#each allThemes as theme (theme.name)}
				<!--
				【知识点】动态 class
				- class:selected={...} 条件类名
				- currentTheme === theme.name 时添加 selected 类
				- 用于高亮当前选中的主题
				-->
				<button
					class="theme-option"
					class:selected={currentTheme === theme.name}
					onclick={() => handleThemeChange(theme.name)}
				>
					<!--
					【知识点】style 指令
					- style:property={value} 动态设置样式
					- 这里根据主题的 primary 颜色设置背景
					- 每个主题按钮显示对应的颜色预览
					-->
					<span class="theme-color" style="background-color: {theme.colors.primary}"></span>
					<span class="theme-label">{theme.label}</span>
				</button>
			{/each}
		</div>
	{/if}
</div>

<style>
	/*
	============================================================
	组件样式
	============================================================
	
	【知识点】Svelte 样式作用域
	- <style> 中的样式默认只作用于当前组件
	- Svelte 会给类名添加唯一后缀（如 svelte-xxx）
	- 避免样式冲突，不会影响其他组件
	
	【知识点】CSS 变量使用
	- var(--color-primary) 使用全局 CSS 变量
	- 变量定义在 +layout.svelte 的 :global(:root)
	- 主题切换时，这些变量会动态改变
	*/
	
	/*
	【知识点】相对定位
	- position: relative 建立定位上下文
	- 子元素可以使用绝对定位，相对于此元素定位
	- .theme-menu 会绝对定位在 .theme-switcher 内部
	*/
	.theme-switcher {
		position: relative;
	}

	/*
	【知识点】Flex 居中
	- display: flex 创建弹性容器
	- align-items: center 垂直居中
	- justify-content: center 水平居中
	- 用于图标按钮居中显示
	*/
	.theme-button {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 40px;
		height: 40px;
		
		/*
		【知识点】边框样式
		- border: 1px solid color 完整边框声明
		- 使用 CSS 变量，主题切换时自动变化
		*/
		border: 1px solid var(--color-border);
		border-radius: 8px;  /* 圆角，现代 UI 风格 */
		
		/*
		【知识点】CSS 变量回退值
		- var(--color-bg) 使用变量值
		- 浏览器会自动获取最新的变量值
		- 主题切换时，背景、边框、文字颜色都会变化
		*/
		background: var(--color-bg);
		color: var(--color-text);
		cursor: pointer;  /* 鼠标指针，提示可点击 */
		
		/*
		【知识点】CSS 过渡动画
		- transition: all 0.2s ease
		- all: 监听所有属性变化
		- 0.2s: 动画持续 0.2 秒
		- ease: 缓动函数，开始慢中间快结束慢
		- 产生平滑的视觉过渡效果
		*/
		transition: all 0.2s ease;
	}

	/*
	【知识点】:hover 伪类
	- 鼠标悬停在元素上时的样式
	- 用户交互反馈，提升用户体验
	*/
	.theme-button:hover {
		background: var(--color-bg-hover);
		border-color: var(--color-primary);
		color: var(--color-primary);
	}

	/*
	【知识点】下拉菜单定位
	- position: absolute 绝对定位
	- top: calc(100% + 8px) 在按钮下方 8px
	- right: 0 右对齐
	- 绝对定位元素脱离文档流，不影响其他元素
	*/
	.theme-menu {
		position: absolute;
		top: calc(100% + 8px);  /* calc() 计算，按钮高度 + 8px */
		right: 0;
		min-width: 140px;      /* 最小宽度，保证内容显示 */
		
		/*
		【知识点】样式继承
		- 这里也使用 CSS 变量
		- 与主题色保持一致
		*/
		background: var(--color-bg);
		border: 1px solid var(--color-border);
		border-radius: 8px;
		
		/*
		【知识点】box-shadow 阴影
		- 格式: box-shadow: x y blur spread color
		- rgba 红绿蓝透明度表示颜色
		- 创建悬浮效果，增强层次感
		*/
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
		
		padding: 8px 0;  /* 内边距，上下各 8px */
		z-index: 100;    /* 层级，保证在其他元素上方 */
	}

	/*
	【知识点】下拉选项样式
	- width: 100% 占满父元素宽度
	- text-align: left 文字左对齐
	- border: none 移除默认按钮边框
	*/
	.theme-option {
		display: flex;
		align-items: center;
		gap: 10px;        /* flex 间距 */
		width: 100%;
		padding: 10px 16px;
		border: none;
		background: transparent;
		color: var(--color-text);
		cursor: pointer;
		text-align: left;
		transition: background 0.2s ease;
	}

	/*
	【知识点】:hover 状态
	- 鼠标悬停时显示反馈
	*/
	.theme-option:hover {
		background: var(--color-bg-hover);
	}

	/*
	【知识点】选中状态样式
	- .selected 类被动态添加时生效
	- 突出显示当前选中的主题
	*/
	.theme-option.selected {
		background: var(--color-bg-hover);
		color: var(--color-primary);
	}

	/*
	【知识点】颜色预览圆点
	- border-radius: 50% 创建圆形
	- flex-shrink: 0 防止被压缩
	- 显示主题的主色调预览
	*/
	.theme-color {
		width: 20px;
		height: 20px;
		border-radius: 50%;
		border: 2px solid var(--color-border);
		flex-shrink: 0;  /* 在 flex 容器中不被压缩 */
	}

	/*
	【知识点】主题名称文字
	- font-size: 0.95rem 使用相对单位
	- rem 相对于根元素字体大小
	- 响应式友好
	*/
	.theme-label {
		font-size: 0.95rem;
	}
</style>