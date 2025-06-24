# Use multi-platform base image
FROM node:20

# Install Wasp CLI using the official installer (handles architecture detection)
RUN curl -sSL https://get.wasp-lang.dev/installer.sh | bash

# Copy wasp to a location in PATH
RUN if [ -f "/root/.wasp/bin/wasp" ]; then \
        cp /root/.wasp/bin/wasp /usr/local/bin/wasp && \
        chmod +x /usr/local/bin/wasp; \
    else \
        echo "ERROR: wasp binary not found after installation"; \
        find /root -name "*wasp*" -type f; \
        exit 1; \
    fi

# Verify wasp is accessible
RUN wasp --version

WORKDIR /app

COPY . .

RUN npm install

RUN wasp build

EXPOSE 3000

CMD ["wasp", "start"]