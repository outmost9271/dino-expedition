FROM nginx:1.31.4-alpine3.24-slim@sha256:1870de6d59aafee152589b64404556d2535922cdd998e6dac1c4888c938ed8f9

ARG BUILD_DATE="unknown"
ARG VCS_REF="unknown"
ARG VERSION="1.0.0-nginx1.31.4-alpine3.24-slim"

LABEL org.opencontainers.image.title="中华恐龙考察队" \
      org.opencontainers.image.description="中华恐龙考察队 Nginx 静态生产镜像" \
      org.opencontainers.image.source="https://github.com/outmost9271/dino-expedition" \
      org.opencontainers.image.url="https://github.com/outmost9271/dino-expedition" \
      org.opencontainers.image.documentation="https://github.com/outmost9271/dino-expedition/blob/main/README.md" \
      org.opencontainers.image.version="${VERSION}" \
      org.opencontainers.image.revision="${VCS_REF}" \
      org.opencontainers.image.created="${BUILD_DATE}" \
      org.opencontainers.image.base.name="docker.io/library/nginx:1.31.4-alpine3.24-slim" \
      org.opencontainers.image.base.digest="sha256:1870de6d59aafee152589b64404556d2535922cdd998e6dac1c4888c938ed8f9"

ENV TRUSTED_PROXY_CIDRS="127.0.0.1/32,::1/128" \
    REAL_IP_HEADER="X-Forwarded-For"

RUN rm -f /etc/nginx/conf.d/default.conf \
    && rm -rf /usr/share/nginx/html/*

COPY --chmod=0755 docker/05-configure-real-ip.sh /docker-entrypoint.d/05-configure-real-ip.sh
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY assets/ /usr/share/nginx/html/assets/
COPY audio/ /usr/share/nginx/html/audio/
COPY icon.svg index.html manifest.webmanifest registerSW.js robots.txt sw.js /usr/share/nginx/html/
COPY workbox-*.js /usr/share/nginx/html/

RUN /docker-entrypoint.d/05-configure-real-ip.sh \
    && nginx -t

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget -q -O /dev/null http://127.0.0.1/healthz || exit 1
