export type ThemeName = 'classic' | 'jade' | 'ink' | 'bamboo' | 'sunset';

export interface Theme {
	name: ThemeName;
	label: string;
	colors: {
		primary: string;
		primaryHover: string;
		text: string;
		textSecondary: string;
		background: string;
		backgroundHover: string;
		border: string;
	};
}

export const themes: Record<ThemeName, Theme> = {
	classic: {
		name: 'classic',
		label: '古韵褐',
		colors: {
			primary: '#8b4513',
			primaryHover: '#a0522d',
			text: '#333333',
			textSecondary: '#666666',
			background: '#ffffff',
			backgroundHover: '#f5f5f5',
			border: '#dddddd'
		}
	},
	jade: {
		name: 'jade',
		label: '碧玉青',
		colors: {
			primary: '#2e8b57',
			primaryHover: '#3cb371',
			text: '#1a1a1a',
			textSecondary: '#555555',
			background: '#f0fff0',
			backgroundHover: '#e0f0e0',
			border: '#a8d8a8'
		}
	},
	ink: {
		name: 'ink',
		label: '水墨黑',
		colors: {
			primary: '#a0a0a0',
			primaryHover: '#b8b8b8',
			text: '#e0e0e0',
			textSecondary: '#a0a0a0',
			background: '#1a1a1a',
			backgroundHover: '#2a2a2a',
			border: '#3a3a3a'
		}
	},
	bamboo: {
		name: 'bamboo',
		label: '竹简黄',
		colors: {
			primary: '#b8860b',
			primaryHover: '#d4a017',
			text: '#3d2914',
			textSecondary: '#5d4930',
			background: '#fdf5e6',
			backgroundHover: '#f5ead0',
			border: '#d4b896'
		}
	},
	sunset: {
		name: 'sunset',
		label: '残阳红',
		colors: {
			primary: '#cd5c5c',
			primaryHover: '#dc6b6b',
			text: '#2d2d2d',
			textSecondary: '#5a5a5a',
			background: '#fffaf0',
			backgroundHover: '#fff0e0',
			border: '#e8d0c0'
		}
	}
};

export const defaultTheme: ThemeName = 'classic';