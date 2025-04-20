
## 修复容器背景未铺满的问题

1. 修改`.container` 的`height` 属性为`100vh` 确保撑满视口高度
2. 为`page` 选择器设置`height:100%` 和`min-height:100vh` 实现根节点高度继承
3. 通过flex布局确保内容区域自动扩展填充剩余空间
现在背景渐变应该可以完整覆盖整个页面可视区域，包括滚动区域。

## display: flex
​- 含义: 将容器设置为 ​弹性布局（Flexbox）​，使其子元素（flex items）能够按弹性规则排列。
- 作用
  - 子元素默认沿主轴（水平方向）排列（可通过 flex-direction 修改）。
  - 子元素默认不换行（除非设置 flex-wrap）。
  - 子元素高度/宽度可自动填充剩余空间（通过 flex-grow 属性）。

## flex-wrap: wrap
​- 含义: 控制子元素在容器内 ​是否换行。
  - nowrap（默认）：不换行，子元素可能溢出容器。
  - wrap：空间不足时自动换行（多行排列）。
  - wrap-reverse：反向换行（从下到上/从右到左）。
​- 作用
  - 解决内容溢出问题，适合动态数量的子元素布局（如标签列表、商品网格）。
  - 与 justify-content 配合实现多行对齐。

## align-items
align-items 属性是 ​Flex 布局中用于控制容器内所有子项（flex items）在 ​交叉轴（侧轴）​ 方向上对齐方式的核心属性。其作用机制和实际应用场景如下：

1. **定义对齐方向**  
   交叉轴的方向由 `flex-direction` 决定：  
   - 若主轴为水平（`flex-direction: row`），交叉轴为垂直方向；  
   - 若主轴为垂直（`flex-direction: column`），交叉轴为水平方向。

2. **统一对齐方式**  
   通过为 Flex 容器设置 `align-items`，可统一所有子项在交叉轴上的对齐方式。例如，实现垂直居中、顶部对齐等效果。

3. **属性值及效果**
`align-items` 支持以下常用属性值：

| 值          | 效果    | 适用场景示例                     |
|-------------|-------------------------------------|-----------|
|`stretch`| **默认值**。子项拉伸以填满容器交叉轴空间（需子项未设置固定高度/宽度）。| 等高/等宽布局（如自适应高度卡片）|
|`flex-start`| 子项对齐到交叉轴起点（顶部或左侧）。| 顶部对齐的导航栏或左对齐的垂直列表|
|`flex-end`| 子项对齐到交叉轴终点（底部或右侧。| 底部固定的页脚或右对齐的侧边栏|
|`center`| 子项在交叉轴居中对齐。| 垂直居中文本、图片或按钮|
|`baseline`| 子项基于第一行文本的基线对齐。| 多行文本或不同字号元素的基线对齐（如表格行） |

4. 实际应用技巧
 -  **与 `align-self` 配合**  
   若需单独调整某个子项的对齐方式，可用 `align-self` 覆盖容器的 `align-items` 设置。例如：  
   ```css
   .container { align-items: center; }
   .special-item { align-self: flex-end; }
   ```

 - **响应式布局**  
   结合媒体查询动态调整对齐方式，适配不同屏幕尺寸。例如移动端改为顶部对齐，PC端居中。

 - **注意容器高度**  
   若需垂直居中（`align-items: center`），需确保容器有明确的高度（如 `height: 300px`），否则无法生效。

5. **与其他属性的区别**
- **`justify-content`**：控制主轴对齐，如水平居中或两端对齐。
- **`align-content`**：仅在多行 Flex 容器中生效，调整行间间距（需配合 `flex-wrap: wrap`）。
- **`text-align`**：仅影响行内内容，不适用于 Flex 布局的对齐。

6. **示例代码**
```css
/* 垂直居中所有子项 */
.container {
  display: flex;
  align-items: center;
  height: 400px; /* 必须设置容器高度 */
}

/* 子项不同高度时的基线对齐 */
.container {
  display: flex;
  align-items: baseline;
}
```

通过合理使用 `align-items`，可快速实现复杂的布局对齐需求，减少传统布局中依赖定位或边距的繁琐操作。

## justify-content和align-items的区别
在 Flex 布局中，`justify-content` 和 `align-items` 是控制对齐的两个核心属性，但它们的**作用方向**和**适用场景**有本质区别。以下是详细对比：

---

### **1. 作用方向不同**
| 属性               | 作用方向           | 图示说明                  |
|--------------------|--------------------|--------------------------|
|**`justify-content`**| **主轴(main axis)** 对齐 | →→→→→（水平方向默认）      |
|**`align-items`**| **交叉轴(cross axis)** 对齐 | ↑↑↑↑↑（垂直方向默认）      |

- **主轴方向**由 `flex-direction` 决定（默认 `row` 水平，`column` 垂直）。  
- **交叉轴**始终与主轴垂直。

---

### **2. 具体功能对比**
#### **`justify-content`（主轴对齐）**
控制子元素在 **主轴方向** 上的排列方式，常用值：
- `flex-start`：向主轴起点对齐（左/上）  
- `flex-end`：向主轴终点对齐（右/下）  
- `center`：居中  
- `start / end` : 类似 flex-start 和 flex-end，但行为更通用。start 根据书写模式（如 RTL）动态调整起始方向。
​- `left / right`:  仅在主轴为水平方向时有效。left 强制左对齐，right 强制右对齐。若主轴与内联轴不平行，left 等同于 start，right 等同于 end。
- `space-between`：两端对齐，间距均等  
- `space-around`：两侧间距均等
- `space-evenly`: 所有间距（包括容器边缘与项目之间）完全相等
- `stretch`：拉伸填满容器高度/宽度

**示例代码**：
```css
.container {
  display: flex;
  flex-direction: row; /* 主轴水平（默认） */
  justify-content: space-between; /* 水平方向两端对齐 */
}
```
**效果**：  
| 对齐方式 | 效果 |
| :---: | :------: |
| flex-start: 主轴起点对齐 |`[元素1][元素2][元素3]────────────`|
| space-end: 主轴终点对齐 | `────────────[元素1][元素2][元素3]` |
| center: 居中 | `──────[元素1][元素2][元素3]──────` |
| space-between: 两端对齐，间距均等 | `[元素1]──────[元素2]──────[元素3]`|
| space-around: 两侧间距均等 | `───[元素1]───[元素2]───[元素3]───` |
---

#### **`align-items`（交叉轴对齐）**
控制子元素在 **交叉轴方向** 上的对齐方式，常用值：
- `stretch`（默认）：拉伸填满容器高度/宽度  
- `flex-start`：向交叉轴起点对齐（顶部/左侧）  
- `flex-end`：向交叉轴终点对齐（底部/右侧）  
- `center`：居中  
- `baseline`：按基线对齐（文本类元素）  

**示例代码**：
```css
.container {
  display: flex;
  flex-direction: row; /* 主轴水平 */
  align-items: center; /* 垂直方向居中 */
}
```
**效果**：  
```
      [元素1]
──────[元素2]──────
      [元素3]
```

---

### **3. 经典场景对比**
#### **场景1：水平导航栏**
```css
.nav {
  display: flex;
  justify-content: space-between; /* 水平分散对齐 */
  align-items: center; /* 垂直居中 */
  height: 100px;
}
```
- `justify-content`：控制导航项的水平间距  
- `align-items`：确保文字垂直居中  

#### **场景2：垂直居中卡片**
```css
.card-container {
  display: flex;
  flex-direction: column; /* 主轴垂直 */
  justify-content: center; /* 垂直方向居中 */
  align-items: center; /* 水平方向居中 */
  height: 300px;
}
```
- `justify-content`：控制卡片在垂直方向的位置  
- `align-items`：控制卡片在水平方向的位置  

---

### **4. 记忆技巧**
- **`justify-content`**：记住 "**主轴**" 的 "**主**" 字像 "—"（横线），代表水平方向（默认）。  
- **`align-items`**：记住 "**交叉**" 的 "丨"（竖线），代表垂直方向（默认）。  

---

### **5. 微信小程序注意事项**
1. 默认 `flex-direction: row`，需显式修改为 `column` 切换主轴方向。  
2. 部分旧版本可能需要 `-webkit-` 前缀（现代工具已兼容）。  
3. 对单个子元素使用 `align-self` 可覆盖 `align-items` 的设置。  

通过理解这两个属性的方向差异，可以精准控制 Flex 布局中的对齐效果。

## aspect-ratio

**`aspect-ratio`** 是 CSS 的一个现代属性，用于直接控制元素的 **宽高比**（Width-to-Height Ratio），无需手动计算高度或宽度。它特别适合响应式布局中需要固定比例的场景（如图片、视频、卡片等）。

1. **基本语法**
```css
.element {
  aspect-ratio: <width> / <height>;
}
```
- **`<width> / <height>`**：表示宽高比，可以是整数、小数或变量（如 `16/9`、`1/1`、`4/3`）。
- **默认值**：`auto`（无固定比例，依赖内容或显式宽高）。

---

2. **核心作用**

- **强制保持元素宽高比**
即使宽度变化，高度会自动按比例调整：
```css
.box {
  width: 100%;      /* 宽度随父容器变化 */
  aspect-ratio: 16/9; /* 高度 = 宽度 ÷ 16 × 9 */
}
```
**效果**：  
当父容器宽度为 `800px` 时，高度自动计算为 `450px`（`800 ÷ 16 × 9`）。

- **替代传统 Hack 方法**
旧方案需用 `padding-top` 模拟比例（如 `padding-top: 56.25%` 对应 `16:9`），而 `aspect-ratio` 更直观：
```css
/* 传统方式（需配合绝对定位） */
.old-box {
  position: relative;
  padding-top: 56.25%; /* 16:9 比例 */
}
.old-box > .content {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

/* 现代方式（直接声明） */
.new-box {
  aspect-ratio: 16/9;
}
```

---

3. **常见应用场景**
- **响应式图片/视频容器**
确保媒体内容始终按比例显示：
```css
.video-container {
  width: 100%;
  aspect-ratio: 16/9;
  background: #000;
}
```
```html
<div class="video-container">
  <iframe src="..."></iframe>
</div>
```

- **方形网格布局**
创建等宽等高的网格项（如相册缩略图）：
```css
.grid-item {
  width: 100%;
  aspect-ratio: 1/1; /* 1:1 正方形 */
  object-fit: cover; /* 防止图片变形 */
}
```

- **动态广告位**
固定广告横幅的宽高比（如 `3:1`）：
```css
.ad-banner {
  max-width: 1200px;
  aspect-ratio: 3/1;
}
```

---

4. **与其他属性的交互**
 
- **优先级规则**
若同时设置 `width`、`height` 和 `aspect-ratio`：  
  - `aspect-ratio` 会覆盖显式的 `height`（但 `width` 优先）。  
  - 使用 `min-width`/`max-width` 可约束比例效果。

- **结合 `object-fit`**
防止媒体内容（如图片）变形：
```css
.card img {
  width: 100%;
  aspect-ratio: 4/3;
  object-fit: cover; /* 裁剪填充 */
}
```

- **与 Flex/Grid 布局协作**
在弹性或网格布局中保持子元素比例：
```css
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
}
.grid-item {
  aspect-ratio: 1/1; /* 强制网格项为正方形 */
}
```

---

5. **浏览器兼容性**

- **支持**：Chrome 88+、Firefox 89+、Safari 15.4+、Edge 88+。  
- **不兼容**：需为旧版浏览器提供备用方案（如 `@supports` 检测）：
```css
.box {
  width: 100%;
  height: 0;
  padding-top: 56.25%; /* 16:9 备用 */
}

@supports (aspect-ratio: 16/9) {
  .box {
    aspect-ratio: 16/9;
    padding-top: 0; /* 禁用备用 */
  }
}
```

---
6. **注意事项**

- **冲突属性**：显式设置 `height` 会覆盖 `aspect-ratio`（除非 `height: auto`）。  
- **百分比宽度**：父容器需有明确宽度，否则比例计算可能失效。  
- **替换元素**（如 `<img>`、`<video>`）：默认优先使用其原生宽高，需显式设置 `width: 100%` 或 `height: auto` 以启用比例控制。

