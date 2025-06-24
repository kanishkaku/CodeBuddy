# Use multi-platform base image
FROM --platform=linux/amd64 node:20
RUN curl -sSL https://get.wasp-lang.dev/installer.sh | bash

# Copy wasp to a location in PATH (wasp installer puts it in /root/.local/bin/)
RUN cp /root/.local/bin/wasp /usr/local/bin/wasp && \
    chmod +x /usr/local/bin/wasp

# Verify wasp is accessible
RUN wasp version

WORKDIR /app

COPY . .

RUN npm install

RUN wasp build

EXPOSE 3000

CMD ["wasp", "start"]