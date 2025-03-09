FROM python:3.9-slim

# Use Ubuntu package mirrors
RUN sed -i 's/deb.debian.org/archive.ubuntu.com/g' /etc/apt/sources.list && \
    sed -i 's/security.debian.org/security.ubuntu.com/g' /etc/apt/sources.list && \
    apt-get update && \
    apt-get install -y --no-install-recommends \
    ca-certificates \
    gnupg && \
    useradd -m runner && \
    chmod 755 /home/runner && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

USER runner
WORKDIR /home/runner