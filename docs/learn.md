
# bind:this

在 Svelte 中，`bind:this` 用于**获取对 DOM 元素或组件实例的引用**。它类似于 React 的 `ref`，但语法更简洁。

## 基本用法

### 1. 获取 DOM 元素引用
```html
<script>
  import { onMount } from 'svelte';
  
  let myInput;
  
  onMount(() => {
    // 组件挂载后，myInput 将指向实际的 DOM 元素
    if (myInput) {
      myInput.focus();
      console.log('Input element:', myInput);
    }
  });
  
  function handleClick() {
    myInput.value = 'Changed!';
    myInput.style.color = 'red';
  }
</script>

<input bind:this={myInput} placeholder="Type something..." />
<button on:click={handleClick}>Change Input</button>
```

### 2. 获取组件实例引用
```html
<!-- Child.svelte -->
<script>
  export function sayHello() {
    console.log('Hello from Child component!');
  }
  
  export let count = 0;
</script>

<div>Child count: {count}</div>

<!-- Parent.svelte -->
<script>
  import Child from './Child.svelte';
  
  let childComponent;
  
  function callChildMethod() {
    if (childComponent) {
      childComponent.sayHello();  // 调用子组件的方法
      childComponent.count += 1;  // 修改子组件的属性
    }
  }
</script>

<Child bind:this={childComponent} />
<button on:click={callChildMethod}>Call Child Method</button>
```

## 详细示例

### 示例1：自动聚焦和测量元素
```html
<script>
  import { tick } from 'svelte';
  
  let textarea;
  let dimensions = { width: 0, height: 0 };
  
  async function measure() {
    await tick(); // 确保 DOM 已更新
    if (textarea) {
      dimensions = {
        width: textarea.offsetWidth,
        height: textarea.offsetHeight
      };
    }
  }
</script>

<textarea 
  bind:this={textarea}
  on:input={measure}
  placeholder="Type to measure..."
></textarea>

{#if textarea}
  <p>
    Size: {dimensions.width} × {dimensions.height}px
  </p>
{/if}
```

### 示例2：视频控件
```html
<script>
  let videoElement;
  let isPlaying = false;
  
  function togglePlay() {
    if (!videoElement) return;
    
    if (isPlaying) {
      videoElement.pause();
    } else {
      videoElement.play();
    }
    isPlaying = !isPlaying;
  }
  
  function skip(seconds) {
    if (videoElement) {
      videoElement.currentTime += seconds;
    }
  }
</script>

<video
  bind:this={videoElement}
  on:play={() => isPlaying = true}
  on:pause={() => isPlaying = false}
  width="400"
>
  <source src="/video.mp4" type="video/mp4">
</video>

<div>
  <button on:click={togglePlay}>
    {isPlaying ? 'Pause' : 'Play'}
  </button>
  <button on:click={() => skip(-5)}>← 5s</button>
  <button on:click={() => skip(5)}>5s →</button>
</div>
```

## 注意事项

1. **初始值为 `undefined`**：在组件挂载前，引用为 `undefined`
   ```html
   <script>
     let ref;
     // 初始为 undefined
     console.log(ref); // undefined
     
     onMount(() => {
       console.log(ref); // 实际 DOM 元素
     });
   </script>
   ```

2. **响应式更新**：引用变化时会触发响应式更新
   ```html
   <script>
     let currentElement;
     
     $: if (currentElement) {
       console.log('Element changed:', currentElement);
     }
   </script>
   
   {#if condition}
     <div bind:this={currentElement}>First</div>
   {:else}
     <div bind:this={currentElement}>Second</div>
   {/if}
   ```

3. **与 `bind:` 的区别**：
   - `bind:property`：双向绑定属性值
   - `bind:this`：获取元素/组件引用

4. **TypeScript 类型**：
   ```typescript
   let inputEl: HTMLInputElement;
   let myComponent: InstanceType<typeof MyComponent>;
   ```

## 最佳实践

1. **避免过度使用**：优先使用 Svelte 的声明式方法
2. **检查存在性**：使用前检查是否为 `undefined`
3. **清理引用**：必要时在 `onDestroy` 中清理
4. **配合 `tick()`**：DOM 更新后操作使用 `await tick()`

`bind:this` 提供了必要的逃生舱，用于直接 DOM 操作、第三方库集成等场景，但应谨慎使用以保持代码的声明性。