FROM python:3.9-slim

# Create non-root user without package operations
RUN useradd -m runner && \
    chmod 755 /home/runner

USER runner
WORKDIR /home/runner