# Optools

Various software packages.

## Nginx

#### Build script

```bash
./configure --prefix=/opt/nginx --with-http_ssl_module --with-http_gzip_static_module --with-http_realip_module --with-cc-opt=-Wno-error --with-http_gzip_static_module --with-http_stub_status_module --with-http_mp4_module --with-http_flv_module --with-pcre=../pcre-8.33 --with-zlib=../zlib-1.2.8 --with-openssl=../openssl-1.0.1e
```

#### Versions

- nginx-1.4.4-v3 (openssl-1.0.1g, with nginx-1.4.4_57x.path)

## How to compress software packages

```bash
tar -cvzf <package>.tar.gz -C <package> .
```
