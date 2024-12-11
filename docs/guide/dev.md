# 本地开发指南

## 开发环境

| 类型          | 名称              | 版本           |
| ------------- | ----------------- | -------------- |
| 操作系统      | Windows 11 专业版 | 22000.1098     |
| 开发工具      | Microsoft VS Code | 1.79.0         |
| 调试工具      | Google Chrome     | 104.0.5112.102 |
| 代码版本控制  | git               | 2.37.0         |
| 语言环境      | node              | 18.19.0        |
| 包管理器      | npm               | 8.19.2         |
| 包管理器      | yarn              | 1.22.19        |
| 包管理器      | pnpm              | 8.15.7         |
| node 版本管理 | nvm               | 1.1.7          |
| npm 源管理    | nrm               | 1.2.5          |

## 克隆仓库

```sh
git clone https://github.com/plus-three/plus-three.git
```

```bash
git clone https://gitee.com/plus-three/plus-three.git
```

## 启动项目

```sh
pnpm i
```

## 文档网站预览

```sh
pnpm docs:dev
```

## 本地开发

```sh
pnpm dev
```

## 代码提交

```sh
pnpm run commit  # 全部提交
```

::: tip 提示
**如果需要分次提交** 可以先执行 `git add  ./x/x `，再执行`pnpm run gitcz`，最后执行 `git push origin dev`(或者其他分支)。
:::

## 打包组件

```sh
 pnpm run build
```
