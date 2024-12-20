# 快速开始

本节将介绍如何在项目中使用 `plus-three`。

`plus-three`里内置场景，相机，渲染器，控制器等。理论上只需要把模型给到 `plus-three` 就可以展示出来。

## 安装

### 使用包管理器 <el-tag  effect="dark">推荐</el-tag>

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

## 使用步骤

- 1. 导入库

```ts
import { PlusThree } from 'plus-three'
```

- 2. 创建模型/ 导入模型

```ts
import { BoxGeometry, MeshBasicMaterial, Mesh } from 'three'

const geometry = new BoxGeometry(5, 5, 5)
const material = new MeshBasicMaterial({
  color: '#00eaff',
  wireframe: true
})
const model = new Mesh(geometry, material)
```

- 3. 设置容器

```ts
const container = document.body
```

- 4. 创建实例

```ts
const plusThree = new PlusThree(model, container)
```

## 简单示例

:::demo

home/home

:::
