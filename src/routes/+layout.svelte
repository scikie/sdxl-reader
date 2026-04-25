<script lang="ts">
	import { onMount } from 'svelte';
	import { themeStore } from '$lib/themeStore';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();

	onMount(() => {
		themeStore.init();
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children()}

<style>
	:global(:root) {
		--color-primary: #8b4513;
		--color-primary-hover: #a0522d;
		--color-text: #333333;
		--color-text-secondary: #666666;
		--color-bg: #ffffff;
		--color-bg-hover: #f5f5f5;
		--color-border: #dddddd;
	}

	:global(body) {
		margin: 0;
		background-color: var(--color-bg);
		color: var(--color-text);
		transition: background-color 0.3s ease, color 0.3s ease;
	}
</style>