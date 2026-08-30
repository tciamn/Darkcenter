# Supernote Private Cloud Setup

**Owner:** aasim@tciamn.org  
**Status:** Planning — awaiting hardware/domain decision  
**Last updated:** 2026-08-30

---

## Goal

Set up a self-hosted Supernote Private Cloud so all Supernote devices (including the Manta) sync to hardware we own — not Supernote's or any third-party servers.

---

## What Supernote Provides

Ratta/Supernote offers official self-hosting via Docker containers.  
Reference: https://support.supernote.com/Whats-New/setting-up-your-own-supernote-private-cloud-beta

### Architecture

```
Supernote Device (HTTPS)
        ↓
Nginx Reverse Proxy  (SSL termination via Let's Encrypt)
        ↓
Supernote Private Cloud Service (HTTP, port 19072)
        ↓
MariaDB + Redis (Docker containers)
```

---

## Requirements

- **OS:** Linux or Unix-like (Synology DSM works). Windows is NOT supported.
- **Disk:** Minimum 50GB
- **Software:** Docker + Docker Compose
- **Domain:** A domain/subdomain pointing to the server (e.g. `cloud.tciamn.org`)
- **SSL:** Free via Let's Encrypt / Certbot

---

## Nginx Config Template (ready to fill in)

```nginx
map $http_upgrade $connection_upgrade {
    default upgrade;
    '' close;
}

server {
    listen 80;
    listen 443 ssl;
    server_name YOUR_DOMAIN;                    # e.g. cloud.tciamn.org
    ssl_certificate /etc/letsencrypt/live/YOUR_DOMAIN/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/YOUR_DOMAIN/privkey.pem;
    ssl_session_timeout 60m;
    ssl_protocols TLSv1.2;
    ssl_ciphers ALL:!ADH:!EXPORT56:RC4+RSA:+HIGH:+MEDIUM:+LOW:+SSLv2:+EXP;
    ssl_prefer_server_ciphers on;
    client_max_body_size 20480m;

    location / {
        proxy_pass http://YOUR_SERVER_IP:19072;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-Scheme $scheme;
        proxy_set_header X-Forwarded-Host $host;
        proxy_set_header X-Forwarded-Port $server_port;
        proxy_buffering on;
        proxy_buffer_size 4k;
        proxy_buffers 8 4k;
        proxy_connect_timeout 6000;
        proxy_send_timeout 6000;
        proxy_read_timeout 6000;
    }

    location ~ ^/socket.io/(.*) {
        proxy_ignore_client_abort on;
        proxy_http_version 1.1;
        proxy_connect_timeout 60s;
        proxy_read_timeout 3600s;
        proxy_send_timeout 3600s;
        proxy_set_header X-NginX-Proxy true;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "$connection_upgrade";
        proxy_pass http://YOUR_SERVER_IP:19072;
        proxy_redirect off;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

---

## Next Steps (blocked on user input)

- [ ] Decide on hosting: home NAS (Synology?), home server, or VPS (Hetzner/DigitalOcean)?
- [ ] Choose subdomain: e.g. `cloud.tciamn.org` — DNS managed via SiteGround
- [ ] Generate Docker Compose + `.env` file once server is known
- [ ] Install Docker on the server
- [ ] Run Certbot for SSL certificate
- [ ] Deploy and point Manta at the new private cloud URL

---

## Devices to Connect

- Supernote Manta (primary)
- iPad
- iPhone (OG Max)
- Any other Supernote devices
