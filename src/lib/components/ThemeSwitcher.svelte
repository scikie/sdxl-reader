<script lang="ts">
	import { themeStore } from '$lib/themeStore';

	let currentTheme = $state($themeStore);
	let isOpen = $state(false);

	$effect(() => {
		const unsubscribe = themeStore.subscribe((value) => {
			currentTheme = value;
		});
		return unsubscribe;
	});

	function handleThemeChange(themeName: string) {
		themeStore.setTheme(themeName as any);
		isOpen = false;
	}

	const allThemes = themeStore.getAllThemes();
</script>

<div class="theme-switcher">
	<button
		class="theme-button"
		onclick={() => (isOpen = !isOpen)}
		aria-label="切换主题"
		title="切换主题"
	>
		<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
			<circle cx="12" cy="12" r="4"></circle>
			<path d="M12 2v2"></path>
			<path d="M12 20v2"></path>
			<path d="m4.93 4.93 1.41 1.41"></path>
			<path d="m17.66 17.66 1.41 1.41"></path>
			<path d="M2 12h2"></path>
			<path d="M20 12h2"></path>
			<path d="m6.34 17.66-1.41 1.41"></path>
			<path d="m19.07 4.93-1.41 1.41"></path>
		</svg>
	</button>

	{#if isOpen}
		<div class="theme-menu">
			{#each allThemes as theme (theme.name)}
				<button
					class="theme-option"
					class:selected={currentTheme === theme.name}
					onclick={() => handleThemeChange(theme.name)}
				>
					<span class="theme-color" style="background-color: {theme.colors.primary}"></span>
					<span class="theme-label">{theme.label}</span>
				</button>
			{/each}
		</div>
	{/if}
</div>

<style>
	.theme-switcher {
		position: relative;
	}

	.theme-button {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 40px;
		height: 40px;
		border: 1px solid var(--color-border);
		border-radius: 8px;
		background: var(--color-bg);
		color: var(--color-text);
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.theme-button:hover {
		background: var(--color-bg-hover);
		border-color: var(--color-primary);
		color: var(--color-primary);
	}

	.theme-menu {
		position: absolute;
		top: calc(100% + 8px);
		right: 0;
		min-width: 140px;
		background: var(--color-bg);
		border: 1px solid var(--color-border);
		border-radius: 8px;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
		padding: 8px 0;
		z-index: 100;
	}

	.theme-option {
		display: flex;
		align-items: center;
		gap: 10px;
		width: 100%;
		padding: 10px 16px;
		border: none;
		background: transparent;
		color: var(--color-text);
		cursor: pointer;
		text-align: left;
		transition: background 0.2s ease;
	}

	.theme-option:hover {
		background: var(--color-bg-hover);
	}

	.theme-option.selected {
		background: var(--color-bg-hover);
		color: var(--color-primary);
	}

	.theme-color {
		width: 20px;
		height: 20px;
		border-radius: 50%;
		border: 2px solid var(--color-border);
		flex-shrink: 0;
	}

	.theme-label {
		font-size: 0.95rem;
	}
</style>