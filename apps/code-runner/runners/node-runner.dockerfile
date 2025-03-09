FROM node:18-slim

RUN useradd -m runner && \
    chmod 755 /home/runner && \
    # apt-get update && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

USER runner
WORKDIR /home/runner