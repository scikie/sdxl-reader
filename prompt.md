我学习svelte教程，我创建了一个svelte项目，怎么那么多文件？我看教程只有一个App.svelte文件.我应该怎么办？

你创建的是SvelteKit项目（完整项目框架），教程里用的是Svelte REPL（在线演示环境）。
区别：
- 教程的App.svelte：在REPL中，只需关注单个组件
- 你的项目：是一个完整的应用框架，包含路由、配置文件等
建议做法：
1. 如果只是学习基础，可以在 src/routes/+page.svelte 中编写你的代码（这是主页面）
2. 或者使用Svelte REPL：https://svelte.dev/repl
你的主要代码写在 src/routes/+page.svelte 就行，其他文件暂时不用管。

