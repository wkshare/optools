# Optools

Various software packages.

## Packages

- ffpresets.tar.gz
- hadoop-1.1.1.tar.gz
- memcached-1.4.15-linux-x86_64.tar.gz
- nginx-1.0.14.tar.gz
- nginx-1.4.2.tar.gz
- nginx-1.4.4.tar.gz
- webhook-ver1.0.tar.gz
- webhook-ver1.1.tar.gz

## Nginx compile args
```bash
./configure --prefix=/opt/nginx --with-http_ssl_module --with-http_gzip_static_module --with-http_realip_module --with-cc-opt=-Wno-error --with-http_gzip_static_module --with-http_stub_status_module --with-http_mp4_module --with-http_flv_module --with-pcre=../pcre-8.33 --with-zlib=../zlib-1.2.8 --with-openssl=../openssl-1.0.1e
```

## How to compress software packages

```bash
tar -cvzf <package>.tar.gz -C <package> .
```
