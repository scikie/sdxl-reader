/*
============================================================
阅读进度状态管理 Store
============================================================

【知识点】阅读进度持久化
- 使用 localStorage 保存用户阅读进度
- 下次打开时可以快速恢复到上次阅读位置
- 提升用户体验

【知识点】Store 模式复用
- 参考 themeStore 的实现模式
- 使用 writable 创建可订阅的状态
- 封装业务逻辑，提供简洁的 API
*/

import { writable } from 'svelte/store';
import { browser } from '$app/environment';

/**
 * 阅读进度数据类型
 * 
 * 【知识点】TypeScript 接口定义
 * - 定义数据结构，提供类型安全
 * - 包含章节 ID 和标题信息
 */
export interface ReadingProgress {
	chapterId: number;
	chapterTitle: string;
	timestamp: number;
}

/**
 * 创建阅读进度 Store
 * 
 * 【知识点】自定义 Store 模式
 * - 封装状态管理和业务逻辑
 * - 提供清晰的 API 接口
 * - 隐藏实现细节
 */
function createReadingProgressStore() {
	/**
	 * 从 localStorage 获取初始进度
	 * 
	 * 【知识点】JSON.parse 处理
	 * - localStorage 只能存储字符串
	 * - 使用 JSON.stringify/parse 序列化对象
	 */
	const getInitialProgress = (): ReadingProgress | null => {
		if (browser) {
			const stored = localStorage.getItem('readingProgress');
			if (stored) {
				try {
					return JSON.parse(stored);
				} catch {
					return null;
				}
			}
		}
		return null;
	};

	const { subscribe, set, update } = writable<ReadingProgress | null>(getInitialProgress());

	/**
	 * 保存进度到 localStorage
	 */
	const saveToStorage = (progress: ReadingProgress | null) => {
		if (browser) {
			if (progress) {
				localStorage.setItem('readingProgress', JSON.stringify(progress));
			} else {
				localStorage.removeItem('readingProgress');
			}
		}
	};

	return {
		subscribe,
		
		/**
		 * 更新阅读进度
		 * @param chapterId 章节编号
		 * @param chapterTitle 章节标题
		 */
		setProgress: (chapterId: number, chapterTitle: string) => {
			const progress: ReadingProgress = {
				chapterId,
				chapterTitle,
				timestamp: Date.now()
			};
			set(progress);
			saveToStorage(progress);
		},
		
		/**
		 * 清除阅读进度
		 */
		clearProgress: () => {
			set(null);
			saveToStorage(null);
		},
		
		/**
		 * 获取当前进度
		 */
		getProgress: (): ReadingProgress | null => {
			return getInitialProgress();
		}
	};
}

export const readingProgressStore = createReadingProgressStore();
