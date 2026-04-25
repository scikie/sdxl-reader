<script>
	import { page } from '$app/stores';
</script>

<svelte:head>
	<title>{$page.status} - 页面未找到</title>
</svelte:head>

<div class="container">
	<div class="error-content">
		<div class="error-code">{$page.status}</div>
		<h1 class="error-title">页面未找到</h1>
		<p class="error-message">
			{#if $page.status === 404}
				抱歉，您访问的页面不存在或已被移除。
			{:else}
				{$page.error?.message || '发生了未知错误'}
			{/if}
		</p>
		<a href="/" class="home-link">返回首页</a>
	</div>
</div>

<style>
	.container {
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 2rem;
	}

	.error-content {
		text-align: center;
	}

	.error-code {
		font-size: 8rem;
		font-weight: bold;
		color: var(--color-primary);
		line-height: 1;
		margin-bottom: 1rem;
		opacity: 0.8;
	}

	.error-title {
		font-size: 2rem;
		color: var(--color-text);
		margin-bottom: 1rem;
	}

	.error-message {
		color: var(--color-text-secondary);
		font-size: 1.1rem;
		margin-bottom: 2rem;
		line-height: 1.6;
	}

	.home-link {
		display: inline-block;
		padding: 0.75rem 2rem;
		background: var(--color-primary);
		color: var(--color-bg);
		text-decoration: none;
		border-radius: 4px;
		font-size: 1rem;
		transition: background 0.2s;
	}

	.home-link:hover {
		background: var(--color-primary-hover);
	}
</style>
