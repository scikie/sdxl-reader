<script>
	import ThemeSwitcher from '$lib/components/ThemeSwitcher.svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title>{data.chapter.title} - 神雕侠侣</title>
</svelte:head>

<div class="container">
	<header class="header">
		<div class="header-row">
			<a href="/" class="back-link">← 目录</a>
			<ThemeSwitcher />
		</div>
		<h1>{data.chapter.title}</h1>
	</header>
	
	<article class="content">
		{#each data.chapter.content.split('\n') as paragraph, i (i)}
			{#if paragraph.trim()}
				<p>{paragraph.trim()}</p>
			{/if}
		{/each}
	</article>
	
	<nav class="navigation">
		{#if data.prevChapter}
			<a href="/chapter/{data.prevChapter.id}" class="nav-link prev">
				← 第{data.prevChapter.id}回 {data.prevChapter.title}
			</a>
		{:else}
			<span></span>
		{/if}
		
		{#if data.nextChapter}
			<a href="/chapter/{data.nextChapter.id}" class="nav-link next">
				第{data.nextChapter.id}回 {data.nextChapter.title} →
			</a>
		{:else}
			<span></span>
		{/if}
	</nav>
</div>

<style>
	.container {
		max-width: 560px;
		margin: 0 auto;
		padding: 2rem;
	}

	.header {
		margin-bottom: 2rem;
		padding-bottom: 1rem;
		border-bottom: 1px solid var(--color-border);
	}

	.header-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 0.5rem;
	}
	
	.back-link {
		color: var(--color-primary);
		text-decoration: none;
		font-size: 0.9rem;
	}
	
	.back-link:hover {
		text-decoration: underline;
	}
	
	h1 {
		font-size: 1.8rem;
		color: var(--color-text);
		margin-top: 0.5rem;
	}
	
	.content {
		line-height: 2;
		text-indent: 2em;
		font-size: 1.1rem;
		color: var(--color-text);
	}
	
	.content p {
		margin-bottom: 1rem;
	}
	
	.navigation {
		display: flex;
		justify-content: space-between;
		margin-top: 3rem;
		padding-top: 2rem;
		border-top: 1px solid var(--color-border);
	}
	
	.nav-link {
		color: var(--color-primary);
		text-decoration: none;
		padding: 0.5rem 1rem;
		border: 1px solid var(--color-primary);
		border-radius: 4px;
		transition: all 0.2s;
	}
	
	.nav-link:hover {
		background: var(--color-primary);
		color: var(--color-bg);
	}
</style>