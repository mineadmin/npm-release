# npm-release
发包工具

## 安装

```bash
npm install @mineadmin/npm-release -D
# or
pnpm add @mineadmin/npm-release -D
```

## 用法

1. 在 `package.json` 的 `scripts` 中加入下面代码

```json
"scripts": {
  "publish": "publish"
}
```

2. 执行发版命令

```bash
npm run publish
# or
pnpm publish
```