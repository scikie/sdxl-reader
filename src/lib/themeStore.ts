import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import { themes, defaultTheme, type ThemeName, type Theme } from './themes';

function createThemeStore() {
	const getInitialTheme = (): ThemeName => {
		if (browser) {
			const stored = localStorage.getItem('theme') as ThemeName;
			if (stored && themes[stored]) {
				return stored;
			}
		}
		return defaultTheme;
	};

	const { subscribe, set, update } = writable<ThemeName>(getInitialTheme());

	const applyTheme = (themeName: ThemeName) => {
		const theme = themes[themeName];
		if (!theme || !browser) return;

		const root = document.documentElement;
		root.style.setProperty('--color-primary', theme.colors.primary);
		root.style.setProperty('--color-primary-hover', theme.colors.primaryHover);
		root.style.setProperty('--color-text', theme.colors.text);
		root.style.setProperty('--color-text-secondary', theme.colors.textSecondary);
		root.style.setProperty('--color-bg', theme.colors.background);
		root.style.setProperty('--color-bg-hover', theme.colors.backgroundHover);
		root.style.setProperty('--color-border', theme.colors.border);

		localStorage.setItem('theme', themeName);
	};

	return {
		subscribe,
		setTheme: (themeName: ThemeName) => {
			set(themeName);
			applyTheme(themeName);
		},
		getTheme: (name: ThemeName): Theme => themes[name],
		getAllThemes: () => Object.values(themes),
		init: () => {
			const theme = getInitialTheme();
			applyTheme(theme);
		}
	};
}

export const themeStore = createThemeStore();