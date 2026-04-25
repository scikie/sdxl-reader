<script>
	import ThemeSwitcher from '$lib/components/ThemeSwitcher.svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title>神雕侠侣 - 金庸</title>
</svelte:head>

<div class="container">
	<header>
		<div class="header-top">
			<div></div>
			<ThemeSwitcher />
		</div>
		<h1>神雕侠侣</h1>
		<p class="author">金庸 著</p>
	</header>
	
	<div class="chapters">
		{#each data.chapters as chapter (chapter.id)}
			<a href="/chapter/{chapter.id}" class="chapter-link">
				<span class="chapter-num">第{chapter.id}回</span>
				<span class="chapter-title">{chapter.title}</span>
			</a>
		{/each}
	</div>
</div>

<style>
	.container {
		max-width: 560px;
		margin: 0 auto;
		padding: 2rem;
	}
	
	.header-top {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1rem;
	}

	header {
		text-align: center;
		margin-bottom: 3rem;
		padding-bottom: 2rem;
		border-bottom: 1px solid var(--color-border);
	}
	
	h1 {
		font-size: 2.5rem;
		color: var(--color-text);
		margin-bottom: 0.5rem;
	}
	
	.author {
		color: var(--color-text-secondary);
		font-size: 1.1rem;
	}
	
	.chapters {
		display: grid;
		gap: 0.5rem;
	}
	
	.chapter-link {
		display: flex;
		align-items: center;
		padding: 1rem;
		background: var(--color-bg);
		border-radius: 8px;
		text-decoration: none;
		color: var(--color-text);
		border: 1px solid var(--color-border);
		transition: all 0.2s;
	}
	
	.chapter-link:hover {
		background: var(--color-bg-hover);
		transform: translateX(5px);
		border-color: var(--color-primary);
	}
	
	.chapter-num {
		font-weight: bold;
		min-width: 80px;
		color: var(--color-primary);
	}
	
	.chapter-title {
		margin-left: 1rem;
	}
</style>