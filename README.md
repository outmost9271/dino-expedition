# 中华恐龙考察队

面向六岁儿童的无广告益智小游戏网站。采用 `Vite + React + TypeScript + Phaser 3`，无需账号，进度通过 `IndexedDB` 保存在当前浏览器。

## 分支用途

- `main`：仅包含可直接部署到 Nginx 的静态生产文件。
- `portable-html`：仅包含可下载后双击运行的便携版文件。
- `server`：当前分支，包含由 Node.js/Vite 服务进程运行的工程源码。

三个分支采用独立文件树；本分支不提交 `dist/`、`portable/` 或发布压缩包。

## 已实现内容

- 三个中国恐龙考察章节，共十八个递进任务
- 装备记忆、十以内数量、规律推理、化石旋转、路线规划、图表记录六类游戏
- `Phaser 3` 路线动画与避障玩法
- 预生成的自然中文旁白及轻量音效，不调用 Windows 系统讲述人
- 本地进度、家长设置、休息提醒
- 响应式触屏界面和离线 `PWA`
- 无广告、无账号、无个人信息采集

## 运行

项目使用 Node.js `22.23.2`。

```bash
source /pi/node/tool/lib/env.sh
eval "$(fnm env --use-on-cd --shell bash)"
fnm use
npm install
npm run dev
```

如需重新生成旁白资源：

```bash
export PATH=/pi/uv/tool/bin:$PATH
npm run voice:generate
```

## 检查

```bash
npm test
npm run build
```

生产文件输出到 `dist/`。

## 本地双击便携版

```bash
npm run build:portable
```

构建结果位于 `portable/`。复制或移动整个文件夹后，直接双击其中的 `index.html` 即可游玩，不需要启动服务器，也不需要联网。旁白保存在 `portable/audio/voice/`，因此不要只移动 `index.html`。
