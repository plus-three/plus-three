# 安装

## 使用包管理器 <el-tag  effect="dark">推荐</el-tag>

**建议您使用包管理器 ([pnpm](https://pnpm.io/)<el-tag  effect="dark">推荐</el-tag> ， [yarn](https://classic.yarnpkg.com/lang/en/)，[npm](https://www.npmjs.com/)) 安装 plus-three**。

::: code-group

```sh [pnpm]
pnpm install  plus-three
```

```sh [yarn]
yarn add  plus-three
```

```sh [npm]
npm install  plus-three   --save
```

:::

## 浏览器直接引入

直接通过浏览器的 HTML 标签导入 plus-three，然后就可以使用全局变量 `PlusProComponents` 了。

根据不同的 CDN 提供商有不同的引入方式， 我们在这里以[unpkg](https://unpkg.com) 和 [jsDelivr](https://jsdelivr.com) 举例。 你也可以使用其它的 CDN 供应商。

### unpkg

```html{1,1}
<head>
   <!--导入plus-three"  -->
   <script src="//unpkg.com/plus-three"></script>
</head>
```

### jsDelivr

```html{1,2}
<head>
  <!--导入plus-three"  -->
  <script src="//cdn.jsdelivr.net/npm/plus-three"></script>
</head>
```

::: warning 注意
默认使用最新版本，使用时建议加上版本号 如使用`0.0.1`版本，防止因版本导致应用出现问题。

[https://cdn.jsdelivr.net/npm/plus-three@0.0.1/index.min.js](https://cdn.jsdelivr.net/npm/plus-three@0.0.1/index.min.js)
:::
