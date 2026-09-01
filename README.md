# 中华恐龙考察队·Nginx 静态生产版

本分支只保存已经构建好的静态生产文件及其 Nginx/Docker 部署配置；不包含工程源码、便携版目录或发布压缩包。

## 容器镜像

镜像发布于 GitHub Container Registry：

```text
ghcr.io/outmost9271/dino-expedition
```

可用标签：

- `main`：`main` 分支最新镜像
- `latest`：当前默认生产镜像
- `1.0.0-nginx1.31.4-alpine3.24-slim`：完整版本标签
- `sha-<提交号>`：与 Git 提交一一对应的不可变版本

基础镜像固定为完整版本及摘要：

```text
nginx:1.31.4-alpine3.24-slim@sha256:1870de6d59aafee152589b64404556d2535922cdd998e6dac1c4888c938ed8f9
```

拉取并运行：

```bash
docker pull ghcr.io/outmost9271/dino-expedition:main

docker run -d \
  --name dino-expedition \
  --restart unless-stopped \
  -p 127.0.0.1:8080:80 \
  ghcr.io/outmost9271/dino-expedition:main
```

健康检查地址为 `/healthz`。镜像同时提供 `linux/amd64` 与 `linux/arm64`。

## 前置 Nginx TLS 卸载

容器内只监听 HTTP 80，由前置 Nginx 终止 TLS。前置代理至少传递以下请求头：

```nginx
location / {
    proxy_http_version 1.1;
    proxy_set_header Connection "";
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_pass http://dino-expedition:80;
}
```

镜像默认只信任环回代理 `127.0.0.1/32` 与 `::1/128`，不会直接信任客户端提交的 `X-Forwarded-For`。前置 Nginx 位于其他地址或容器网络时，必须将其精确地址或专用网段加入 `TRUSTED_PROXY_CIDRS`：

```bash
docker run -d \
  --name dino-expedition \
  --network edge \
  -e TRUSTED_PROXY_CIDRS='172.30.0.10/32' \
  ghcr.io/outmost9271/dino-expedition:main
```

多个地址使用逗号或空格分隔，也支持 IPv6 CIDR：

```text
TRUSTED_PROXY_CIDRS=172.30.0.10/32,10.20.0.0/24,2001:db8::10/128
```

可通过 `REAL_IP_HEADER=X-Real-IP` 改用 `X-Real-IP`；默认值为 `X-Forwarded-For`，并开启递归解析。请只填写真实受控代理，禁止为方便而信任 `0.0.0.0/0`。访问日志采用 JSON 格式，其中：

- `client_ip`：解析后的原始客户端地址
- `proxy_ip`：直接连接容器的可信代理地址
- `forwarded_for`：完整代理链
- `scheme`：根据 `X-Forwarded-Proto` 识别的原始协议

HSTS 应由实际终止 TLS 的前置 Nginx 设置，不应由容器内的 HTTP 服务设置。

## 直接部署到 Nginx

1. 将 `assets/`、`audio/` 及根目录运行文件复制到 `/usr/share/nginx/html/`。
2. 用本分支的 `nginx.conf` 替换 `/etc/nginx/conf.d/default.conf`，或合并到现有配置。
3. 如需识别代理后的客户端地址，在 Nginx 的 `http` 上下文中配置可信代理和 `real_ip_header`。
4. 检查并重新加载：

```bash
nginx -t
nginx -s reload
```

修改源码请切换到 `server` 分支；需要本地双击运行的版本请切换到 `portable-html` 分支。
