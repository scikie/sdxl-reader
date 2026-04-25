# Svelte Canvas Context 示例解析

这个例子展示了如何使用 Svelte 5 的 Context API 和响应式系统创建一个画布绘图系统。

## 核心概念

### 1. Context API (上下文传递)

Context API 用于在组件树中共享数据，无需逐层传递 props。

- **`setContext`**: 在父组件中设置上下文
- **`getContext`**: 在子组件中获取上下文

```
Canvas.svelte (setContext) ──┐
                             │──> 共享 "canvas" 上下文
Square.svelte (getContext) ──┘
```

### 2. Svelte 5 新特性

- **`$props()`**: 定义组件属性（替代传统的 `export let`）
- **`$effect()`**: 响应式副作用（替代 `$:` 响应式语句）
- **`SvelteSet`**: 响应式 Set 集合

---

## 组件解析

### Canvas.svelte - 画布容器

```svelte
let { width = 100, height = 100, children } = $props();
```
使用 `$props()` 定义组件属性，`children` 是插槽内容。

```svelte
setContext('canvas', { addItem });
```
设置名为 `'canvas'` 的上下文，暴露 `addItem` 方法供子组件调用。

```svelte
function addItem(fn) {
    $effect(() => {
        items.add(fn);
        return () => items.delete(fn);
    });
}
```
`addItem` 用 `$effect` 包装，确保：
- 组件挂载时添加绘制函数
- 组件销毁时自动清理（通过返回的清理函数）

```svelte
$effect(() => {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, width, height);
    items.forEach(fn => fn(ctx));
});
```
响应式渲染：每当 `items` 变化时，清空画布并重新绘制所有图形。

---

### Square.svelte - 绘制正方形

```svelte
let { x, y, size, rotate } = $props();
```
接收位置、大小、旋转角度属性。

```svelte
getContext('canvas').addItem(draw);
```
获取 canvas 上下文，注册 `draw` 绘制函数。

```svelte
function draw(ctx) {
    ctx.save();
    ctx.translate(x, y);      // 移动到目标位置
    ctx.rotate(rotate);       // 旋转
    ctx.strokeStyle = 'black';
    ctx.strokeRect(-size/2, -size/2, size, size);  // 绘制正方形（中心对齐）
    ctx.restore();
}
```
使用 Canvas 2D API 绘制正方形，注意坐标原点在正方形中心。

---

### App.svelte - 主应用

```svelte
function random() {
    seed *= 16807;
    seed %= 2147483647;
    return (seed - 1) / 2147483646;
}
```
**种子随机数生成器**：使用固定种子确保每次渲染结果一致（伪随机）。

```svelte
{#each Array(12) as _, c}
    {#each Array(22) as _, r}
        <Square ... />
    {/each}
{/each}
```
创建 12×22 = 264 个正方形的网格。

```svelte
x={180 + c * 40 + jitter(r * 2)}
y={180 + r * 40 + jitter(r * 2)}
rotate={jitter(r * 0.05)}
```
- 基础位置：网格排列
- `jitter()`: 添加随机偏移，产生"手绘"效果
- `r * 2`: 行号越大，抖动越明显（近大远小的透视感）

---

## 执行流程

```
1. App 渲染 Canvas 组件
       ↓
2. Canvas 调用 setContext('canvas', { addItem })
       ↓
3. Canvas 使用 {@render children()} 渲染子内容
       ↓
4. 每个 Square 组件调用 getContext('canvas').addItem(draw)
       ↓
5. addItem 用 $effect 将 draw 函数添加到 items 集合
       ↓
6. Canvas 的 $effect 检测到 items 变化，重新绘制
```

---

## 关键点总结

| 概念 | 说明 |
|------|------|
| Context | 父子组件通信的"隐形桥梁" |
| $effect | 自动追踪依赖，组件销毁时自动清理 |
| SvelteSet | 触发响应式更新的 Set |
| 种子随机 | 确保随机结果可重现 |
| Canvas 2D | save/restore 管理绘图状态 |

这种模式特别适合：图表库、游戏引擎、数据可视化等需要统一渲染的场景。
