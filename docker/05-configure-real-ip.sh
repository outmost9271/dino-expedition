#!/bin/sh
set -eu

output=/etc/nginx/conf.d/00-real-ip.conf
trusted_proxy_cidrs=${TRUSTED_PROXY_CIDRS:-127.0.0.1/32,::1/128}
real_ip_header=${REAL_IP_HEADER:-X-Forwarded-For}

case "$real_ip_header" in
    X-Forwarded-For|X-Real-IP) ;;
    *)
        echo "$0: REAL_IP_HEADER 只允许 X-Forwarded-For 或 X-Real-IP" >&2
        exit 1
        ;;
esac

normalized_cidrs=$(printf '%s' "$trusted_proxy_cidrs" | tr ',' ' ')
temporary_file="${output}.tmp"
count=0

umask 022
: > "$temporary_file"
printf '%s\n' '# 此文件由 05-configure-real-ip.sh 自动生成。' >> "$temporary_file"

for cidr in $normalized_cidrs; do
    case "$cidr" in
        *[!0-9A-Fa-f.:/]*|'')
            echo "$0: TRUSTED_PROXY_CIDRS 包含不安全或无效的地址：$cidr" >&2
            rm -f "$temporary_file"
            exit 1
            ;;
    esac

    printf 'set_real_ip_from %s;\n' "$cidr" >> "$temporary_file"
    count=$((count + 1))
done

if [ "$count" -eq 0 ]; then
    echo "$0: TRUSTED_PROXY_CIDRS 至少需要一个可信代理地址或网段" >&2
    rm -f "$temporary_file"
    exit 1
fi

printf 'real_ip_header %s;\n' "$real_ip_header" >> "$temporary_file"
printf '%s\n' 'real_ip_recursive on;' >> "$temporary_file"
mv "$temporary_file" "$output"

echo "$0: 已配置 $count 个可信代理地址或网段，原始地址头为 $real_ip_header"
