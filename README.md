# 中华恐龙考察队·Nginx 静态版

本分支仅保存已经构建好的静态生产文件，可直接部署到 Nginx；不包含工程源码、便携版目录或发布压缩包。

## 部署

1. 将本分支文件复制到 `/usr/share/nginx/html/`，部署时可排除 `README.md` 与 `nginx.conf`。
2. 用本分支的 `nginx.conf` 替换 `/etc/nginx/conf.d/default.conf`，或把其中的 `server` 配置合并到现有站点。
3. 检查并重新加载配置：

```bash
nginx -t
nginx -s reload
```

站点使用单页应用回退规则，并包含离线 PWA 文件。修改源码请切换到 `server` 分支；需要本地双击运行的版本请切换到 `portable-html` 分支。
